# Orbit — AI-powered job board

Orbit is a full-stack hiring platform designed around a higher-signal candidate and recruiter experience. It pairs a premium responsive React interface with a secure Express/MongoDB API, role-aware authentication, job management, and deterministic AI-assisted job writing.

## Highlights

- Candidate job discovery, search, job detail, saved-job feedback, and application flow
- Recruiter dashboard with pipeline visualisation and responsive analytics
- AI job-description drafting, skills extraction, summarisation, and candidate-match endpoints
- JWT authentication, bcrypt password hashing, Zod validation, Helmet, sanitised requests, and role guards
- Motion-led responsive design with dark/light mode, accessible labels, keyboard-native controls, loading-ready card layout, and toast feedback

## Architecture

`client/` is a Vite + React SPA. `server/` is an MVC-style Express REST API backed by Mongoose. The browser proxies `/api` calls to the local API during development. The AI service is intentionally deterministic, so assessment reviewers can exercise the feature without provisioning third-party credentials; replace `aiController.js` with an OpenAI integration when deploying.

## Run locally

```bash
npm install
copy server\\.env.example server\\.env
# Add your MongoDB Atlas URI and a strong JWT_SECRET to server/.env
npm run dev
```

The web app starts at `http://localhost:5173`; the API runs at `http://localhost:5000`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (defaults to 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Signing secret for seven-day tokens |
| `CLIENT_URL` | Allowed browser origin, e.g. `http://localhost:5173` |

## API

| Method | Endpoint | Access | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Public | Create candidate or recruiter account |
| POST | `/api/auth/login` | Public | Receive JWT and profile |
| GET | `/api/jobs?q=` | Public | Paginated job search |
| GET | `/api/jobs/:id` | Public | Job detail |
| POST/PATCH/DELETE | `/api/jobs` | Recruiter/Admin | Manage own jobs |
| POST | `/api/ai/generate` | Recruiter/Admin | Generate description and skills |
| POST | `/api/ai/summarize` | Recruiter/Admin | Summarise description |
| POST | `/api/ai/match` | Recruiter/Admin | Calculate skills match |

Use `Authorization: Bearer <token>` for protected calls.

## Deployment

Deploy `client` to Vercel with the build command `npm run build -w client` and output directory `client/dist`. Deploy `server` to Render with `npm install` / `npm start -w server`, then set the environment variables above and update `CLIENT_URL` to the Vercel URL. The included GitHub Actions workflow installs, lints, and builds on every push and pull request. Add Vercel/Render deploy actions after configuring their repository secrets.

## Folder map

```text
client/src/     React routes and premium UI
server/src/controllers  Request handlers
server/src/models       Mongoose data models
server/src/routes       REST route composition
server/src/middleware   Authentication and authorisation
.github/workflows       CI verification
```

## Next improvements

Connect a hosted LLM provider, add application and notification routes, introduce file uploads for résumés, use refresh tokens, and add integration tests with a disposable MongoDB instance.
"# AI-job-board" 
