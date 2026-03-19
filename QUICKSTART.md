# Quick Start Guide for Non-Programmers

Hi! This guide will help you set up the Collective Release Feature so that all users can see each other's stones in the clearing.

## What You'll Do

You'll set up three things:
1. **A database** to store the stones (using Supabase - it's free!)
2. **An API server** to save and retrieve stones (using Vercel - also free!)
3. **Update your website** to use the new features

**Time needed:** 30-45 minutes  
**Cost:** $0 (everything uses free tiers)

---

## Step 1: Set Up the Database (10 minutes)

### 1.1 Create Supabase Account
1. Go to **https://supabase.com**
2. Click the big green "Start your project" button
3. Sign up using your GitHub account, Google, or email
4. Check your email and verify if needed

### 1.2 Create Your Project
1. You'll see a button that says "New Project" - click it
2. Fill in these fields:
   - **Name**: Type `wetoro` (or any name you like)
   - **Database Password**: Make up a strong password and **write it down somewhere safe**
   - **Region**: Choose the one closest to where most of your users will be
3. Click "Create new project"
4. ⏰ Wait 2-3 minutes while it sets up (grab a coffee!)

### 1.3 Create the Database Table
1. On the left side, find and click **"SQL Editor"**
2. Click the **"New Query"** button
3. In this repository, open the file at `api/schema.sql`
4. Copy **all** the text from that file
5. Paste it into the SQL Editor in Supabase
6. Click **"Run"** (or press Ctrl+Enter on Windows, Cmd+Enter on Mac)
7. You should see "Success. No rows returned" - that's good! ✓

### 1.4 Get Your API Keys
1. On the left side, click the **⚙️ Settings** icon (looks like a gear)
2. In the settings menu, click **"API"**
3. You'll see two important pieces of information:
   - **Project URL** - looks like `https://abcdefgh.supabase.co`
   - **anon public** key - a very long string of letters/numbers starting with `eyJ`
4. **Copy both of these** and paste them into a text file - you'll need them in the next step!

---

## Step 2: Deploy the API Server (10 minutes)

### 2.1 Sign Up for Vercel
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub

### 2.2 Create vercel.json File
1. In your Wetoro repository, go to the `api` folder
2. Create a new file called `vercel.json`
3. Copy this content into it:

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

4. Save the file and commit it to GitHub

### 2.3 Deploy the API
1. In Vercel, click **"Add New..."** then **"Project"**
2. Click **"Import"** next to your Wetoro repository
3. Important configuration:
   - Click **"Edit"** next to "Root Directory"
   - Select the **`api`** folder
   - Leave everything else as default
4. Click **"Deploy"**
5. ⏰ Wait 1-2 minutes for deployment

### 2.4 Add Your Database Credentials
1. In your Vercel project page, click **"Settings"** at the top
2. Click **"Environment Variables"** on the left
3. Add these three variables (click "Add" between each):
   
   **Variable 1:**
   - Name: `SUPABASE_URL`
   - Value: [Paste your Supabase Project URL from Step 1.4]
   
   **Variable 2:**
   - Name: `SUPABASE_ANON_KEY`
   - Value: [Paste your Supabase anon key from Step 1.4]
   
   **Variable 3:**
   - Name: `PORT`
   - Value: `3000`

4. Click "Save" for each variable

### 2.5 Redeploy
1. Go back to the **"Deployments"** tab
2. On your latest deployment, click the **⋮** (three dots) menu
3. Click **"Redeploy"**
4. Click **"Redeploy"** again to confirm
5. Wait for it to finish

### 2.6 Get Your API URL
1. In your Vercel project, you'll see a URL that looks like:
   `https://wetoro-api-something.vercel.app`
2. **Copy this URL** - you'll need it in the next step!

### 2.7 Test It Works
1. Open your browser
2. Go to: `https://your-api-url.vercel.app/api/health`
   (Replace `your-api-url.vercel.app` with your actual URL)
3. You should see something like: `{"status":"ok","timestamp":"..."}`
4. If you see that, it's working! ✓

---

## Step 3: Update Your Website (5 minutes)

### 3.1 Connect the API
1. In your Wetoro repository, open the file `js/app.js`
2. Near the top (around line 15), find this line:
   ```javascript
   const API_URL = '';
   ```
3. Change it to your API URL (no slash at the end!):
   ```javascript
   const API_URL = 'https://your-api-url.vercel.app';
   ```
4. Save the file and commit it to GitHub

### 3.2 Deploy Your Website
Choose ONE of these options:

#### Option A: Netlify (Easiest)
1. Go to **https://netlify.com** and sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your Wetoro repository
4. Leave all settings as default
5. Click **"Deploy site"**
6. Wait 1-2 minutes
7. Your site is live! Copy the URL (looks like `https://random-name.netlify.app`)

#### Option B: GitHub Pages
1. In your GitHub repository, go to **Settings**
2. Click **"Pages"** in the left menu
3. Under "Source", select your main branch
4. Select folder: **/ (root)**
5. Click **"Save"**
6. Wait a few minutes
7. Your site will be at: `https://yourusername.github.io/Wetoro`

---

## Step 4: Test Everything! (5 minutes)

### Test 1: Your First Stone
1. Open your deployed website
2. Go through the welcome screens
3. Write something in the text box
4. Choose an emotion (click one of the shapes)
5. Optionally add a label
6. Click "Release"
7. Do the breathing exercise
8. You should see your stone in the clearing! ✓

### Test 2: The Collective Feature
1. Open your website in a different browser (or incognito/private mode)
2. Release another stone with a different emotion
3. Now both stones should appear! 🎉
4. Try hovering over stones to see labels

### Test 3: Check the Database
1. Go back to Supabase
2. Click **"Table Editor"** on the left
3. Click on the **"stones"** table
4. You should see entries for each stone you released! ✓

---

## Troubleshooting

### "Failed to fetch stones" Error
- Make sure the `API_URL` in `js/app.js` is correct (no trailing slash)
- Check that your API is working: visit `YOUR_API_URL/api/health`
- Make sure you added all three environment variables in Vercel

### Stones Not Showing Up
- Check the browser console (press F12) for errors
- Go to Supabase → Table Editor → stones to see if they're being saved
- Make sure you redeployed your Vercel project after adding environment variables
- **Note:** If you see your own stone but not others, this is normal if you're the only user who has released a stone today
- **Timezone Issue (Fixed):** If you updated from an older version, make sure to redeploy both your frontend (Netlify/GitHub Pages) and backend (Vercel) to get the timezone fix

### Still Having Issues?
1. Check the detailed guide in `DEPLOYMENT.md`
2. Check the API guide in `api/README.md`
3. Open an issue on GitHub with:
   - What you were trying to do
   - What happened instead
   - Any error messages you see (press F12 to see console errors)

---

## You're Done! 🎉

Congratulations! Your Wetoro instance now has the Collective Release Feature enabled. All users can now see each other's stones in the clearing.

### What to Do Next

- Share your Wetoro link with friends
- Watch the clearing fill up with stones
- Check Supabase dashboard to see usage
- Add a custom domain if you want (optional)

### Monitoring

**To see how many stones have been placed:**
1. Go to Supabase dashboard
2. Click "Table Editor"
3. Click "stones" table
4. You'll see all the stones with their emotions and labels

**To check API usage:**
1. Go to Vercel dashboard
2. Click on your project
3. Check the "Analytics" tab

---

## Important Privacy Note

✅ **What gets stored:** Only the emotion symbol and optional label  
❌ **What does NOT get stored:** The actual text you write about your feelings

Your users' privacy is protected - the "what are you feeling?" text is **never** sent to the server.

---

## Need More Help?

- **Detailed Deployment Guide:** See `DEPLOYMENT.md` in this repository
- **API Documentation:** See `api/README.md` in this repository
- **Get Help:** Open an issue on GitHub

Enjoy your Wetoro clearing! 🌿
