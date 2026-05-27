# Orbitt — Deploy to Vercel

## What's in this folder

```
orbitt-v1/
  index.html      ← the full app (all 9 templates, Unsplash, font library, image position)
  api/
    ask.js        ← serverless function that proxies to Anthropic API
  vercel.json     ← routing config
```

---

## Step 1 — Push to GitHub

1. Open Terminal (or Git Bash on Windows)
2. Create a new repo on github.com — call it `orbitt`
3. In this folder, run:

```bash
git init
git add .
git commit -m "Orbitt v1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/orbitt.git
git push -u origin main
```

---

## Step 2 — Deploy on Vercel

1. Go to **vercel.com** → Log in (or sign up free)
2. Click **Add New → Project**
3. Import your `orbitt` GitHub repo
4. Leave all build settings as-is (Vercel auto-detects)
5. Click **Deploy**

Your app will be live at `orbitt.vercel.app` within ~60 seconds.

---

## Step 3 — Add your Anthropic API key

1. In Vercel, go to your project → **Settings → Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from console.anthropic.com
3. Click **Save**
4. Go to **Deployments** → click the three dots on the latest deployment → **Redeploy**

---

## Step 4 — Connect yourorbitt.com

1. In Vercel → your project → **Settings → Domains**
2. Add `yourorbitt.com`
3. Vercel gives you DNS records — add them at your domain registrar
4. SSL is automatic

---

## Step 5 — Add Unsplash (optional but recommended)

1. Go to **unsplash.com/developers** → create a free account
2. Create a new app → copy the **Access Key**
3. In the Orbitt app, go to Library tab → paste your key in the Unsplash field
4. The key saves to your browser's localStorage automatically

---

## Local testing

If you have Node.js installed:

```bash
npm install -g vercel
vercel dev
```

Then open http://localhost:3000

Or without Node — just open `index.html` directly in a browser. The AI generate buttons won't work locally (they need the `/api/ask` server), but everything else (templates, images, fonts, brand) works fine.

---

## Re-deploying after changes

Every `git push` to `main` auto-deploys. No manual step needed once connected.
