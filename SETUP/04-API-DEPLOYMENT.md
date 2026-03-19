# 4️⃣ Deploying Your API Server

## 🎯 What We'll Do

In this guide, you'll:
1. Understand what an API server does (in simple terms)
2. Create a Vercel account
3. Deploy your API server to the internet
4. Add your database keys so the API can connect
5. Test that everything works

**Time needed: ~15 minutes**

---

## 📋 What is an API Server?

💡 **Plain English**: Remember how we compared the API to a waiter in a restaurant?
- **The Website** = Customer (asking for something)
- **The API Server** = Waiter (taking the request)
- **The Database** = Kitchen (where the data is stored)

When someone releases a stone:
1. The website says "Save this stone!" to the API
2. The API takes that message and saves it to the database
3. The API responds "Done!" back to the website

When someone opens the clearing:
1. The website says "Show me all the stones!" to the API
2. The API asks the database for all stones
3. The API sends them back to the website
4. The website displays them

**Why not just let the website talk directly to the database?**
- Security! The API acts as a gatekeeper
- The API can check and clean data before saving it
- The API can handle errors gracefully

---

## Step 1: Create a Vercel Account

### 1.1 What is Vercel?
Vercel is a service that runs your code on the internet 24/7. It's:
- ✅ FREE for personal projects (way more than enough for Wetoro)
- ✅ Fast and reliable
- ✅ Easy to use (perfect for non-coders)
- ✅ Automatically updates when you change your code

### 1.2 Sign Up
1. Go to **https://vercel.com**
2. Click **"Sign Up"** (usually in the top-right corner)
3. You'll see several sign-up options:
   - **Continue with GitHub** ⭐ (HIGHLY RECOMMENDED - easiest option)
   - Continue with GitLab
   - Continue with Bitbucket
   - Continue with Email

4. **Choose "Continue with GitHub"**
   - You'll be redirected to GitHub
   - Click "Authorize Vercel"
   - You'll be sent back to Vercel

5. You might see a welcome screen:
   - You can click through it or skip
   - Answer questions if you want (optional)

---

## Step 2: Import Your Repository

### 2.1 Navigate to Create Project
1. You should see your Vercel dashboard
2. Look for a button that says **"Add New..."** or **"New Project"**
3. Click it
4. Select **"Project"**

### 2.2 Import from GitHub
1. You'll see a list of your GitHub repositories
2. Look for **"Wetoro"** in the list
3. Click the **"Import"** button next to it

**Can't see your repository?**
- Click "Adjust GitHub App Permissions"
- OR "Add GitHub Namespace"
- Grant Vercel access to your repositories
- Come back and find Wetoro again

### 2.3 Configure Your Project

**IMPORTANT: This is where people often make mistakes!**

You'll see a configuration page. Here's what to do:

**Project Name**
- Leave it as `wetoro` or `Wetoro` (it will auto-fill)
- This becomes part of your API URL

**Framework Preset**
- Should say "Other" - that's perfect!
- If it says something else, change it to "Other"

**Root Directory** ⚠️ **CRITICAL STEP**
- By default, it will be set to `./` (the root of your repository)
- **You MUST change this!**
- Click **"Edit"** next to Root Directory
- A file browser will appear
- Click on the **`api`** folder
- Click **"Continue"** or "Select"
- It should now show: `./api` or `api`

💡 **Why?** The API code is in the `api` folder, not the root. If you don't change this, the deployment will fail!

**Build and Output Settings**
- Leave everything as default
- You don't need to change anything here

**Environment Variables**
- **Leave this empty for now!**
- We'll add them in the next step
- (It's easier to add them after the first deployment)

### 2.4 Deploy!
1. Click the big **"Deploy"** button at the bottom
2. You'll see a deployment screen with:
   - Building... 🔨
   - Progress bars
   - Log messages (you can ignore these)
3. **⏰ Wait 1-2 minutes** for the deployment to complete

### 2.5 Deployment Complete!
When it's done, you'll see:
- 🎉 A celebration animation
- ✅ "Congratulations!" or "Your project has been deployed"
- A **"Visit"** button or a URL link

**Don't click Visit yet!** The API won't work without environment variables.

---

## Step 3: Add Your Database Keys

Now we need to tell the API how to connect to your database.

### 3.1 Navigate to Settings
1. At the top of the page, look for tabs:
   - Overview, Deployments, Analytics, **Settings**
2. Click **"Settings"**

### 3.2 Find Environment Variables
1. In the left sidebar of Settings, find **"Environment Variables"**
2. Click it
3. You'll see a form to add variables

### 3.3 Add SUPABASE_URL

Remember those keys you saved in Step 2? Time to use them!

1. In the **"Key"** field (or "Name"), type exactly: `SUPABASE_URL`
2. In the **"Value"** field, paste your Supabase URL
   - Open your saved text file (wetoro-keys.txt or wherever you saved it)
   - Copy your SUPABASE_URL (looks like `https://abcd.supabase.co`)
   - Paste it in the Value field
3. Leave "Environment" as **"Production, Preview, Development"** (all selected)
4. Click **"Save"** or **"Add"**

### 3.4 Add SUPABASE_ANON_KEY

1. The form should reset for the next variable
2. In the **"Key"** field, type exactly: `SUPABASE_ANON_KEY`
3. In the **"Value"** field, paste your Supabase anon key
   - From your saved text file
   - Copy your SUPABASE_ANON_KEY (the long string starting with `eyJ`)
   - Paste it in the Value field
4. Leave "Environment" with all options selected
5. Click **"Save"** or **"Add"**

### 3.5 Add PORT

1. In the **"Key"** field, type exactly: `PORT`
2. In the **"Value"** field, type: `3000`
3. Leave "Environment" with all options selected
4. Click **"Save"** or **"Add"**

### 3.6 Verify Your Variables
You should now see three environment variables listed:
- ✅ `SUPABASE_URL` with your database URL
- ✅ `SUPABASE_ANON_KEY` with your anon key (partially hidden)
- ✅ `PORT` with value `3000`

---

## Step 4: Redeploy with Environment Variables

The environment variables only take effect on NEW deployments, so we need to redeploy.

### 4.1 Go to Deployments Tab
1. Click **"Deployments"** at the top
2. You'll see a list of your deployments (probably just one right now)

### 4.2 Trigger Redeploy
1. Find your most recent deployment (should be at the top)
2. On the right side, click the **⋮** (three dots) menu
3. Select **"Redeploy"**
4. A popup will appear asking "Redeploy to Production?"
5. Click **"Redeploy"** button to confirm

### 4.3 Wait for Completion
1. You'll see the deployment progress again
2. **⏰ Wait about 1 minute**
3. When it's done, you'll see a green checkmark ✅

---

## Step 5: Get Your API URL

### 5.1 Find Your URL
1. Go to the **"Overview"** tab (or the main project page)
2. You'll see a section showing your domains
3. Look for a URL that looks like:
   - `https://wetoro.vercel.app`
   - OR `https://wetoro-api-something.vercel.app`
   - OR `https://something-random.vercel.app`

### 5.2 Save Your URL
1. Copy this entire URL
2. Open your text file where you saved your other keys
3. Add a new line: `VERCEL_API_URL: [paste your URL]`
4. **IMPORTANT**: Don't add a slash `/` at the end!
   - ✅ Good: `https://wetoro.vercel.app`
   - ❌ Bad: `https://wetoro.vercel.app/`

---

## Step 6: Test Your API

Let's make sure it actually works!

### 6.1 Test the Health Endpoint
1. Open a new browser tab
2. Type your API URL + `/api/health`
   - Example: `https://wetoro.vercel.app/api/health`
3. Press Enter

### 6.2 What You Should See
If everything is working, you'll see JSON data that looks like:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**If you see this, congratulations! Your API is working!** 🎉

### 6.3 If It Doesn't Work
See the Troubleshooting section below.

---

## ✅ Checkpoint

At this point, you should have:
- [ ] A Vercel account
- [ ] Your API server deployed to Vercel
- [ ] Three environment variables added (SUPABASE_URL, SUPABASE_ANON_KEY, PORT)
- [ ] A working API URL that you've saved
- [ ] Successfully tested the /api/health endpoint

---

## 🎉 Amazing Progress!

Your API server is now running on the internet 24/7! Here's what you've accomplished:
1. ✅ Deployed server-side code to the cloud
2. ✅ Connected it to your database
3. ✅ Got a public URL that your website can use
4. ✅ Tested that it's working

---

## 🚀 Next Steps

**👉 Next Guide**: [Connecting Everything Together →](./05-CONNECTING.md)

In the next guide, you'll:
- Update your website code to use your API URL
- Commit the changes to GitHub
- Prepare for final deployment

---

## 🆘 Troubleshooting

### "Can't find my repository in Vercel"
- Click "Adjust GitHub App Permissions" or "Add GitHub Namespace"
- Select your GitHub account
- Grant access to your repositories
- Try importing again

### "Deployment failed: No source detected"
- You probably didn't set the Root Directory to `api`
- **Solution**:
  1. Go to Settings → General
  2. Find "Root Directory"
  3. Change it to `api`
  4. Go back to Deployments and redeploy

### "404: NOT_FOUND" when visiting the API
- The deployment might still be processing
- Wait another minute and try again
- Make sure you added `/api/health` to the end of your URL

### "Failed to fetch" or "Network error"
- Make sure you added all three environment variables
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are correct (no typos!)
- Try redeploying again

### "When I test /api/health, I see an error page"
- Check your environment variables in Vercel Settings
- Make sure you redeployed AFTER adding the variables
- Check the error message for clues

### "The environment variables aren't showing"
- Make sure you clicked "Save" or "Add" after each one
- Try refreshing the page
- You should see them listed on the Environment Variables page

---

## 💡 Understanding What You Built

Your API server has several "endpoints" (URLs that do different things):

| Endpoint | What It Does |
|----------|-------------|
| `/api/health` | Returns "ok" to show the API is working |
| `/api/stones` | Gets all stones from the database (GET request) |
| `/api/stones` | Saves a new stone (POST request) |

Your website will use these endpoints to save and retrieve stones!

---

**Great job! Take a break if needed. When ready, continue to the next guide.** ☕
