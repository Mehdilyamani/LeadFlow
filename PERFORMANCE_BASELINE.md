# LeadFlow demo performance baseline

Measured on 1 September 2026 from the production build, before the reliability pass.

## Architecture

- Next.js 16.1.1 with the App Router and Turbopack.
- Demo config lives in `app/demoBrands.ts`.
- The root layout resolved the hostname on the server, but the actual page selection still happened inside large client components through context for some routes.
- `/biens` could wait for Supabase before a personalized static catalogue was selected.
- No middleware, service worker, PWA, `vercel.json`, custom webfont, map embed or video is used by the personalized real-estate demos.
- Vercel Analytics and Speed Insights are the only global measurement scripts.
- 49 files in `app` contain a client-component boundary. Most are unrelated legacy commerce/admin code.

## Critical findings

| Area | Baseline |
| --- | --- |
| Good Kech remote images | 19 unique Unsplash photos were required at runtime |
| Mobile hero | Next image optimizer returned HTTP 500 when its Unsplash fetch failed; the mobile capture showed a nearly black hero |
| Broken source | One Good Kech Unsplash URL returned HTTP 404 |
| Initial image preloads | Logo, hero and three property cards (5 image preloads) |
| Good Kech animation | Homepage and shared UI imported Framer Motion and hydrated static presentation sections |
| Raw initial scripts | About 784.7 KB across 14 script files in the earlier production measurement |
| Personalized route data | Demo routes could perform a Supabase request despite using local demo property data |
| Build safety | `next.config.ts` explicitly ignored TypeScript build errors |
| Build root | Turbopack inferred `C:\Users\Lyama` because of a second parent lockfile |

The direct mobile failure was not a React crash: the branded HTML returned successfully, while remote image optimization failed independently. Depending on a third-party image origin during the first request made the result intermittent.

## Public asset audit

The repository contains unrelated legacy media that is much larger than the demo budget:

- Largest video: 82.42 MB.
- Largest raster image: 21.13 MB.
- 12 raster images exceed 500 KB.

These files are not referenced by Good Kech Immo or Immo Built and were preserved to avoid changing unrelated product behavior. Run `npm run audit:assets` for the current sorted report.

## Baseline commands

```powershell
npm run typecheck
npm run build
npm run audit:assets
curl.exe -o NUL -s -w "DNS: %{time_namelookup}`nConnect: %{time_connect}`nTTFB: %{time_starttransfer}`nTotal: %{time_total}`n" https://good-kech-immo.leadflowimmo.com
```
