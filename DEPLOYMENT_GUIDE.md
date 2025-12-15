# 🚀 Deployment Guide for HideStyle Store

This guide will help you deploy your Next.js e-commerce website to production.

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:

- ✅ All features tested locally
- ✅ Environment variables configured
- ✅ Database schema finalized
- ✅ Payment gateway (Stripe) configured
- ✅ Image hosting (Cloudinary) set up
- ✅ Authentication (NextAuth) working

---

## 🎯 Recommended Deployment Option: **Vercel** (Easiest & Best for Next.js)

Vercel is the company behind Next.js and provides the best deployment experience.

### Step 1: Prepare Your Database

**⚠️ IMPORTANT:** SQLite doesn't work on Vercel. You need to migrate to PostgreSQL.

#### Option A: Use Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database
3. Copy the connection string

#### Option B: Use Neon (Free PostgreSQL)
1. Go to [Neon.tech](https://neon.tech)
2. Create a free account
3. Create a new database
4. Copy the connection string

#### Option C: Use Supabase (Free PostgreSQL)
1. Go to [Supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

### Step 2: Update Your Database Configuration

1. **Update `prisma/schema.prisma`:**

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Update your `.env` file:**

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

3. **Run migrations:**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 3: Deploy to Vercel

#### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Select your account**
   - Link to existing project? **No**
   - What's your project's name? **hidestyle-store**
   - In which directory is your code located? **./**
   - Want to override the settings? **No**

5. **Deploy to production:**
```bash
vercel --prod
```

#### Method 2: Using GitHub (Easier)

1. **Push your code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hidestyle-store.git
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables:**
   Add all your environment variables from `.env`:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

### Step 4: Run Database Migrations on Production

After deployment, you need to set up your database:

```bash
# Using Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

Or use Vercel's dashboard to run commands.

---

## 🌐 Alternative Deployment Options

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login:**
```bash
netlify login
```

3. **Deploy:**
```bash
netlify deploy --prod
```

**Note:** Netlify requires additional configuration for Next.js. Vercel is recommended.

---

### Option 3: Railway

Railway is great for full-stack apps with databases.

1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository
5. Add environment variables
6. Railway will automatically detect Next.js and deploy

**Advantage:** Railway provides PostgreSQL database automatically!

---

### Option 4: DigitalOcean App Platform

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create an App
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy

---

### Option 5: Self-Hosted (VPS)

For advanced users who want full control.

#### Requirements:
- VPS (DigitalOcean, Linode, AWS EC2, etc.)
- Node.js installed
- PM2 for process management
- Nginx for reverse proxy

#### Steps:

1. **SSH into your server:**
```bash
ssh user@your-server-ip
```

2. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install PM2:**
```bash
sudo npm install -g pm2
```

4. **Clone your repository:**
```bash
git clone https://github.com/YOUR_USERNAME/hidestyle-store.git
cd hidestyle-store
```

5. **Install dependencies:**
```bash
npm install
```

6. **Set up environment variables:**
```bash
nano .env
# Add all your environment variables
```

7. **Build the application:**
```bash
npm run build
```

8. **Start with PM2:**
```bash
pm2 start npm --name "hidestyle-store" -- start
pm2 save
pm2 startup
```

9. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. **Enable SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🔐 Important Security Considerations

### 1. Environment Variables
Never commit `.env` to Git. Make sure `.env` is in `.gitignore`:

```
.env
.env.local
.env.production
```

### 2. Generate Secure NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### 3. Update NEXTAUTH_URL

Set it to your production domain:
```env
NEXTAUTH_URL=https://yourdomain.com
```

### 4. Configure Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen to
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 5. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Update authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`

---

## 📊 Post-Deployment Tasks

### 1. Test Your Deployment

- ✅ Homepage loads correctly
- ✅ Product pages work
- ✅ Cart functionality
- ✅ Checkout process
- ✅ Admin panel access
- ✅ Image uploads
- ✅ Payment processing

### 2. Set Up Monitoring

- Use Vercel Analytics (built-in)
- Set up error tracking (Sentry)
- Monitor database performance

### 3. Set Up Backups

- Enable automatic database backups
- Export important data regularly

### 4. Configure Custom Domain

On Vercel:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## 🐛 Common Deployment Issues

### Issue 1: Database Connection Fails
**Solution:** Make sure `DATABASE_URL` includes `?sslmode=require` for PostgreSQL

### Issue 2: Images Not Loading
**Solution:** Check Cloudinary environment variables are set correctly

### Issue 3: Build Fails
**Solution:** Run `npm run build` locally first to catch errors

### Issue 4: API Routes Return 404
**Solution:** Ensure `next.config.mjs` is properly configured

### Issue 5: Authentication Not Working
**Solution:** Update `NEXTAUTH_URL` to production URL and configure OAuth redirect URIs

---

## 📞 Need Help?

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma Deployment: https://www.prisma.io/docs/guides/deployment

---

## ✅ Quick Start Recommendation

**For beginners, I recommend:**

1. **Database:** Neon.tech (Free PostgreSQL)
2. **Hosting:** Vercel (Free tier available)
3. **Deployment Method:** GitHub + Vercel Dashboard

This combination is:
- ✅ Free to start
- ✅ Easy to set up
- ✅ Scales automatically
- ✅ Great performance
- ✅ Built-in SSL
- ✅ Automatic deployments on push

---

**Good luck with your deployment! 🚀**
