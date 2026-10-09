# Deployment Guide — Shrabani Neogi Portfolio

Your portfolio consists of pure HTML, CSS, JavaScript, and optimized media assets. It requires **no build step** and can be deployed in less than 2 minutes using any of the free options below.

---

## Option 1: GitHub Pages (Recommended)

Since your GitHub username is `shrabani-stack`:

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Set the repository name to `portfolio` (or `shrabani-stack.github.io` if you want it as your primary user site).
3. Leave it Public and do **not** initialize with a README (the local project already has all files and git initialized).
4. Click **Create repository**.

### Step 2: Push your local code
Open terminal / PowerShell in this directory:
```bash
cd "C:\Users\Shrabani Neogi\.gemini\antigravity-ide\scratch\shrabani-portfolio"

git remote add origin https://github.com/shrabani-stack/portfolio.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repo on GitHub: `https://github.com/shrabani-stack/portfolio`.
2. Navigate to **Settings** > **Pages** (in the left sidebar).
3. Under **Branch**, select `main` and `/ (root)`.
4. Click **Save**.
5. Within 1 minute, your portfolio will be live at:
   👉 **`https://shrabani-stack.github.io/portfolio/`**

---

## Option 2: Netlify Drop (Instant 30-Second Drag & Drop)

1. Open [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
2. Drag and drop the folder:
   `C:\Users\Shrabani Neogi\.gemini\antigravity-ide\scratch\shrabani-portfolio`
3. Netlify will instantly provide a live HTTPS link (e.g., `https://shrabani-neogi.netlify.app`).
4. You can customize the subdomain name under Site Settings > Domain Management.

---

## Option 3: Vercel (CLI or Dashboard)

Run directly from this folder:
```bash
npx vercel
```
Follow the interactive prompts (defaults for everything) to get an instant live production link on `vercel.app`.
