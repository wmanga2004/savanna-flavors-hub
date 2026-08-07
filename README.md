# Leavora African Market

Online storefront for **Leavora African Market** (Oklahoma City) — shop groceries on the site and manage products from `/admin`.

**Live sites**
- Custom domain: https://leavoramarket.com
- Lovable URL: https://savanna-flavors-hub.lovable.app
- Editor: https://lovable.dev/projects/a4bf1c02-9b11-467c-8339-2b6db3ac1233

## Features

- Product catalog in Supabase (no Square catalog required)
- On-site checkout with Square Web Payments
- Staff admin at `/admin` (password-protected) with product CRUD + image upload
- Connected to Lovable via GitHub sync on `main`

## Local development

```sh
npm i
npm run dev
```

Open http://localhost:5173 (use `localhost`, not `127.0.0.1`, for Square card fields).

## Environment

Public vars live in `.env` (committed for Lovable). Secrets go in `.env.local` and Supabase Edge Function secrets:

- `SITE_URL=https://leavoramarket.com`
- `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_ENVIRONMENT`
- `ADMIN_PASSWORD`
- `VITE_SQUARE_APPLICATION_ID`, `VITE_SQUARE_LOCATION_ID`, `VITE_SQUARE_ENVIRONMENT`

To take **real** payments, switch those Square values to **Production** credentials from [developer.squareup.com](https://developer.squareup.com/apps).
