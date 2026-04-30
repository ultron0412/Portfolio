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

## Setup

1. Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

2. Create env files:

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
