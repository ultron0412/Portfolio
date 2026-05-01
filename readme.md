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

### 1. Deploy API to Render

This repo includes [render.yaml](./render.yaml) for backend deployment.

1. In Render, create a new **Blueprint** service from this repo.
2. Confirm service settings:
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm run start`
- Health check path: `/api/health`
3. Set required environment variables on Render:
- `NODE_ENV=production`
- `MONGODB_URI=<your production mongo uri>`
- `JWT_SECRET=<strong random secret>`
- `JWT_EXPIRE=7d`
- `ADMIN_PASSWORD=<secure admin password>`
- `FRONTEND_URL=https://your-vercel-project.vercel.app`
4. Deploy the service and copy the Render API URL (for example `https://your-api.onrender.com`).
5. Seed portfolio data once in the deployed database (`npm run seed` with production env values).

### 2. Deploy Frontend to Vercel

1. Import this repo in Vercel.
2. Set **Root Directory** to `client`.
3. Add frontend env variable:
- `VITE_API_URL=https://your-api.onrender.com/api`
4. Deploy.

`client/vercel.json` is already added for SPA rewrites, so direct route refreshes (for example `/admin`) work in production.

### 3. Finalize CORS

After Vercel gives the final URL/custom domain, update Render:
- `FRONTEND_URL=https://your-final-domain.com,https://your-vercel-project.vercel.app`

Use comma-separated values if you want multiple allowed origins.

### 4. Post-Deploy Checks

Verify these URLs:
- `GET https://your-api.onrender.com/api/health`
- `GET https://your-api.onrender.com/api/portfolio`
- Frontend load and contact form submission on Vercel
- Admin login at `https://your-vercel-domain/admin`

## Production Env Templates

- Frontend: [`client/.env.production.example`](./client/.env.production.example)
- Backend: [`server/.env.production.example`](./server/.env.production.example)

## Upload Storage Note

Uploads are returned as full backend URLs and work with split domains (Vercel + Render).  
Render local disk is ephemeral by default, so uploaded files can be lost on restart/redeploy. For durable storage, move uploads to object storage (S3/Cloudinary/etc.).

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
