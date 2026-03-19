# 6️⃣ Putting Your Website Online

## 🎯 What We'll Do

In this guide, you'll:
1. Choose a hosting service (Netlify recommended)
2. Deploy your website to the internet
3. Get a public URL that anyone can visit
4. Optionally set up automatic updates

**Time needed: ~10 minutes**

---

## 📋 What is Website Hosting?

💡 **Plain English**: Hosting means putting your website files on a computer (server) that's always connected to the internet, so anyone can visit your website at any time.

Think of it like:
- Your code = a book you wrote
- Hosting = putting it in a library where anyone can read it
- The URL = the library's address

---

## Choosing a Hosting Service

You have several options:

| Service | Best For | Pros | Cons |
|---------|----------|------|------|
| **Netlify** | Beginners | Easiest, auto-updates, great UI | None for this project |
| **Vercel** | Already used Vercel for API | All in one place | Slightly more complex setup |
| **GitHub Pages** | Want free custom domain | Totally free, simple | Manual updates, takes longer |
| **Cloudflare Pages** | Want speed | Very fast, generous free tier | Interface less intuitive |

**Recommendation: Use Netlify** - It's the easiest and most beginner-friendly!

---

## Method A: Deploy to Netlify (Recommended)

### A1. Create Netlify Account
1. Go to **https://netlify.com**
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"** (easiest!)
4. Authorize Netlify to access your GitHub
5. You might see a welcome screen - you can skip through it

### A2. Create New Site
1. You'll see your Netlify dashboard
2. Look for a button that says **"Add new site"** or **"Import an existing project"**
3. Click it
4. Select **"Import from Git"** or **"Deploy with GitHub"**

### A3. Connect to GitHub
1. Click **"GitHub"**
2. Authorize Netlify (if you haven't already)
3. You'll see a list of your repositories
4. Find and click **"Wetoro"**

**Can't see your repository?**
- Click "Configure the Netlify app on GitHub"
- Grant access to your repositories
- Come back and try again

### A4. Configure Build Settings

**IMPORTANT**: Unlike the API, the website uses the ROOT of the repository!

**Build settings:**
- Branch to deploy: **main** (or **master**, whatever your main branch is called)
- Base directory: Leave EMPTY or set to `/`
- Build command: Leave EMPTY (no build needed!)
- Publish directory: Leave EMPTY or set to `/`

💡 **Why no build?** Wetoro is made with plain HTML, CSS, and JavaScript - no build process needed!

### A5. Deploy!
1. Click the **"Deploy [site-name]"** button
2. You'll see a deployment progress screen
3. **⏰ Wait 30 seconds to 1 minute**

### A6. Get Your URL
1. When deployment is complete, you'll see a confetti animation 🎉
2. Your site is live!
3. You'll see a URL like: `https://random-name-123456.netlify.app`
4. Click the URL to visit your live website!

### A7. Optional: Customize Your URL
1. Go to **Site settings**
2. Click **"Change site name"** (under Site details)
3. Enter a custom name like: `my-wetoro` or `wetoro-clearing`
4. Your URL becomes: `https://my-wetoro.netlify.app`
5. Click **"Save"**

### A8. Save Your URL
1. Copy your Netlify URL
2. Add it to your saved text file:
   ```
   Netlify Website URL: https://my-wetoro.netlify.app
   ```

---

## Method B: Deploy to Vercel

If you want everything (API + Website) on Vercel:

### B1. Create New Project
1. In your Vercel dashboard, click **"Add New..."** → **"Project"**
2. Import your Wetoro repository again
3. This time, configure differently:

### B2. Configure for Website
- **Root Directory**: Leave as `./` (NOT `api` this time!)
- **Framework Preset**: Other
- **Build Command**: Leave empty
- **Output Directory**: Leave empty

### B3. Deploy
1. Click **"Deploy"**
2. Wait about 1 minute
3. Your website will be at a URL like: `https://wetoro-abc123.vercel.app`

### B4. Note About Multiple Deployments
Now you have TWO Vercel projects:
- One for the API (in the `api` folder)
- One for the website (in the root)

This is fine! They work independently.

---

## Method C: Deploy to GitHub Pages

### C1. Enable GitHub Pages
1. Go to your Wetoro repository on GitHub
2. Click **"Settings"** (top menu)
3. Scroll down and click **"Pages"** (left sidebar)

### C2. Configure Source
1. Under "Source", select your **main** branch (or **master**)
2. Folder: Select **/ (root)**
3. Click **"Save"**

### C3. Wait for Deployment
1. It takes 2-5 minutes for GitHub Pages to build
2. Refresh the page after a few minutes
3. You'll see a message like: "Your site is live at https://your-username.github.io/Wetoro/"

### C4. Visit Your Site
1. Click the URL or copy it
2. Visit it in your browser
3. Wetoro should load!

### C5. Note About Updates
- With GitHub Pages, you need to wait a few minutes after code changes
- Netlify and Vercel update instantly

---

## ✅ Checkpoint

At this point, you should have:
- [ ] Chosen a hosting service
- [ ] Deployed your website
- [ ] A public URL that anyone can visit
- [ ] Saved your website URL for reference

---

## Step 3: Test Your Live Website

Let's make sure everything is working!

### 3.1 Visit Your Website
1. Open your website URL in a browser
2. You should see the Wetoro landing page
3. It should look clean and professional

### 3.2 Go Through the Welcome
1. Click through the welcome screens
2. Read about how Wetoro works
3. Continue to the main clearing

### 3.3 Basic Functionality Test
1. Click "What are you feeling?"
2. Type anything in the text box
3. Click "Continue"
4. You should see 24 emotional options appear

If you see all this, great! Your website is working! ✅

**Don't test releasing a stone yet** - we'll do a full test in the next guide!

---

## Step 4: Configure Automatic Deployments (Optional but Recommended)

### If Using Netlify or Vercel
Good news: **Automatic deployments are already enabled!**

What this means:
- Every time you push code to GitHub
- Netlify/Vercel automatically deploys the new version
- Usually takes 30-60 seconds
- You don't have to do anything!

### If Using GitHub Pages
Automatic deployments are enabled by default with GitHub Pages too!

---

## 🎉 Congratulations!

Your website is now live on the internet! Here's what you've accomplished:
1. ✅ Deployed a full web application
2. ✅ Got a public URL anyone can visit
3. ✅ Set up automatic updates (probably)
4. ✅ Your website can talk to your API

---

## 🔍 Understanding What Happened

Let's review the full architecture you've built:

```
┌─────────────────────────────────────────────┐
│  User's Browser                              │
│  (Anywhere in the world)                     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Your Website                                │
│  https://your-site.netlify.app              │
│  (HTML, CSS, JavaScript files)               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Your API Server                             │
│  https://your-api.vercel.app                │
│  (Node.js + Express)                         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Your Database                               │
│  https://abcd.supabase.co                   │
│  (PostgreSQL)                                │
└─────────────────────────────────────────────┘
```

When someone releases a stone:
1. They interact with your Website
2. Website sends data to your API Server
3. API Server saves it to your Database
4. Database confirms it's saved
5. API tells Website "Success!"
6. Website shows the stone in the clearing

---

## 🚀 Next Steps

**👉 Next Guide**: [Testing Everything →](./07-TESTING.md)

In the next guide, you'll:
- Do a complete end-to-end test
- Release your first stone
- Test with multiple users
- Verify everything is working perfectly

---

## 🆘 Troubleshooting

### "My website shows but looks broken/unstyled"
- The CSS might not have loaded
- Check that `css/styles.css` exists in your repository
- Wait a minute and try refreshing (Ctrl+F5 or Cmd+Shift+R)

### "I see a 404 Not Found error"
- Make sure your site has finished deploying
- Check the deployment logs in Netlify/Vercel/GitHub
- Verify the URL is correct

### "The website loads but doesn't show the welcome screens"
- Check that `index.html` is in the ROOT of your repository, not in a subfolder
- Verify your build settings (root directory should be `/` not `/api`)

### "How do I see deployment logs?"
**Netlify:**
- Go to your site dashboard
- Click "Deploys"
- Click on the latest deployment
- Scroll down to see logs

**Vercel:**
- Go to your website project (NOT the API project)
- Click "Deployments"
- Click on the latest deployment
- View the "Build Logs"

**GitHub Pages:**
- Go to your repository
- Click "Actions" tab
- Click on the latest "pages build and deployment" workflow
- View the logs

### "Can I use my own domain name?"
Yes! All these services support custom domains:

**Netlify:** Settings → Domain management → Add custom domain  
**Vercel:** Settings → Domains → Add domain  
**GitHub Pages:** Settings → Pages → Custom domain

You'll need to:
1. Own a domain name (buy from Namecheap, Google Domains, etc.)
2. Update DNS settings to point to your host
3. Follow the host's specific instructions

---

## 💡 Pro Tips

### Sharing Your Wetoro URL
- Share on social media
- Send to friends who might want to release emotions
- Add to your email signature
- Create a QR code that links to it

### Monitoring Usage
- **Netlify**: Check Analytics tab for visitor stats
- **Vercel**: Check Analytics tab for traffic info
- **Supabase**: Check Database → stones table to see how many stones have been released

### Updating Your Website
1. Make changes to your code
2. Commit and push to GitHub
3. Your hosting service automatically redeploys!
4. Wait 30-60 seconds and refresh your website

---

**You're almost done! One more guide to test everything!** 🎯
