# Rachel's Play Cafe — Website

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# Create a new repo on github.com called rachels-website, then:
git remote add origin https://github.com/YOUR_USERNAME/rachels-website.git
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import the `rachels-website` repo
4. Framework preset: **Other**
5. Root directory: leave as `/`
6. Click **Deploy** — it will fail the first time (missing env var), that's fine

### 3. Add the API key environment variable
1. In Vercel dashboard → your project → **Settings → Environment Variables**
2. Add:
   - **Name:** `BOOKWHEN_API_KEY`
   - **Value:** `kcjp87k01f45lq3qd6j9d0kdi1d9`
   - **Environments:** Production, Preview, Development
3. Click Save

### 4. Redeploy
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment → **Redeploy**

### 5. Add custom domain
1. Go to **Settings → Domains**
2. Add `rachelsplay.cafe`
3. Vercel will show you DNS records to add — go to your domain registrar and add them

---

## Project structure
```
rachels-website/
├── api/
│   └── sessions.js     ← Serverless function (Bookwhen proxy)
├── public/
│   └── index.html      ← The website
└── vercel.json         ← Routing config
```

## Making changes
Edit `public/index.html` locally, commit and push — Vercel auto-deploys.
