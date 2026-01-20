# RecipeBook AI Coding Instructions

## 🏗️ Architecture Overview

**RecipeBook** is a full-stack recipe management web application with:
- **Backend**: Express.js REST API on Node.js (port 3000)
- **Database**: MongoDB (local or Atlas via `MONGODB_URI` env var)
- **Frontend**: Vanilla JavaScript with Tailwind CSS, served from Express static middleware
- **Deployment**: Docker-based for Render.com

### Key Data Flow
1. Frontend HTML pages (`public/*.html`) load vanilla JS modules
2. `RecipeAPI` class (`js/api.js`) abstracts all HTTP calls to `/api/recipes`
3. Express routes (`src/routes/recipes.js`) handle CRUD operations
4. Mongoose models (`src/models/Recipe.js`) enforce schema with enums: difficulty (`facile|moyen|difficile`), category (`entrée|plat|dessert|boisson|autre`)

## 🔧 Developer Workflows

### Local Development
```bash
npm run dev  # Uses nodemon for hot-reload, connects to localhost:27017/recipebook or MONGODB_URI
npm start    # Production mode
```

### Critical Environment Setup
- **dotenv**: Must call `require('dotenv').config()` in `server.js` BEFORE any code that needs env vars
- **Static Files**: Express serves `public/` at root AND `js/` at `/js` route (see `server.js` line 15)
- **Health Check**: `/api/health` endpoint required for Docker/Render deployment

### Port Configuration
- Must respect `process.env.PORT` (Render sets this dynamically)
- Fallback: 3000 for local dev

## 📋 Project Conventions

### Frontend Routing
- Single-page routing via window.location.href
- Pages: `/` (list), `/add.html` (create), `/recipe.html?id=...` (detail)
- All pages located in `public/` directory with hardcoded `<script>` imports
- URL parameter parsing: `new URLSearchParams(window.location.search).get('id')`

### API Patterns
- All requests go through `RecipeAPI` class static methods
- Base URL auto-detects: localhost → `http://localhost:3000/api`, production → `window.location.origin/api`
- Error handling: Parse response JSON and throw Error objects with descriptive messages

### MongoDB Field Names & Validation
```javascript
// Recipe schema (src/models/Recipe.js):
// - title (required, trimmed)
// - description (required)
// - ingredients (array of strings)
// - instructions (required, string)
// - prepTime (number in minutes, default 15)
// - difficulty (enum: facile/moyen/difficile, default facile)
// - category (enum: entrée/plat/dessert/boisson/autre, default plat)
// - image (URL string, optional)
// - createdAt/updatedAt (auto-managed by mongoose)
```

## 🔌 Integration Points

### Database Connection
- Entry: `src/config/db.js` (must be imported and called in server.js before routes)
- Uses `mongoose.connect()` with `useNewUrlParser` and `useUnifiedTopology` flags
- Gracefully falls back to local MongoDB if `MONGODB_URI` not set

### Docker Deployment
- Multi-stage build in `Dockerfile` for size optimization
- HEALTHCHECK pings `/api/health` endpoint
- Entrypoint: `npm start` (not dev mode)
- Base image: `node:18-alpine` (lightweight)

## ⚠️ Known Patterns & Pitfalls

1. **Static File Serving Order Matters**: `app.use('/js')` declared AFTER `app.use(express.static('public'))` to prevent conflicts
2. **Env Variables in Frontend**: Frontend cannot access `process.env` directly; use `MONGODB_URI` only server-side
3. **Mongoose Validation**: Set `runValidators: true` in `findByIdAndUpdate()` to enforce schema validation on updates
4. **CORS Enabled**: `cors()` middleware is active; frontend can make requests from any origin
5. **No Authentication**: Recipe API is public (no auth middleware); if adding auth later, protect all routes with middleware at `app.use('/api')` level

## 📁 File Reference Guide

- [server.js](server.js) - Express app, routes setup, PORT/MONGODB_URI config
- [src/routes/recipes.js](src/routes/recipes.js) - CRUD endpoints (GET /, GET /:id, POST, PUT, DELETE)
- [src/models/Recipe.js](src/models/Recipe.js) - Mongoose schema with validations
- [js/api.js](js/api.js) - Frontend API client class
- [package.json](package.json) - Dependencies: express, mongoose, cors, dotenv
- [Dockerfile](Dockerfile) - Multi-stage build for production deployment
