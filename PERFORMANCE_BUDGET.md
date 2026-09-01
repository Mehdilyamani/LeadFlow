# Personalized demo performance budget

Apply these limits before promoting any prospect demo:

- No demo raster source over 1 MB. Target under 300 KB for heroes and under 200 KB for cards when quality permits.
- Only the logo and visible hero may be preloaded on a homepage.
- Demo content must come from local config and local assets; no database or third-party image origin may block initial rendering.
- Branding must be present in server HTML. Do not wait for `window.location.hostname` before showing the agency.
- Static headings, cards, locations and footers should remain server-renderable. Client JavaScript is reserved for actual interaction.
- No full-screen spinner for static demo data.
- Every `next/image` must reserve its aspect ratio and include an accurate `sizes` value.
- Mobile must have zero horizontal overflow at 375, 390, 393 and 430 px widths.
- Target production TTFB under 800 ms and LCP under 2.5 seconds under normal Vercel/mobile conditions.
- Preview and mobile smoke tests are mandatory before production promotion.

`npm run audit:assets` warns for public raster files over 500 KB and fails if a raster inside `public/demos` exceeds 1 MB.
