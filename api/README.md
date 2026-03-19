# Wetoro API - Setup Guide

## Overview
This API allows Wetoro to store and retrieve stones (symbols with labels) in a shared database, enabling the "Collective Release Feature" where all users can see each other's stones in the clearing.

## What You'll Need
- A free Supabase account (https://supabase.com)
- A way to host the API (Vercel, Railway, or any Node.js hosting)
- About 15-30 minutes for setup

---

## Step 1: Create a Supabase Account and Project

### 1.1 Sign Up for Supabase
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Confirm your email if required

### 1.2 Create a New Project
1. Click "New Project"
2. Choose an organization (create one if needed)
3. Enter project details:
   - **Name**: `wetoro` (or any name you like)
   - **Database Password**: Create a strong password and save it somewhere safe
   - **Region**: Choose the region closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for the project to be created

---

## Step 2: Set Up the Database

### 2.1 Create the Stones Table
1. In your Supabase project dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of the `schema.sql` file (in this same `api` folder)
4. Paste it into the SQL editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see a success message

### 2.2 Verify the Table
1. Click on "Table Editor" in the left sidebar
2. You should see a table called `stones`
3. It will be empty at first - that's normal!

---

## Step 3: Get Your API Keys

### 3.1 Find Your Credentials
1. In Supabase, click on "Settings" (gear icon) in the left sidebar
2. Click on "API" in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://abcdefghijk.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
4. Copy both of these - you'll need them in the next step

---

## Step 4: Configure the API Server

### 4.1 Create Environment File
1. In the `api` folder, create a file named `.env` (note the dot at the start)
2. Copy this template and fill in your values:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
PORT=3000
```

3. Replace:
   - `https://your-project.supabase.co` with your Project URL from Step 3
   - `your-anon-key-here` with your anon public key from Step 3

### 4.2 Install Dependencies (if running locally)
If you're testing locally before deployment:
```bash
cd api
npm install
npm start
```

The server should start and show:
```
Wetoro API server running on port 3000
Health check: http://localhost:3000/api/health
```

---

## Step 5: Deploy the API

You have several options for deploying the API. Here are the two easiest:

### Option A: Deploy to Vercel (Recommended for beginners)

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd api
   vercel
   ```

3. **Follow the prompts**:
   - Login to Vercel (it will open a browser)
   - Link to existing project? No
   - Project name? `wetoro-api` (or your choice)
   - Which directory? `./` (current directory)
   - Override settings? No

4. **Add Environment Variables**:
   - After deployment, go to your Vercel dashboard
   - Click on your project
   - Go to "Settings" → "Environment Variables"
   - Add these variables:
     - `SUPABASE_URL`: your Supabase URL
     - `SUPABASE_ANON_KEY`: your Supabase anon key
   - Redeploy the project

5. **Note your API URL**: You'll get a URL like `https://wetoro-api.vercel.app`

### Option B: Deploy to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Wetoro repository
5. Railway will auto-detect the Node.js app
6. Add environment variables in the Railway dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
7. Note your API URL from the Railway dashboard

---

## Step 6: Update the Frontend

### 6.1 Configure API URL
In the main `js/app.js` file, you'll need to set the API URL to point to your deployed API.

Look for the line near the top that says:
```javascript
const API_URL = 'http://localhost:3000';
```

Change it to your deployed API URL:
```javascript
const API_URL = 'https://your-api-url.vercel.app';
```

---

## Step 7: Test Everything

### 7.1 Test the API Directly
Open your browser and go to:
```
https://your-api-url/api/health
```

You should see:
```json
{"status":"ok","timestamp":"2026-03-19T..."}
```

### 7.2 Test the Full Application
1. Open your Wetoro website
2. Go through the ritual and release a stone
3. You should see your stone in the clearing
4. Open the website in a different browser or incognito window
5. Release another stone with a different emotion
6. Both stones should now appear in the clearing!

---

## Troubleshooting

### "Failed to fetch stones" error
- Check that your API is running and accessible
- Verify your API_URL is correct in app.js
- Check browser console for CORS errors
- Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set correctly

### Stones not appearing
- Check the browser console for errors
- Verify the stones are being saved in Supabase:
  1. Go to Supabase dashboard
  2. Click "Table Editor"
  3. Click on "stones" table
  4. You should see entries for each stone

### Database connection errors
- Verify your Supabase credentials are correct
- Check that the stones table exists (see Step 2.2)
- Make sure RLS policies are enabled (run schema.sql again)

---

## API Endpoints Reference

Once deployed, your API has these endpoints:

- `GET /api/health` - Check if API is running
- `GET /api/stones/today` - Get all stones for today
- `GET /api/stones/:date` - Get stones for a specific date (YYYY-MM-DD)
- `POST /api/stones` - Save a new stone
- `GET /api/dates` - Get all dates that have stones

---

## Security Notes

✅ **What is stored**: Only the tone (emotion type) and optional label
❌ **What is NOT stored**: The "what are you feeling?" text is never sent to the server

The database is configured with Row Level Security to ensure data integrity.

---

## Cost

**Supabase Free Tier includes:**
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth per month

For Wetoro, this should handle thousands of stones per day at no cost.

**Vercel/Railway Free Tiers** are also generous and should be sufficient for Wetoro.

---

## Need Help?

If you run into issues:
1. Check the troubleshooting section above
2. Check browser console (press F12) for error messages
3. Check API logs in your Vercel/Railway dashboard
4. Check Supabase logs in the Supabase dashboard

---

## Next Steps

After the API is working, you can:
- Share your Wetoro link with friends
- Monitor usage in Supabase dashboard
- Add custom domain to Vercel/Railway if desired
