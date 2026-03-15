# Hosting and Messaging Integrations

## 1) Are dashboards linked together?

Yes. The pages now include direct navigation links:

- `index.html` <-> `ops-wall.html`
- `index.html` <-> `ops-wall.html` <-> `trends.html`

## 2) Hosting options

## Option A: GitHub Pages (fastest for static dashboards)

1. Put `command-center/` in a repository.
2. In repository settings, enable GitHub Pages from the branch/folder that contains these files.
3. Publish and use the generated URL.

Prebuilt workflow included in this repo:

- `.github/workflows/command-center-pages.yml`

Important limitation observed in this repository setup:

- GitHub API returned `422` when enabling Pages on this private repo with message: `Your current plan does not support GitHub Pages for this repository.`

If you must keep the repo private, use Option B (Vercel/Netlify/Cloudflare Pages) or upgrade to a plan/setting combination that supports private-repo Pages.

## 2.1) Optional access gate

Client-side passcode gate script is included:

- `command-center/security.js`

To enable:

1. Set `REQUIRED_PASSCODE` in that file.
2. Redeploy static pages.

Note: this is a convenience gate, not a substitute for true server-side auth.

Good for:

- Static dashboards
- Team read access
- Zero server runtime for UI pages

## Option B: Vercel/Netlify/Cloudflare Pages

1. Point project root to `command-center/`.
2. Deploy as static site.
3. Optional: protect with password/auth at edge.

Vercel-ready config is included:

- `command-center/vercel.json`

Quick deploy with Vercel CLI:

```bash
cd /workspaces/ACP Dev/command-center
npx --yes vercel@latest login
npx --yes vercel@latest --prod
```

CI deploy workflow included:

- `.github/workflows/command-center-vercel.yml`

Required GitHub secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Private-access note:

- Vercel projects are not private by default at URL level. Use Vercel access controls (when available on your plan), or keep `security.js` passcode gate enabled for an additional front-door prompt.

Good for:

- Faster previews
- Domain + edge controls

## 3) Mobile friendliness

Already applied:

- Responsive grid collapse
- Scrollable tables on narrow screens
- Touch-friendly buttons and nav chips
- Adaptive card spacing
- Dedicated trend page with touch-safe controls and responsive table/graph layout

## 4) LINE integration

A starter bridge is included at `notify-bridge/`.

What it does:

- POST `/notify/line` to push text alerts via LINE Messaging API.

Required environment variable:

- `LINE_CHANNEL_ACCESS_TOKEN`

Payload shape:

```json
{
  "userId": "LINE_USER_ID",
  "title": "ACP Alert",
  "body": "Strict preflight failed",
  "url": "https://your-dashboard.example"
}
```

## 5) iMessage integration

Direct generic iMessage bot APIs are not broadly available.
For production messaging, route through an approved Apple Messages for Business provider.

The bridge supports this with endpoint:

- POST `/notify/imessage-provider`

Required environment variable:

- `IMESSAGE_PROVIDER_WEBHOOK_URL`

This endpoint forwards normalized alert payloads to your provider webhook.

## 6) Run the bridge locally

```bash
cd /workspaces/ACP Dev/command-center/notify-bridge
npm install
LINE_CHANNEL_ACCESS_TOKEN=your_token_here npm start
```

Health check:

```bash
curl http://localhost:8787/health
```

## 7) Suggested production architecture

- Static dashboard hosting: GitHub Pages or Vercel
- Alert bridge runtime: small container/serverless endpoint
- Secrets: store in host secret manager
- Trigger source: strict preflight runner or CI workflow calls notify endpoints on fail/pass

## 8) CI alert automation

Workflow included:

- `.github/workflows/protocol-preflight-alert.yml`

It runs strict preflight on schedule or manual dispatch and sends pass/fail alerts when bridge URL secret is present.

Recommended GitHub Secrets:

- `NOTIFY_BRIDGE_URL` (for example: `https://notify-bridge.yourdomain.com`)
- `LINE_USER_ID` (optional; only needed for LINE failure alerts)
