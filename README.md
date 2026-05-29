# THEOREMX 2026 — Static Site

Minimal files to deploy this static site to GitHub + Vercel.

Quick local preview

 - Open `index.html` in your browser (double-click) or use a static server.

Deploy to GitHub

1. Create a git repo and push to GitHub:

```bash
git init
git add .
git commit -m "Initial: deploy-ready static site"
git branch -M main
git remote add origin <your-git-remote-url>
git push -u origin main
```

Deploy to Vercel

Option A — Connect GitHub repository:

 - Sign in to Vercel and import the GitHub repo. Vercel will detect this as a static site.

Option B — Vercel CLI (optional):

```bash
npm i -g vercel
vercel login
vercel --prod
```

Notes

- No build step is required. Files are served as static assets.
- Keep editing the site files directly; commits will trigger deploys when connected to Vercel.
# theoromX
