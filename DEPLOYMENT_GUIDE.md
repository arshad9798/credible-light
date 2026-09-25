# 🚀 Credible Light – Free Hosting & Deployment Guide

This full-stack application (React Frontend + Node.js Express Backend + SQLite Database) can be hosted **100% Free** on cloud platforms.

The best and easiest free platform for this app is **Render.com**.

---

## 🌟 Method 1: Host on Render.com (Recommended – 100% Free)

### Step 1: Push Code to GitHub

Open PowerShell or Terminal in your project folder (`g:\New folder (3)\Credible-light`) and run:

```bash
git init
git add .
git commit -m "Initial commit of Credible Light website"
```

1. Go to [github.com](https://github.com) and click **"New repository"**.
2. Name it `credible-light` and click **Create repository**.
3. Copy the push commands from GitHub and run them:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/credible-light.git
git push -u origin main
```

---

### Step 2: Deploy on Render.com

1. Go to [render.com](https://render.com) and sign up / log in with your **GitHub account**.
2. On your Render Dashboard, click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository**, click **Next**, and connect your `credible-light` repository.
4. Fill in these deployment settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `credible-light` (or any name you like) |
| **Region** | Singapore / Frankfurt (choose closest to India) |
| **Branch** | `main` |
| **Root Directory** | *(leave blank)* |
| **Runtime** | `Node` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** ($0 / month) |

5. Under **Environment Variables**, add:
   * `JWT_SECRET` = `credible-light-super-secret-key-2026`
   * `NODE_ENV` = `production`
6. Click **Deploy Web Service**!

Render will automatically install all dependencies, build the React app, start the Express backend, and provide you with a live URL like:
👉 **`https://credible-light.onrender.com`**

---

### Step 3: Accessing Admin on Your Live Website

* **Public Website**: `https://credible-light.onrender.com/`
* **Admin Management Portal**: `https://credible-light.onrender.com/admin`
  * **Default Username**: `admin`
  * **Default Password**: `admin123`

---

### Step 4: Connecting Your Custom Domain (e.g. `crediblelight.in`)

Render provides **Free SSL / HTTPS certificates** for custom domains:
1. In Render dashboard, go to your Web Service → **Settings** → **Custom Domains**.
2. Click **Add Custom Domain** and enter `crediblelight.in` (or `www.crediblelight.in`).
3. Add the CNAME / A DNS records provided by Render in your domain registrar (GoDaddy, Namecheap, Hostinger, etc.).
4. Your website will be live at `https://crediblelight.in`!

---

## ⚡ Method 2: Alternative Free Platforms

* **Railway.app**: Connect GitHub → Railway automatically detects Node.js and starts it with $5 free monthly credits.
* **Koyeb.com**: Free tier with global edge, Git-driven deployment.
* **Fly.io**: Free tier with persistent volume support.
