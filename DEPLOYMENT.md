# Wetoro Deployment Guide

This guide will walk you through deploying the complete Wetoro application with the Collective Release Feature, which allows all users to see each other's stones in the clearing.

## Overview

The deployment involves:
1. Setting up a database (Supabase)
2. Deploying the API server (backend)
3. Deploying the frontend website
4. Connecting everything together

**Total time**: About 30-45 minutes  
**Cost**: $0 (using free tiers)  
**Technical level**: Beginner-friendly with step-by-step instructions

---

## Part 1: Database Setup (Supabase)

### Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up using GitHub, Google, or email
4. Verify your email if prompted

### Step 2: Create New Project

1. After logging in, click "New Project"
2. Choose or create an organization
3. Fill in project details:
   - **Name**: `wetoro` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

### Step 3: Create the Database Table

1. In your project dashboard, find "SQL Editor" in the left sidebar
2. Click "New Query"
3. Open the file `api/schema.sql` from this repository
4. Copy all the SQL code from that file
5. Paste it into the SQL editor in Supabase
6. Click "Run" (or press Ctrl+Enter / Cmd+Enter)
7. You should see "Success. No rows returned"

### Step 4: Get Your API Credentials

1. Click on the "Settings" icon (⚙️) in the left sidebar
2. Click "API" in the settings menu
3. You'll see two important values - copy both:
   - **Project URL**: Looks like `https://abcdefgh.supabase.co`
   - **anon public** key: A long string starting with `eyJ...`
4. Save these somewhere safe - you'll need them in the next steps

---

## Part 2: Deploy the API Server

The API server stores and retrieves stones. You can deploy it to Vercel (easiest) or Railway.

### Option A: Vercel (Recommended)

#### Step 1: Prepare Your Code

1. Make sure all the code in the `api` folder is committed to your GitHub repository
2. Create a `vercel.json` file in the `api` folder with this content:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New..." → "Project"
3. Import your Wetoro repository from GitHub
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: Click "Edit" and select `api`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. Click "Deploy"
6. Wait for deployment to complete

#### Step 3: Add Environment Variables

1. In your Vercel project dashboard, go to "Settings"
2. Click "Environment Variables"
3. Add these three variables:
   - **Name**: `SUPABASE_URL`, **Value**: Your Supabase Project URL (from Part 1, Step 4)
   - **Name**: `SUPABASE_ANON_KEY`, **Value**: Your Supabase anon key (from Part 1, Step 4)
   - **Name**: `PORT`, **Value**: `3000`
4. Click "Save" for each one
5. Go back to "Deployments" tab
6. Click the ⋮ menu on the latest deployment and select "Redeploy"
7. Once redeployed, copy your API URL (looks like `https://wetoro-api.vercel.app`)

### Option B: Railway

1. Go to https://railway.app and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your Wetoro repository
4. Railway will detect the Node.js app in the `api` folder
5. Click on the deployment to configure
6. Go to "Variables" tab and add:
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
7. Go to "Settings" tab and note your deployment URL
8. Copy the URL (looks like `https://wetoro-api.up.railway.app`)

#### Step 4: Test Your API

1. Open a browser and go to: `https://your-api-url/api/health`
2. You should see: `{"status":"ok","timestamp":"..."}`
3. If you see this, your API is working! ✅

---

## Part 3: Deploy the Frontend

Now we'll deploy the actual Wetoro website.

### Option A: Netlify (Easiest for Static Sites)

#### Step 1: Connect API

1. Open the file `js/app.js` in your repository
2. Find this line near the top (around line 15):
   ```javascript
   const API_URL = '';
   ```
3. Change it to your API URL from Part 2:
   ```javascript
   const API_URL = 'https://your-api-url.vercel.app';
   ```
4. Save the file and commit it to GitHub

#### Step 2: Deploy to Netlify

1. Go to https://netlify.com and sign up (use GitHub)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize Netlify
4. Select your Wetoro repository
5. Configure the deployment:
   - **Branch**: main (or your default branch)
   - **Base directory**: Leave empty
   - **Build command**: Leave empty
   - **Publish directory**: `/` (root)
6. Click "Deploy site"
7. Wait 1-2 minutes for deployment
8. Your site is now live! Copy the URL (looks like `https://random-name-123.netlify.app`)

#### Step 3: Optional - Custom Domain

1. In Netlify, go to "Domain settings"
2. Click "Add custom domain"
3. Follow the instructions to connect your domain (if you have one)

### Option B: GitHub Pages

#### Step 1: Connect API

Same as Option A, Step 1 - update the API_URL in `js/app.js`

#### Step 2: Enable GitHub Pages

1. Go to your GitHub repository
2. Click "Settings" → "Pages"
3. Under "Source", select your branch (usually `main`)
4. Select folder: `/ (root)`
5. Click "Save"
6. Wait a few minutes
7. Your site will be at: `https://yourusername.github.io/Wetoro`

### Option C: Vercel (For Frontend)

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your Wetoro repository
4. Configure:
   - **Root Directory**: `/` (leave as root)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. Add environment variable (if you want to configure API URL this way):
   - You can also just hardcode it in the `js/app.js` file as shown in Option A
6. Click "Deploy"

---

## Part 4: Verify Everything Works

### Test 1: API Connection
1. Open your browser's Developer Tools (press F12)
2. Go to the Console tab
3. Type: `fetch('YOUR_API_URL/api/health').then(r=>r.json()).then(console.log)`
4. You should see: `{status: 'ok', timestamp: '...'}`

### Test 2: Full Flow
1. Open your deployed Wetoro site
2. Go through the welcome screens
3. Write something in the text area
4. Select an emotional tone
5. Optionally add a label
6. Click "Release"
7. Complete the breathing exercise
8. You should see your stone in the clearing ✅

### Test 3: Collective Feature
1. Open your site in a different browser or incognito/private window
2. Release another stone with a different emotion
3. Both stones should now appear in the clearing! 🎉
4. If you added labels, hover over the stones to see them

---

## Troubleshooting

### "Failed to fetch stones" Error

**Problem**: The frontend can't connect to the API

**Solutions**:
1. Check that `API_URL` in `js/app.js` is set correctly (no trailing slash)
2. Verify your API is running: visit `YOUR_API_URL/api/health`
3. Check browser console (F12) for CORS errors
4. Make sure you redeployed after adding environment variables

### Stones Not Appearing

**Problem**: Stones save but don't show up

**Solutions**:
1. Open Supabase dashboard → Table Editor → `stones` table
2. Check if stones are being saved
3. If empty, check that API environment variables are correct
4. Check browser console for JavaScript errors

### API Not Working

**Problem**: Getting 500 errors or "Internal Server Error"

**Solutions**:
1. Check API logs:
   - **Vercel**: Go to deployment → "Functions" tab → View logs
   - **Railway**: Go to deployment → View logs
2. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly
3. Make sure the `stones` table exists in Supabase
4. Run the `schema.sql` again if needed

### Database Connection Issues

**Problem**: "Failed to save stone" errors

**Solutions**:
1. Check Supabase dashboard → Settings → API
2. Verify your credentials match what's in the API environment variables
3. Check that Row Level Security policies are enabled (run `schema.sql` again)
4. Verify the `stones` table exists

---

## Maintenance & Monitoring

### Check Database Usage

1. Go to Supabase dashboard
2. Click "Settings" → "Billing"
3. View your current usage (should be well within free tier)

### View Stones in Database

1. Go to Supabase dashboard
2. Click "Table Editor"
3. Click on "stones" table
4. You'll see all the stones that have been released

### Monitor API Usage

- **Vercel**: Dashboard → Your Project → Analytics
- **Railway**: Dashboard → Your Project → Metrics
- **Netlify**: Dashboard → Site → Analytics

### Backup Your Data

1. In Supabase, go to "Database" → "Backups"
2. Enable automatic backups (available on free tier)
3. You can also manually export the `stones` table as CSV

---

## Scaling & Costs

### Free Tier Limits

**Supabase Free Tier:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth/month
- Should handle **thousands of releases per day**

**Vercel Free Tier:**
- 100 GB bandwidth/month
- 100 hours serverless function time
- Should handle **thousands of API requests per day**

**Netlify Free Tier:**
- 100 GB bandwidth/month
- Should handle **millions of page views per month**

### When to Upgrade

You'll only need to upgrade if:
- You get more than 10,000 releases per day
- You exceed bandwidth limits (very unlikely)
- You want custom features like automated backups

Upgrading costs:
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Netlify Pro: $19/month

---

## Updates & Maintenance

### Updating the Code

1. Make changes to your code locally
2. Commit and push to GitHub
3. Deploys automatically update if you set up auto-deploy
4. If not, redeploy manually in Vercel/Netlify/Railway

### Database Migrations

If you need to change the database structure:
1. Write a new SQL migration file
2. Run it in Supabase SQL Editor
3. Test thoroughly before deploying to production

---

## Security Notes

✅ **What is stored**: Only emotion symbols (tone), optional labels, and timestamp  
❌ **What is NOT stored**: The "what are you feeling?" text is **never** sent to the server  

### Privacy Features

- No user accounts or authentication required
- No tracking or analytics by default
- All releases are anonymous
- Database uses Row Level Security (RLS)
- API only accepts valid tone data

### Security Best Practices

1. Never commit your `.env` file to Git
2. Keep your Supabase keys secure
3. Don't share your admin Supabase password
4. Use environment variables for all secrets
5. Monitor your Supabase dashboard for unusual activity

---

## Need Help?

### Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com

### Common Issues

Check the Troubleshooting section above first. Most issues are:
1. Incorrect API URL
2. Missing environment variables
3. Database table not created

### Testing Checklist

- [ ] API health check returns OK
- [ ] Can save a stone (test the release flow)
- [ ] Stones appear in clearing
- [ ] Stones appear in different browser/incognito mode
- [ ] Labels show on hover (if added)
- [ ] Count updates correctly
- [ ] Stones visible in Supabase table editor

---

## Success!

If you can see multiple stones from different browser sessions in the clearing, congratulations! You've successfully deployed the Collective Release Feature. 🎉

Your Wetoro instance is now live and ready for users to share their emotional releases in a collective, anonymous space.

---

## Next Steps

Consider:
- Sharing your Wetoro link on social media
- Adding a custom domain
- Monitoring usage in Supabase
- Setting up automated backups
- Adding your own custom touches to the design

Enjoy your Wetoro clearing! 🌿
