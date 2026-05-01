# Ayush Portfolio Showcase

Production-ready MERN portfolio for **Ayush Jung Kunwar** with:

- Public single-page portfolio (about, experience, projects, skills, education, certifications, contact)
- Dark/light theme toggle with `localStorage`
- Contact API with validation and rate limiting
- Admin authentication (JWT)
- Portfolio create/update/delete APIs
- Resume/project asset uploads

## Project Structure

```text
.
|- client
|- server
|- .gitignore
`- readme.md
```

## Stack

- Frontend (`client`): React + TypeScript + TanStack Router + Vite
- Backend (`server`): Node.js + Express + MongoDB + Mongoose
- Security: `helmet`, `cors`, `express-rate-limit`, JWT auth middleware

## Local Setup

1. Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

2. Create local env files:

```bash
copy client\.env.example client\.env
copy server\.env.example server\.env
```

3. Start MongoDB locally and seed default data:

```bash
cd server
npm run seed
```

4. Run backend and frontend in separate terminals:

```bash
# Terminal 1
cd server
npm run dev
```

```bash
# Terminal 2
cd client
npm run dev
```

## Deployment (Vercel + Render)

Target production domains:
- Frontend: `https://ayushjungkunwar.com.np`
- Frontend alias: `https://www.ayushjungkunwar.com.np`
- Backend API: `https://api.ayushjungkunwar.com.np`

### 1. Deploy API to Render

This repo includes [render.yaml](./render.yaml) and is already configured for:
- Root directory: `server`
- Build command: `npm ci`
- Start command: `npm run start`
- Health check path: `/api/health`
- CORS allowlist: `https://ayushjungkunwar.com.np,https://www.ayushjungkunwar.com.np`

Steps:
1. In Render, create a new **Blueprint** service from this repo.
2. Set required secret env vars:
- `MONGODB_URI=<your production mongo uri>`
- `JWT_SECRET=<strong random secret>`
- `ADMIN_PASSWORD=<secure admin password>`
3. Deploy the service.
4. In Render service settings, add custom domain `api.ayushjungkunwar.com.np`.
5. In your DNS provider, create the `api` record exactly as Render shows in the custom domain screen.
6. Seed production data once using Render Shell:

```bash
npm run seed
```

### 2. Deploy Frontend to Vercel

1. Import this repo to Vercel with **Root Directory** set to `client`.
2. Add production env var:
- `VITE_API_URL=https://api.ayushjungkunwar.com.np/api`
3. Deploy.
4. In Vercel domains, add:
- `ayushjungkunwar.com.np`
- `www.ayushjungkunwar.com.np`
5. In your DNS provider, add the root (`@`) and `www` records exactly as Vercel provides for this project.

`client/vercel.json` already handles SPA rewrites, so direct refresh on routes like `/admin` works in production.

### 3. Final Checks

Verify these live URLs after DNS propagation:
- `GET https://api.ayushjungkunwar.com.np/api/health`
- `GET https://api.ayushjungkunwar.com.np/api/portfolio`
- `https://ayushjungkunwar.com.np`
- `https://ayushjungkunwar.com.np/admin`

## Production Env Templates

- Frontend: [`client/.env.production.example`](./client/.env.production.example)
- Backend: [`server/.env.production.example`](./server/.env.production.example)

## Upload Storage Note

Uploads are returned as full backend URLs and work with split domains (Vercel + Render).  
Render local disk is ephemeral by default, so uploaded files can be lost on restart/redeploy. For durable storage, move uploads to object storage (S3/Cloudinary/etc.).

## Runtime Troubleshooting (Render)

If logs show `node src/server.js` then exit with status `1` after ~15-30s, the most common root causes are:
- Missing or invalid `MONGODB_URI` in Render environment variables
- MongoDB Atlas network access not allowing Render traffic

Fix checklist:
1. Set `MONGODB_URI` in Render with the real password (no `<db_password>` placeholder).
2. In Atlas, add Network Access entry `0.0.0.0/0` (or a strict allowlist that includes Render egress).
3. Confirm Atlas DB user credentials are correct for that cluster/database.
4. Redeploy and verify `GET /api/health`.

## Default Admin Login

- Email: `admin@ayush.dev`
- Password: `Admin123!` (change via `ADMIN_PASSWORD` before seeding in production)

## API Routes

### Public

- `GET /api/health`
- `GET /api/portfolio`
- `POST /api/contact`

### Admin (JWT required)

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/portfolio`
- `PUT /api/portfolio/:id`
- `DELETE /api/portfolio/:id/:section/:itemId`
- `POST /api/upload` (field name: `file`)

## Environment Variables

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### `server/.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ayush_portfolio
JWT_SECRET=change-this-secret-in-production
JWT_EXPIRE=7d
ADMIN_PASSWORD=Admin123!
FRONTEND_URL=http://localhost:8080,http://localhost:5173
```
