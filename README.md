# Kavindu Thennakoon — Portfolio

Personal portfolio built with Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger and Lenis. Projects are synced automatically from the public GitHub API.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Where to change things

| What | File |
| --- | --- |
| Name, contact details, social links, portrait paths, CV | `config/site.ts` |
| Featured repositories (order + optional screenshots), excluded repos | `config/featured-projects.ts` |
| CV project details merged into matching repos | `data/cv-projects.ts` |
| Experience / Education / Skills | `data/*.ts` |

### Portrait photos

1. Put the images in `public/images/` (e.g. `kavindu-portrait.jpg`, 4:5 ratio, ≥ 1200px tall).
2. Set `images.hero` (and optionally `images.about`) in `config/site.ts`.

Until a path is set, the hero shows a typographic "KT" monogram.

### CV

The original PDF is served unchanged from `public/cv/kavindu-thennakoon-cv.pdf`. Replace that file to update it.

### Project screenshots

Add images to `public/projects/` and reference them with `previewImage` in `config/featured-projects.ts` (featured repos) or `projectPreviewImages` (any repo). Projects without a screenshot get an abstract visual generated from their real GitHub metadata.

## GitHub integration

`lib/github.ts` → `GET /api/github/repos`

- Fetches every public repo, following Link-header pagination.
- Excludes forks, archived, empty and profile-README repos, plus anything in `excludedRepos`.
- Enriches each repo with the languages endpoint, `package.json` dependencies (raw.githubusercontent.com, no API quota) and the README only when needed.
- Description priority: CV description (for CV projects) → GitHub description → README summary → neutral fallback. Boilerplate READMEs are ignored.
- Cached server-side with `use cache` and revalidated every 60 minutes. If GitHub fails, the last good data is served; if no data has ever loaded, the CV projects are shown with a notice.
- Unauthenticated by default (60 req/h). An optional server-only `GITHUB_TOKEN` raises the limit; it is never sent to the browser.

## Contact form

Without configuration, the form validates input and opens the visitor's email app with the message pre-filled (mailto). It never pretends a message was sent.

To deliver messages directly, use [Resend](https://resend.com)'s free tier (3,000 emails/month):

1. Create an account and an API key.
2. Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (and optionally `CONTACT_FROM_EMAIL` once you have verified a domain).

Server-side protections: validation, a honeypot field, a minimum fill time and a per-IP rate limit.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the production URL so canonical links, Open Graph tags, `sitemap.xml` and `robots.txt` use the correct domain. On Vercel, the production URL is detected automatically if this variable is not set.
