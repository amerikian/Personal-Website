import fs from "node:fs";
import path from "node:path";

const baseDir = path.resolve("docs", "command-center");
const pages = [
  "index.html",
  "ops-wall.html",
  "trends.html",
  "line-cards.html",
];

const expectedNav = [
  ["./index.html", "Strategy Dashboard"],
  ["./ops-wall.html", "Ops Wall"],
  ["./trends.html", "Weekly Trends"],
  ["./line-cards.html", "LINE Cards Studio"],
];

const expectedActive = {
  "index.html": "./index.html",
  "ops-wall.html": "./ops-wall.html",
  "trends.html": "./trends.html",
  "line-cards.html": "./line-cards.html",
};

const expectedShellVersion = "v2-locked-2026-03-16";
const expectedThemeKey = "acp-cc-theme";

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function parseAnchors(navHtml) {
  const anchors = [...navHtml.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  return anchors.map((match) => {
    const attrs = match[1] || "";
    const hrefMatch = attrs.match(/href\s*=\s*"([^"]+)"/i);
    const classMatch = attrs.match(/class\s*=\s*"([^"]+)"/i);
    const text = (match[2] || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    return {
      href: hrefMatch ? hrefMatch[1] : "",
      text,
      className: classMatch ? classMatch[1] : "",
    };
  });
}

for (const page of pages) {
  const filePath = path.join(baseDir, page);
  if (!fs.existsSync(filePath)) {
    fail(`${page} is missing`);
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");

  const navMatch = html.match(/<nav\b([^>]*)>([\s\S]*?)<\/nav>/i);
  if (!navMatch) {
    fail(`${page} has no nav block`);
    continue;
  }

  const navAttrs = navMatch[1] || "";
  const navHtml = navMatch[2] || "";

  if (!/aria-label\s*=\s*"Command center navigation"/i.test(navAttrs)) {
    fail(`${page} nav missing aria-label=\"Command center navigation\"`);
  }

  const shellVersionMatch = navAttrs.match(/data-cc-shell-version\s*=\s*"([^"]+)"/i);
  if (!shellVersionMatch) {
    fail(`${page} nav missing data-cc-shell-version`);
  } else if (shellVersionMatch[1] !== expectedShellVersion) {
    fail(`${page} nav shell version mismatch: ${shellVersionMatch[1]}`);
  }

  const anchors = parseAnchors(navHtml);
  if (anchors.length !== expectedNav.length) {
    fail(`${page} nav has ${anchors.length} links, expected ${expectedNav.length}`);
  }

  for (let i = 0; i < Math.min(anchors.length, expectedNav.length); i += 1) {
    const expected = expectedNav[i];
    const actual = anchors[i];
    if (actual.href !== expected[0] || actual.text !== expected[1]) {
      fail(`${page} nav mismatch at position ${i + 1}: got (${actual.href}, ${actual.text})`);
    }
  }

  const activeLinks = anchors.filter((a) => /(^|\s)active(\s|$)/.test(a.className));
  if (activeLinks.length !== 1) {
    fail(`${page} should have exactly one active nav link, found ${activeLinks.length}`);
  } else if (activeLinks[0].href !== expectedActive[page]) {
    fail(`${page} active nav href mismatch: ${activeLinks[0].href}`);
  }

  const themeBtnMatch = html.match(/<button\b([^>]*)id\s*=\s*"themeBtn"([^>]*)>/i);
  if (!themeBtnMatch) {
    fail(`${page} missing themeBtn`);
  } else {
    const themeBtnAttrs = `${themeBtnMatch[1]} ${themeBtnMatch[2]}`;
    const themeKeyMatch = themeBtnAttrs.match(/data-cc-theme-key\s*=\s*"([^"]+)"/i);
    if (!themeKeyMatch) {
      fail(`${page} themeBtn missing data-cc-theme-key`);
    } else if (themeKeyMatch[1] !== expectedThemeKey) {
      fail(`${page} themeBtn key mismatch: ${themeKeyMatch[1]}`);
    }
  }

  if (!new RegExp(`const\\s+themeKey\\s*=\\s*\"${expectedThemeKey}\"`).test(html)) {
    fail(`${page} themeKey constant mismatch`);
  }

  console.log(`PASS: ${page}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("PASS: Command center shell drift check complete");
