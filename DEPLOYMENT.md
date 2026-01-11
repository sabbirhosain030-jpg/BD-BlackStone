# Deployment Guide for BD BlackStone

Your application is built with Next.js, Prisma (PostgreSQL), and NextAuth. The recommended deployment platform is **Vercel**.

## 1. Prerequisites
- A GitHub repository with your latest code
- A Vercel account (free tier works)
- A Supabase project (for PostgreSQL database)
- Cloudinary account for image uploads

## 2. Environment Variables

You must set these in your Vercel Project Settings > Environment Variables:

| Variable | Description | Example | Required |
|----------|----------------------|----------|
| `DATABASE_URL` | Supabase Connection String (Transaction Pooler) | `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` | ✅ Yes |
| `NEXTAUTH_URL` | The URL of your deployed site | `https://your-project.vercel.app` | ✅ Yes |
| `NEXTAUTH_SECRET` | Secret for encryption | Generate: `openssl rand -base64 32` | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `your-cloud-name` | ✅ Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` | ✅ Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` | ✅ Yes |

## 3. Database Setup (Supabase PostgreSQL)

1.  **Create a Supabase Project**:
    *   Go to [Supabase](https://supabase.com/) and create a new project.
    *   Save your **Database Password**.

2.  **Get Connection Strings**:
    *   Go to **Project Settings** -> **Database**.
    *   Find **Connection String** -> **URI**.
    *   **For Migrations (Local/CI)**: Use the Session Pooler or Direct connection (Port 5432).
        *   Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?pgbouncer=true`
    *   **For Application (Production)**: Use the Transaction Pooler (Port 6543).
        *   Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`

3.  **Configure Environment Variables**:
    *   Update `DATABASE_URL` in your `.env` file and Vercel Project Settings.

4.  **Database Migration & Seeding**:
    *   Run `npx prisma db push` to create the schema.
    *   Run `npx tsx scripts/seed.ts` to populate initial data.

## 4. Deploying to Vercel

1. **Push** your code to GitHub
2. Go to **Vercel Dashboard** > **Add New...** > **Project**
3. Import your GitHub repository
4. In **Configure Project**:
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)
5. **Environment Variables:** Add ALL the variables listed above
6. Click **Deploy**

## 5. Post-Deployment

After successful deployment:

1. **Check Deployment Logs:** 
   - Go to Vercel project > Deployments > Click on your deployment
   - Check the build logs for any errors
   
2. **Verify Environment Variables:**
   - Go to Settings > Environment Variables
   - Ensure all required variables are set
   
3. **Test Your Site:**
   - Visit your deployed URL
   - The homepage should load
   - Try accessing `/admin/login`

## 6. Troubleshooting

### Error: "We apologize for the inconvenience"

**Check Vercel Logs:**
1. Go to your Vercel project > Deployments
2. Click on the latest deployment > Runtime Logs
3. Look for error messages

**Common Causes:**
- ❌ Missing `DATABASE_URL` environment variable
- ❌ Using Direct connection (port 5432) in serverless environment instead of Pooler (port 6543)
- ❌ Missing `NEXTAUTH_SECRET` or `NEXTAUTH_URL`

**Solutions:**
1. **Verify all environment variables are set** in Vercel Settings
2. **Use Transaction Pooler** port 6543 for `DATABASE_URL`
3. **Redeploy** after adding/fixing environment variables

### Database Connection Issues

If you see database errors in logs:
1. Test connection string locally in `.env`
2. Ensure `pgbouncer=true` is appended to the connection string
3. Ensure password doesn't have special characters unescaped (or URL encode them)
4. Verify database name is included in connection string
5. Check Supabase project is running (not paused)

### Images Not Loading

- Verify all Cloudinary environment variables are correct
- Check `next.config.js` has Cloudinary domain in `images.remotePatterns`

### 504 Gateway Timeout

- Supabase project might be in a different region (causing slow connections)
- Consider upgrading Supabase plan for better performance
- Check if database queries are optimized

## 7. Continuous Deployment

Once set up, Vercel will automatically:
- Deploy every push to `main` branch
- Create preview deployments for pull requests
- Use the same environment variables for all deployments

---

**Need Help?** Check Vercel logs first, then verify all environment variables are correctly set.
