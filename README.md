# Screenshot of work (Node & Express Validation: Week 9 Exercise)

## Sign up (successful)

![Screenshot of work](./screenshots/registration-success.png)

## Sign up (failed)

![Screenshot of work](./screenshots/registration-failed.png)

## Sign in (successful)

![Screenshot of work](./screenshots/login-successful.png)

## Sign in (unsuccessful)

![Screenshot of work](./screenshots/login-unsuccessful.png)

## Deployment

The project is split into two deployment roots:

- `frontend/` is the Vercel project root.
- `backend/` is the Render project root.

For the frontend, set `VITE_API_URL` to the deployed Render API URL. For the
backend, set `MONGO_URI`, `PORT`, and `FRONTEND_URL` in Render's environment
settings. `FRONTEND_URL` may contain multiple comma-separated frontend origins.
