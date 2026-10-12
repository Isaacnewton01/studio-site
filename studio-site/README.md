# Studio site (Next.js + Upstash Redis + Resend)

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill it in
3. `npm run dev` then open http://localhost:3000 and http://localhost:3000/admin
   (Without Redis keys the site shows defaults and /admin cannot save.)

## Deploy on Vercel
1. Push this folder to a GitHub repo
2. Vercel > Add New > Project > import the repo
3. Project > Storage > add Upstash Redis (Marketplace). It adds KV_REST_API_URL and KV_REST_API_TOKEN
4. Settings > Environment Variables: ADMIN_PASSWORD, SESSION_SECRET, RESEND_API_KEY, CONTACT_TO, CONTACT_FROM
5. Redeploy, then visit /admin
