# Bundle Builder

A data-driven, multi-step security-system **bundle builder** with a live review panel.  
The project is split into two services that run side-by-side:

| Service      | Tech                                         | Default port |
| ------------ | -------------------------------------------- | ------------ |
| **Backend**  | Node.js · Express 5 · TypeScript (`ts-node`) | `3000`       |
| **Frontend** | React 19 · Vite 8 · TailwindCSS v4 · Zustand | `5173`       |

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- _(optional)_ **Docker** + **Docker Compose** for the containerised path

---

## Run Instructions

### Option A — Local development (recommended)

**1. Clone & enter the repo**

```bash
git clone <repo-url>
cd "bundle-builder"
```

**2. Install & start the backend**

```bash
cd backend
npm install
npm start          # ts-node app.ts — listens on http://localhost:3000
```

**3. Install & start the frontend** _(new terminal tab)_

```bash
cd frontend
npm install
npm run dev        # Vite dev server — opens http://localhost:5173
```

The frontend reads the backend URL from `bundle-builder/.env`:

```
VITE_API_URL="http://localhost:3000"
```

### Option B — Docker Compose

Both services are containerised. A single command builds and starts everything:

```bash
cd "bundle-builder"
docker compose up --build
```

| URL                     | Service                    |
| ----------------------- | -------------------------- |
| `http://localhost:3000` | Backend API                |
| `http://localhost:5173` | Frontend (served by Nginx) |

> The frontend container is pre-built with `VITE_API_URL=http://localhost:3000`.  
> To point at a different host, edit the `args.VITE_API_URL` value in `docker-compose.yml` before building.

---

### backend had two apis one for getting the products data and one for checkout

after calling checkout it should rest the cart in the frontend state to initial state
and remove the items from the local storage for next use in building a new bundle
