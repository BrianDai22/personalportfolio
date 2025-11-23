# Brian Dai – Portfolio

Vite + React single-page portfolio with AI chat. Target deployment is AWS S3 + CloudFront for the static site and a tiny Gemini proxy behind API Gateway/Lambda to keep the API key server-side.

## Features
- Cyber/tech visual theme, scroll-spy navigation, AI chat assistant
- Projects/skills/experience pulled from `constants.ts`
- Resume download served as a static asset (no inline base64)

## Getting Started (local)
```bash
npm install
# copy env template
cp .env.example .env.local
# set VITE_GEMINI_PROXY_URL to your dev proxy endpoint (e.g. http://localhost:8787/gemini)
npm run dev
```

## Environment Variables
| Name | Scope | Description |
| --- | --- | --- |
| `VITE_GEMINI_PROXY_URL` | frontend | URL of the server-side Gemini proxy (API Gateway/Lambda, etc.). No keys go to the browser. |
| `GEMINI_API_KEY` | server | Stored only on the proxy/Lambda (e.g. AWS SSM/Secrets Manager). |
| `GEMINI_MODEL` | server (optional) | Override model name (defaults `gemini-2.5-flash`). |

## Gemini Proxy (serverless)
- Sample handler: `api/gemini-proxy.ts` (Node 18, API Gateway + Lambda style). Reads `GEMINI_API_KEY`, calls Gemini, returns `{ text }`.
- Deploy any equivalent edge/Lambda/Container service, then set `VITE_GEMINI_PROXY_URL` to that endpoint.

## Build
```bash
npm run build
```
Output goes to `dist/`.

## AWS Deployment (static site)
1) Build: `npm run build`
2) Sync to S3: `aws s3 sync dist/ s3://<bucket> --delete`
3) CloudFront:
   - Origin: S3 bucket
   - SPA fallback: custom error responses for 403/404 -> `/index.html` (200)
   - Caching: long cache for hashed assets; short for HTML
   - Security headers: HSTS, X-Content-Type-Options=nosniff, Referrer-Policy=strict-origin-when-cross-origin, CSP allowing your domains (and fonts.googleapis.com/gstatic if you keep Google Fonts)

   Helpers (in `aws/`):
   - `aws/cloudfront-errors.json` — example 403/404 -> `/index.html` rules
   - `aws/cloudfront-headers.json` — example response-headers policy with HSTS, CSP, etc. (update `connect-src`/domains as needed)

## Accessibility & Performance
- Images are lazy-loaded; consider replacing PNG/JPEG with WebP/AVIF for further weight savings.
- Animations respect `prefers-reduced-motion`.

## Notes for Recruiters / Reviewers
- No secrets ship to the browser; the Gemini key must live in the proxy.
- Resume downloads from `resume.pdf` bundled in the app (no inline base64).
