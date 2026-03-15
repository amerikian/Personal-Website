# Command Center Dashboards

Interactive HTML command centers for solo PM/dev execution in this workspace.

## Files

- `index.html`: main strategic dashboard (KPIs, risk matrix, testing checklist, opportunities, weekly focus)
- `ops-wall.html`: operations wall (runbook commands, triage matrix, live status framing)
- `trends.html`: weekly trend view with snapshot chart and history table
- `security.js`: optional client-side access gate for static hosting
- `HOSTING_AND_INTEGRATIONS.md`: deployment options + LINE/iMessage-provider integration guidance
- `notify-bridge/`: minimal Node bridge for LINE push alerts and iMessage-provider webhook forwarding

## Open locally

From the workspace root:

```bash
"$BROWSER" "file:///workspaces/ACP Dev/command-center/index.html"
"$BROWSER" "file:///workspaces/ACP Dev/command-center/ops-wall.html"
"$BROWSER" "file:///workspaces/ACP Dev/command-center/trends.html"
```

## Notes

- `index.html` persists edited KPI/risk/testing values in browser localStorage.
- `index.html` now captures a weekly snapshot automatically (stored in localStorage history).
- Use Export button in `index.html` to download current state as JSON.
- Use Import button in `index.html` to load a previously exported state JSON.
- Generate weekly PM digest text directly in `index.html` and `trends.html`.
- Both pages are standalone and require no build step.
- Dashboards are linked to each other through top navigation chips.
- GitHub Pages deploy workflow is included at `.github/workflows/command-center-pages.yml`.
- Strict preflight alert workflow is included at `.github/workflows/protocol-preflight-alert.yml`.
- Vercel deploy workflow is included at `.github/workflows/command-center-vercel.yml`.
