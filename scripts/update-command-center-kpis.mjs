import fs from "node:fs";
import path from "node:path";

const targetRepo = process.env.TARGET_REPO || "amerikian/acp-dev-workspace";
const token = process.env.ACP_REPO_TOKEN || process.env.GITHUB_TOKEN || "";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function percentileMedian(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

function daysSince(isoDate, now) {
  if (!isoDate) return 0;
  const t = new Date(isoDate);
  if (Number.isNaN(t.getTime())) return 0;
  return Math.max(0, (now - t) / 86400000);
}

function ratioPercent(numerator, denominator) {
  if (!denominator) return 0;
  return (numerator / denominator) * 100;
}

async function ghApi(urlPath) {
  const url = `https://api.github.com${urlPath}`;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "command-center-kpi-updater",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} ${urlPath}: ${body}`);
  }

  return response.json();
}

async function computeKpis() {
  const now = new Date();

  let dataQuality = "high";
  const notes = [];

  try {
    const repo = await ghApi(`/repos/${targetRepo}`);

    // Optional telemetry calls. If permission is missing, degrade quality instead of hard fallback.
    let pulls = [];
    let pullsClosed = [];
    let issues = [];
    let actions = { workflow_runs: [] };

    try {
      pulls = await ghApi(`/repos/${targetRepo}/pulls?state=open&per_page=100`);
    } catch (error) {
      dataQuality = "medium";
      notes.push(`pulls unavailable: ${String(error)}`);
    }

    try {
      pullsClosed = await ghApi(`/repos/${targetRepo}/pulls?state=closed&per_page=100&sort=updated&direction=desc`);
    } catch (error) {
      dataQuality = "medium";
      notes.push(`closed pulls unavailable: ${String(error)}`);
    }

    try {
      issues = await ghApi(`/repos/${targetRepo}/issues?state=open&per_page=100`);
    } catch (error) {
      dataQuality = "medium";
      notes.push(`issues unavailable: ${String(error)}`);
    }

    try {
      actions = await ghApi(`/repos/${targetRepo}/actions/runs?per_page=50`);
    } catch (error) {
      dataQuality = "medium";
      notes.push(`actions unavailable: ${String(error)}`);
    }

    const pushedAt = new Date(repo.pushed_at);
    const freshnessDays = Math.max(0, Math.floor((now - pushedAt) / 86400000));

    const openPrs = Array.isArray(pulls) ? pulls.length : 0;
    const openIssuesFromIssuesEndpoint = Array.isArray(issues)
      ? issues.filter((issue) => !issue.pull_request).length
      : 0;
    const openIssues = openIssuesFromIssuesEndpoint > 0
      ? openIssuesFromIssuesEndpoint
      : Number(repo.open_issues_count || 0);

    const runs = Array.isArray(actions.workflow_runs) ? actions.workflow_runs : [];
    const relevantRuns = runs.filter((run) => {
      const text = `${run.name || ""} ${run.path || ""}`.toLowerCase();
      return text.includes("preflight") || text.includes("conformance") || text.includes("protocol");
    });

    const completedRelevant = relevantRuns.filter((run) => run.status === "completed");
    const successfulRelevant = completedRelevant.filter((run) => run.conclusion === "success");

    const cutoff7 = new Date(now.getTime() - 7 * 86400000);
    const cutoff30 = new Date(now.getTime() - 30 * 86400000);

    const completed7 = completedRelevant.filter((run) => new Date(run.created_at || run.updated_at || 0) >= cutoff7);
    const completed30 = completedRelevant.filter((run) => new Date(run.created_at || run.updated_at || 0) >= cutoff30);

    const successRate7 = ratioPercent(
      completed7.filter((run) => run.conclusion === "success").length,
      completed7.length,
    );
    const successRate30 = ratioPercent(
      completed30.filter((run) => run.conclusion === "success").length,
      completed30.length,
    );

    let ciFailureStreak = 0;
    for (const run of completedRelevant) {
      if (run.conclusion === "success") break;
      ciFailureStreak += 1;
    }

    const openPrAgeDays = Array.isArray(pulls)
      ? pulls.map((pr) => daysSince(pr.created_at, now))
      : [];
    const prMedianAgeDays = percentileMedian(openPrAgeDays);
    const staleOpenPrs7d = openPrAgeDays.filter((days) => days >= 7).length;

    const issueItems = Array.isArray(issues) ? issues.filter((issue) => !issue.pull_request) : [];
    const openIssueAgeDays = issueItems.map((issue) => daysSince(issue.created_at, now));
    const issueMedianAgeDays = percentileMedian(openIssueAgeDays);
    const staleOpenIssues14d = openIssueAgeDays.filter((days) => days >= 14).length;
    const staleOpenIssues30d = openIssueAgeDays.filter((days) => days >= 30).length;

    const mergedPrs7d = Array.isArray(pullsClosed)
      ? pullsClosed.filter((pr) => pr.merged_at && new Date(pr.merged_at) >= cutoff7).length
      : 0;
    const mergedPrs30d = Array.isArray(pullsClosed)
      ? pullsClosed.filter((pr) => pr.merged_at && new Date(pr.merged_at) >= cutoff30).length
      : 0;

    let reliability;
    if (completedRelevant.length >= 3) {
      reliability = (successfulRelevant.length / completedRelevant.length) * 100;
      notes.push("Reliability based on recent preflight/conformance workflow outcomes.");
    } else {
      const freshnessBoost = freshnessDays <= 2 ? 12 : freshnessDays <= 7 ? 6 : freshnessDays <= 14 ? 0 : -10;
      reliability = 72 + freshnessBoost - Math.min(14, openIssues * 0.9) - Math.min(8, openPrs * 0.8);
      notes.push("Reliability estimated from repository freshness and issue/PR pressure due to limited workflow history.");
    }

    const latestRelevant = completedRelevant[0];
    let interop = latestRelevant?.conclusion === "success" ? 78 : 62;
    if (!latestRelevant) {
      interop = 68;
      notes.push("Interop estimated because no recent relevant workflow run was available.");
    }
    interop += freshnessDays <= 7 ? 4 : 0;

    const speed = 84 - (openPrs * 4) - (openIssues * 1.5) + (freshnessDays <= 2 ? 6 : 0);

    const releaseReadiness = clamp(
      (clamp(reliability) * 0.35)
      + (clamp(interop) * 0.2)
      + (clamp(speed) * 0.2)
      + (clamp(successRate7) * 0.15)
      + ((100 - Math.min(40, staleOpenPrs7d * 10)) * 0.1),
    );

    const signal =
      (clamp(reliability) * 0.35) +
      (clamp(interop) * 0.25) +
      ((100 - Math.min(40, openIssues * 4)) * 0.2) +
      ((100 - Math.min(30, openPrs * 10)) * 0.2);

    return {
      kpis: {
        reliability: clamp(reliability),
        interop: clamp(interop),
        speed: clamp(speed),
        signal: clamp(signal),
        releaseReadiness,
      },
      meta: {
        generatedAt: now.toISOString(),
        source: `github:${targetRepo}`,
        dataQuality,
        note: notes.join(" ") || "Derived from repository telemetry.",
        links: {
          repo: `https://github.com/${targetRepo}`,
          pulls: `https://github.com/${targetRepo}/pulls`,
          issues: `https://github.com/${targetRepo}/issues`,
          actions: `https://github.com/${targetRepo}/actions`,
        },
        telemetry: {
          openPrs,
          openIssues,
          freshnessDays,
          relevantCompletedRuns: completedRelevant.length,
          relevantSuccessfulRuns: successfulRelevant.length,
          ciFailureStreak,
          ciSuccessRate7d: clamp(successRate7),
          ciSuccessRate30d: clamp(successRate30),
          prMedianAgeDays: clamp(prMedianAgeDays, 0, 365),
          issueMedianAgeDays: clamp(issueMedianAgeDays, 0, 365),
          staleOpenPrs7d,
          staleOpenIssues14d,
          staleOpenIssues30d,
          mergedPrs7d,
          mergedPrs30d,
        },
        risks: {
          ciFailureStreakRisk: ciFailureStreak >= 2 ? "high" : ciFailureStreak === 1 ? "medium" : "low",
          stalenessRisk: freshnessDays >= 3 ? "medium" : "low",
          qualityConfidenceRisk: dataQuality === "high" ? "low" : dataQuality === "medium" ? "medium" : "high",
          backlogAgingRisk: staleOpenIssues30d >= 5 || staleOpenPrs7d >= 3 ? "high" : staleOpenIssues14d >= 3 ? "medium" : "low",
        },
      },
    };
  } catch (error) {
    return {
      kpis: {
        reliability: 70,
        interop: 65,
        speed: 60,
        signal: 55,
      },
      meta: {
        generatedAt: now.toISOString(),
        source: `fallback:${targetRepo}`,
        dataQuality: "low",
        note: `Fallback values used because telemetry fetch failed: ${String(error)}`,
      },
    };
  }
}

async function main() {
  const payload = await computeKpis();

  const paths = [
    path.resolve("docs", "command-center", "data", "kpi-live.json"),
    path.resolve("docs", "ops-hub-x7k9m2", "data", "kpi-live.json"),
  ];

  for (const filePath of paths) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log(`wrote ${filePath}`);
  }

  console.log(JSON.stringify(payload.meta, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
