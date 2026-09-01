# Personalized demo optimization report

## Results

| Issue | Before | Fix | After |
| --- | --- | --- | --- |
| Good Kech hero reliability | Runtime Unsplash fetch could return 500; mobile capture showed no usable hero photo | Stored the exact selected photos as local, resized WebP assets | Local Next optimizer returns 200; 640 px hero response is about 31.8 KB |
| Remote demo dependency | Good Kech: 19 remote photos; Immo Built: 38 remote references | Localized both demo catalogues, galleries, areas and heroes | 0 runtime Unsplash references in either personalized demo |
| Oversized demo sources | Remote requests asked for images as wide as 1800–2000 px | Local source images capped and compressed | Good Kech maximum 280.5 KB; Immo Built maximum 261.1 KB |
| Immo Built logo | Original PNG was about 1.03 MB | Added a visually equivalent 320 px WebP derivative | 9 KB logo served through `next/image` |
| Initial preloading | 5 images, including three property cards | Priority limited to logo and hero; catalogue only prioritizes its first visible card | 2 homepage image preloads |
| Animation/runtime cost | Framer Motion hydrated static demo sections | CSS-only entrance motion plus a tiny client mobile-menu boundary | No Framer Motion reference in personalized demo HTML; reduced hydration work |
| Raw initial scripts | About 784.7 KB / 14 scripts | Server-side brand routing and smaller client boundaries | About 727 KB / 12 scripts (raw local files; roughly 7% lower) |
| Demo TTFB | Cold local measurement around 587 ms; demo pages could wait for Supabase | Select brand before rendering and return static demo data before database code | Warm local production: Good Kech `/` ~53 ms, `/biens` ~45 ms; Immo Built `/` ~57 ms, `/biens` ~31 ms |
| Deployment safety | Build skipped TypeScript validation | Removed `ignoreBuildErrors`; fixed Turbopack project root | Production build compiles and runs TypeScript validation |
| Preview safety | Hostname-only branding was difficult to verify on Vercel previews | Added `/demo-preview/[slug]` for home, catalogue and details | Both current brands pass preview route smoke tests |

## Mobile acceptance

Automated Chrome device metrics passed at 375x667, 390x844, 393x852 and 430x932. The check verifies exact viewport width, no horizontal overflow, visible branding, correct phone, successful above-the-fold images, no runtime exceptions and no failed resource requests.

```powershell
npm run build
npm run start -- -p 3000
$env:DEMO_BASE_URL='http://127.0.0.1:3000'
npm run demo:smoke
npm run demo:mobile
```

## Hydration

Production hostname branding is resolved from request headers before the page is selected. Good Kech and Immo Built home, catalogue and detail routes render the correct brand in server HTML and do not wait for client-side hostname discovery or Supabase. Client JavaScript remains only for real interactions such as filters, gallery controls and the mobile menu.

## Remaining risks

- The custom production subdomains still require healthy DNS, Vercel domain assignment and TLS. Application tests cannot repair an edge connection that fails before HTTP.
- The main/generic property experience still uses remote image sources and Supabase by design; it was not silently rewritten as part of the personalized-demo fix.
- Large unrelated legacy assets remain in `public`. The audit warns about them, but removing them requires confirming their use outside the demo routes.
- Full-repository ESLint currently reports pre-existing errors in unrelated commerce/API files. `npm run lint:demo`, TypeScript and the production build pass for the demo delivery surface.
