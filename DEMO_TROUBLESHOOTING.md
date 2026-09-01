# Demo troubleshooting and safe release workflow

## Preview first

Run the production build locally:

```powershell
npm run demo:check
npm run start -- -p 3000
$env:DEMO_BASE_URL='http://127.0.0.1:3000'
npm run demo:smoke
npm run demo:mobile
```

Preview URLs:

- `http://localhost:3000/demo-preview/good-kech-immo`
- `http://localhost:3000/demo-preview/immo-built`

The same paths work on a Vercel Preview URL and preserve branding across catalogue and property-detail navigation. They include `noindex` metadata.

## Production promotion

1. Create or update a non-production Git branch.
2. Run `npm run demo:check`.
3. Start the production output and run `demo:smoke` plus `demo:mobile`.
4. Push the branch and inspect the Vercel Preview deployment on desktop and a real phone.
5. Confirm agency name, logo, every WhatsApp link, property routes and browser console.
6. Merge/promote only after those checks pass and production promotion is explicitly approved.

## Diagnose the failing layer

```powershell
nslookup good-kech-immo.leadflowimmo.com
curl.exe -I --connect-timeout 10 https://good-kech-immo.leadflowimmo.com
curl.exe -o NUL -s -w "DNS: %{time_namelookup}`nConnect: %{time_connect}`nTLS: %{time_appconnect}`nTTFB: %{time_starttransfer}`nTotal: %{time_total}`nHTTP: %{http_code}`n" https://good-kech-immo.leadflowimmo.com
```

- No DNS result: DNS record/delegation problem.
- DNS succeeds but connect time remains zero and the request times out: network/Vercel edge reachability problem before the application.
- TCP connects but TLS fails: certificate or domain-assignment problem.
- HTTP 404: wrong route or domain not attached to the expected Vercel project.
- HTTP 500: inspect Vercel function logs and failed `_next/image` requests.
- HTTP 200 with a blank/broken page: inspect browser Console and Network for hydration exceptions or failed critical resources.
- Correct HTML but wrong branding: verify the exact `Host` header and `app/demoBrands.ts` hostname.

## Add a new agency

1. Add one entry to `app/demoBrands.ts` with a unique slug and hostname.
2. Put its optimized assets under `public/demos/<slug>/`.
3. Keep property IDs unique and canonical WhatsApp digits only.
4. Reuse a current demo experience or add a small config-driven presentation variant.
5. Open `/demo-preview/<slug>`.
6. Run `npm run demo:validate`, `npm run demo:check`, then the smoke tests before requesting promotion.
