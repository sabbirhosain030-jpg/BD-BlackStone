# Deployment Guide for BD BlackStone

Your application is built with Next.js, Prisma, and NextAuth. The best place to deploy it is **Vercel**.

## 1. Prerequisites
- A GitHub repository with your latest code.
- A Vercel account.
- A Database (Postgres recommended for production, but SQLite works for testing/demo). 
  > **Note:** SQLite files are *not* persistent on Vercel unless using specific storage solutions. For a real production store, you should switch `datasource db` in `schema.prisma` to PostgreSQL (e.g. Vercel Postgres, Supabase, Neon).

## 2. Environment Variables
You must set these in your Vercel Project Settings > Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | The URL of your deployed site | `https://your-project.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for encryption | Generate one: `openssl rand -base64 32` |
| `DATABASE_URL` | Connection string | `postgres://user:pass@host:5432/db` |

## 3. Deploying to Vercel
1.  **Push** your code to GitHub.
2.  Go to **Vercel Dashboard** > **Add New...** > **Project**.
3.  Import your GitHub repository.
4.  In **Configure Project**:
    - **Build Command:** `npm run build` (default)
    - **Output Directory:** `.next` (default)
    - **Install Command:** `npm install` (default)
5.  **Environment Variables:** Add the ones listed above.
6.  Click **Deploy**.

## 4. Post-Deployment
After deployment:
1.  Go to the Vercel project dashboard.
2.  If using Postgres, run migrations via the "Storage" tab or locally pointing to the remote DB.
    - `npx prisma migrate deploy`
3.  Create your Admin account via the /signup page (you might need to manually set role to ADMIN in DB if you removed the auto-admin logic, or use the first account).

## 5. Troubleshooting
- **504 Gateway Timeout:** Database might be slow.
- **Images not loading:** Check `next.config.js` domain permissions if using external images.
