# CLS Frontend

Frontend for the Champion League System, built with React, TypeScript, Vite, and Tailwind CSS.
The backend is maintained separately in [CLS-backend](https://github.com/ngxhieu712/CLS-backend).

## Local development

Requires Node.js 22 or newer.

```bash
npm ci
copy .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the backend API URL, ending in `/api`.
For local development, the default is `http://localhost:5003/api`.

## Deploy on Vercel

Import this repository and leave **Root Directory** set to `.`. Vercel uses the root
`vercel.json` to build the app and publish `dist`. Add `VITE_API_BASE_URL` to the Vercel
project's environment variables and set it to the deployed backend API URL, ending in `/api`.

## Checks

```bash
npm run lint
npm test
npm run build
```
