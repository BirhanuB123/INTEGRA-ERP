# Deploy INTEGRA-ERP to Vercel (Free Hosting)

Your app has two parts: **frontend** (React/Vite) and **backend** (Node/Express + MongoDB). Vercel is ideal for the frontend. The backend needs a separate free host (e.g. Render or Railway).

---

## Part 1: Deploy frontend to Vercel

### 1. Push your code to GitHub

If you haven’t already:

```bash
git add .
git commit -m "Prepare for Vercel deploy"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New…** → **Project**.
3. Import your GitHub repository (INTEGRA-ERP).
4. **Important:** set **Root Directory** to `frontend`:
   - Click **Edit** next to “Root Directory”, choose `frontend`, then **Continue**.
5. **Environment variables** (required — without this, login will not work):
   - Add:
     - **Name:** `VITE_BACKEND_SERVER`  
     - **Value:** your backend URL **with trailing slash**, e.g. `https://integra-erp.onrender.com/`
   - If you use a separate file URL base:
     - **Name:** `VITE_FILE_BASE_URL`  
     - **Value:** (optional) e.g. `https://your-backend.onrender.com/`
   - After adding or changing env vars, **redeploy** (Deployments → ⋯ → Redeploy).
6. Click **Deploy**.

Vercel will run `npm run build` in the `frontend` folder and serve the `dist` output. The `vercel.json` in `frontend` handles SPA routing (all routes → `index.html`).

### 3. After deploy

- Your app will be at `https://your-project.vercel.app`.
- To use your own domain: Project → **Settings** → **Domains** and add it.

---

## Part 2: Backend (free hosting options)

The backend is an Express server and needs a Node host and a MongoDB database. Vercel’s serverless model is not a good fit for this without rewriting the API.

### Option A: Render (recommended, free tier)

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. **New** → **Web Service**.
3. Connect the same repo; set **Root Directory** to `backend`.
4. Settings:
   - **Build:** `npm install`
   - **Start:** `npm start`
   - **Plan:** Free (optional: add env vars for port, e.g. `PORT=8888` if your server uses it).
5. Add **Environment Variables** in the dashboard, e.g.:
   - `NODE_ENV=production`
   - `MONGODB_URI=mongodb+srv://...` (from MongoDB Atlas)
   - Any other vars your `backend` expects (see `.env.example` or `backend/` docs).
6. Deploy. Note the URL (e.g. `https://integra-erp-api.onrender.com`).

Use this URL (with trailing slash) as `VITE_BACKEND_SERVER` in Vercel.

### Option B: Railway

1. Go to [railway.app](https://railway.app), sign in with GitHub.
2. **New Project** → **Deploy from GitHub** → select repo.
3. Set **Root Directory** to `backend`, add `MONGODB_URI` and other env vars.
4. Railway will build and run `npm start` and give you a public URL. Use that as `VITE_BACKEND_SERVER` in Vercel.

### MongoDB (free)

Use [MongoDB Atlas](https://www.mongodb.com/atlas):

1. Create a free cluster.
2. Get the connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname`).
3. Set it as `MONGODB_URI` in your backend host (Render/Railway).

---

## Checklist

| Step | Where | What |
|------|--------|------|
| 1 | GitHub | Code pushed, repo connected to Vercel |
| 2 | Vercel | Root Directory = `frontend`, env `VITE_BACKEND_SERVER` = backend URL (with `/`) |
| 3 | Render/Railway | Backend deployed, env `MONGODB_URI` and others set |
| 4 | Vercel | Redeploy after backend URL is known so frontend uses correct API |

---

## Troubleshooting

- **Login button does nothing or "Cannot connect to the server":** You must set `VITE_BACKEND_SERVER` in Vercel. In the Vercel dashboard: your project → **Settings** → **Environment Variables** → add `VITE_BACKEND_SERVER` = `https://integra-erp.onrender.com/` (your Render URL with trailing slash). Then **redeploy** (Deployments → ⋯ → Redeploy). Without this, the app calls the wrong URL and login fails.
- **Blank page or 404 on refresh:** `frontend/vercel.json` rewrites should send all routes to `index.html`. Ensure Root Directory is `frontend` so Vercel uses that file.
- **API calls fail / CORS:** In the backend, allow your Vercel origin (e.g. `https://your-app.vercel.app`) in CORS config.
- **Wrong API URL:** In Vercel, `VITE_BACKEND_SERVER` must be the full backend base URL with trailing slash (e.g. `https://integra-erp.onrender.com/`). Redeploy after changing env vars.
