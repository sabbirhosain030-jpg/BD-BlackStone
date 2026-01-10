# Deployment Guide for BD BlackStone

Your application is built with Next.js, Prisma (MongoDB), and NextAuth. The recommended deployment platform is **Vercel**.

## 1. Prerequisites
- A GitHub repository with your latest code
- A Vercel account (free tier works)
- A MongoDB Atlas cluster (free tier available)
- Cloudinary account for image uploads

## 2. Environment Variables

You must set these in your Vercel Project Settings > Environment Variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` | ✅ Yes |
| `NEXTAUTH_URL` | The URL of your deployed site | `https://your-project.vercel.app` | ✅ Yes |
| `NEXTAUTH_SECRET` | Secret for encryption | Generate: `openssl rand -base64 32` | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `your-cloud-name` | ✅ Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` | ✅ Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` | ✅ Yes |

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster (if you haven't already)
3. Go to **Database Access** > Add a database user with read/write permissions
4. Go to **Network Access** > Add IP Address:
   - **Important:** Add `0.0.0.0/0` to allow Vercel's dynamic IPs
   - Or click "Allow Access from Anywhere"
5. Go to **Database** > **Connect** > **Connect your application**
6. Copy the connection string and replace `<password>` with your actual password
7. Add the connection string as `DATABASE_URL` in Vercel

## 3. Deploying to Vercel

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

## 4. Post-Deployment

After successful deployment:

1. **Check Deployment Logs:** 
   - Go to Vercel project > Deployments > Click on your deployment
   - Check the build logs for any errors
   
2. **Verify Environment Variables:**
   - Go to Settings > Environment Variables
   - Ensure all 6 required variables are set
   
3. **Test Your Site:**
   - Visit your deployed URL
   - The homepage should load (even without data)
   - Try accessing `/admin/login`

4. **Seed Database (Optional):**
   ```bash
   # Run locally pointing to production DB
   npm run seed
   ```

## 5. Troubleshooting

### Error: "We apologize for the inconvenience"

**Check Vercel Logs:**
1. Go to your Vercel project > Deployments
2. Click on the latest deployment > Runtime Logs
3. Look for error messages

**Common Causes:**
- ❌ Missing `DATABASE_URL` environment variable
- ❌ MongoDB Atlas not allowing Vercel IPs (`0.0.0.0/0`)
- ❌ Incorrect MongoDB connection string format
- ❌ Missing `NEXTAUTH_SECRET` or `NEXTAUTH_URL`

**Solutions:**
1. **Verify all environment variables are set** in Vercel Settings
2. **Check MongoDB Atlas Network Access** allows `0.0.0.0/0`
3. **Redeploy** after adding/fixing environment variables:
   - Vercel > Deployments > Three dots menu > Redeploy

### Database Connection Issues

If you see database errors in logs:
1. Test connection string locally in `.env`
2. Ensure password doesn't have special characters (or URL encode them)
3. Verify database name is included in connection string
4. Check MongoDB Atlas cluster is running (not paused)

### Images Not Loading

- Verify all Cloudinary environment variables are correct
- Check `next.config.js` has Cloudinary domain in `images.remotePatterns`

### 504 Gateway Timeout

- MongoDB Atlas might be in a different region (causing slow connections)
- Consider upgrading MongoDB Atlas to a paid tier for better performance
- Check if database queries are optimized

## 6. Continuous Deployment

Once set up, Vercel will automatically:
- Deploy every push to `main` branch
- Create preview deployments for pull requests
- Use the same environment variables for all deployments

---

**Need Help?** Check Vercel logs first, then verify all environment variables are correctly set.
