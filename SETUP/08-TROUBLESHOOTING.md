# 8️⃣ Troubleshooting Guide

## 🎯 How to Use This Guide

This guide is organized by symptom. Find the problem you're experiencing and follow the solutions.

**Pro Tip:** Use Ctrl+F (or Cmd+F) to search for keywords related to your issue!

---

## 🔍 General Debugging Approach

Before diving into specific issues:

### Step 1: Identify Where the Problem Is
```
Website → API → Database
   ↓       ↓       ↓
Check   Check   Check
Console Logs    Data
```

### Step 2: Check the Basics
- [ ] Is your website URL correct?
- [ ] Is your API URL correct in `app.js`?
- [ ] Are environment variables set in Vercel?
- [ ] Did you redeploy after making changes?

### Step 3: Look at Error Messages
- Open browser console (F12)
- Look for red errors
- Read the full error message (don't just skim it!)
- Search for the exact error text if you don't understand it

---

## 🌐 Website Won't Load

### Problem: "This site can't be reached" or 404 Error

**Possible Causes:**
1. URL is incorrect
2. Site hasn't finished deploying
3. Deployment failed

**Solutions:**

**Check deployment status:**
- Go to your Netlify/Vercel dashboard
- Check if the deployment shows as "Success" or "Failed"
- If failed, click on it to see error logs

**Verify URL:**
- Make sure you're using the correct URL (check your dashboard)
- Don't add extra slashes or paths

**Wait and retry:**
- Deployments can take 1-2 minutes
- Wait a bit and try refreshing

**Check deployment logs:**
1. Go to your hosting dashboard
2. Click on "Deployments" or "Deploys"
3. Click on the latest deployment
4. Read the logs for errors

---

### Problem: Website Loads But Looks Broken (No Styling)

**Possible Causes:**
1. CSS file path is wrong
2. Build settings are incorrect
3. Files aren't in the right place

**Solutions:**

**Check file structure on GitHub:**
- Go to your GitHub repository
- Verify this structure exists:
  ```
  /
  ├── index.html
  ├── css/
  │   └── styles.css
  └── js/
      └── app.js
  ```

**Check root directory setting:**
- In Netlify/Vercel, verify "Root Directory" is set to `/` (root)
- NOT `/api` (that's for the API deployment)

**Hard refresh:**
- Windows: Ctrl + F5
- Mac: Cmd + Shift + R
- This clears cache and reloads

---

## 🔌 API Connection Issues

### Problem: "Failed to fetch" or "Network request failed"

**Possible Causes:**
1. API_URL is not set or incorrect
2. API isn't running
3. CORS issues

**Solutions:**

**1. Check API_URL in your code:**
- Go to your repository on GitHub
- Navigate to `js/app.js`
- Find `const API_URL` (around line 15)
- Make sure it's set to your Vercel API URL
- Example: `const API_URL = 'https://your-api.vercel.app';`
- ❌ Bad: `const API_URL = '';` (empty)
- ❌ Bad: Has a trailing slash

**2. Test if API is running:**
- Open a new browser tab
- Go to: `https://your-api-url.vercel.app/api/health`
- You should see: `{"status":"ok","timestamp":"..."}`
- If you see an error, your API has problems (see API section below)

**3. Check browser console:**
- Press F12
- Click "Console" tab
- Look for exact error message
- Search for that error message to understand it

---

### Problem: API Health Check Returns Error

**Possible Causes:**
1. Environment variables not set
2. API code issues
3. Deployment failed

**Solutions:**

**Check environment variables in Vercel:**
1. Go to Vercel dashboard
2. Click on your API project (the one deployed from `api` folder)
3. Go to Settings → Environment Variables
4. Verify these three exist:
   - `SUPABASE_URL` = Your Supabase project URL
   - `SUPABASE_ANON_KEY` = Your Supabase anon key
   - `PORT` = `3000`

**If any are missing:**
1. Add them (see Step 4 of API Deployment guide)
2. Go to Deployments tab
3. Redeploy (click ⋮ → Redeploy)

**Check Vercel logs:**
1. Go to your API project in Vercel
2. Click "Deployments"
3. Click on the latest deployment
4. Click "View Function Logs" or "Runtime Logs"
5. Look for error messages

---

## 🗄️ Database Issues

### Problem: Stones Don't Appear in Database

**Possible Causes:**
1. API can't connect to Supabase
2. Wrong database credentials
3. Table doesn't exist

**Solutions:**

**1. Verify table exists:**
- Log into Supabase
- Go to Table Editor
- Look for "stones" table
- If it doesn't exist, run the schema.sql script again (see Guide 3)

**2. Check Supabase credentials:**
- In Supabase: Settings → API
- Copy your URL and anon key
- In Vercel: Settings → Environment Variables
- Make sure they match EXACTLY (no typos, no extra spaces)

**3. Check Supabase logs:**
- In Supabase, go to Logs
- Look for recent API requests
- Check for errors

**4. Test database connection:**
- Go to Vercel → Your API project → Settings → Environment Variables
- Temporarily add a test to your API code to log connections
- Or use Supabase's built-in API to test

---

### Problem: Can Read Stones But Can't Write Them

**Possible Causes:**
1. Row Level Security (RLS) policies are too restrictive
2. Insert policy is missing

**Solutions:**

**Check RLS policies:**
1. In Supabase, go to Authentication → Policies
2. Look at the "stones" table policies
3. You should see an INSERT policy that allows public access
4. If missing, run the schema.sql script again

**Manually add INSERT policy:**
1. In Table Editor, click on "stones" table
2. Look for RLS settings
3. Add a new policy:
   - Name: "Enable insert for all"
   - Allowed operation: INSERT
   - Target roles: public
   - Policy definition: `true`

---

## 👥 Collective Feature Not Working

### Problem: Can't See Other Users' Stones

**Possible Causes:**
1. API isn't being used (localStorage fallback)
2. Multiple users haven't actually released stones
3. Browser cache

**Solutions:**

**1. Verify API is being used:**
- Open browser console (F12)
- Go to Network tab
- Release a stone
- You should see a request to `/api/stones`
- If not, check API_URL configuration

**2. Check database:**
- Go to Supabase Table Editor
- Look at "stones" table
- Are there multiple entries?
- If not, the stones are only saved locally

**3. Test properly:**
- Open two DIFFERENT browsers (or one incognito)
- Release a stone in each
- Check Supabase - should have 2 entries
- Refresh both browsers - should see both stones

**4. Clear cache and retry:**
- Clear browser cache
- Or use incognito/private mode
- Try releasing a stone again

---

## ⚙️ Deployment Issues

### Problem: Vercel Deployment Fails

**Possible Causes:**
1. Wrong root directory
2. Missing files
3. Build errors

**Solutions:**

**For API deployment:**
- Root Directory should be set to `api`
- Check that `api/package.json` exists
- Check that `api/server.js` exists

**For Website deployment:**
- Root Directory should be `/` (root)
- Check that `index.html` exists in the root
- Not in a subfolder!

**Check build logs:**
1. Click on the failed deployment
2. Read the full error log
3. Look for the actual error (usually near the bottom)
4. Search for that specific error online

---

### Problem: Netlify Deployment Shows Old Version

**Possible Causes:**
1. Changes not pushed to GitHub
2. Cache issue
3. Deployment didn't trigger

**Solutions:**

**1. Verify changes are on GitHub:**
- Go to your repository on GitHub
- Navigate to the file you changed
- Make sure you see your changes

**2. Manually trigger deploy:**
- In Netlify dashboard
- Go to Deploys
- Click "Trigger deploy" → "Deploy site"

**3. Clear deploy cache:**
- In Netlify: Site settings → Build & deploy
- Click "Clear cache and deploy site"

---

## 🐛 Common Error Messages

### "CORS policy: No 'Access-Control-Allow-Origin' header"

**What it means:** Your API doesn't allow requests from your website's domain.

**Solution:**
- The API code should already have CORS configured
- Check `api/server.js` has `app.use(cors())`
- Redeploy your API
- If still broken, check Vercel logs for CORS errors

---

### "Cannot read property of undefined"

**What it means:** JavaScript is trying to access data that doesn't exist.

**Solution:**
- Open browser console for full error
- Note the line number
- This is usually a code bug, not a configuration issue
- Check if data is loading correctly

---

### "Failed to load resource: net::ERR_NAME_NOT_RESOLVED"

**What it means:** Browser can't find the server at that URL.

**Solution:**
- Double-check your API_URL in `app.js`
- Make sure it's a valid URL (starts with https://)
- Make sure the Vercel API deployment is successful
- Test the URL directly in your browser

---

### "401 Unauthorized" or "403 Forbidden"

**What it means:** Database credentials are wrong or missing.

**Solution:**
- Check SUPABASE_ANON_KEY in Vercel environment variables
- Make sure it matches the key in Supabase Settings → API
- No typos, no extra spaces
- Redeploy after fixing

---

### "500 Internal Server Error"

**What it means:** Your API code crashed.

**Solution:**
- Check Vercel function logs
- Look for the specific error
- Usually an environment variable is missing
- Or Supabase connection is failing

---

## 🔧 Advanced Debugging

### How to Check Vercel Function Logs

1. Go to Vercel dashboard
2. Click on your API project
3. Click "Deployments"
4. Click on the latest deployment
5. Scroll down to "Functions" section
6. Click on "server.js" function
7. Click "View Function Logs"
8. Look for errors in red

### How to Check Network Requests

1. Open your website
2. Press F12 (open DevTools)
3. Go to Network tab
4. Release a stone
5. Look for the request to your API
6. Click on it to see:
   - Request headers
   - Request payload (data being sent)
   - Response (what the API returned)
   - Status code

### How to Test API Directly

Use a tool like Postman or just curl:

```bash
# Test health endpoint
curl https://your-api.vercel.app/api/health

# Test getting stones
curl https://your-api.vercel.app/api/stones

# Test creating a stone
curl -X POST https://your-api.vercel.app/api/stones \
  -H "Content-Type: application/json" \
  -d '{"emotion_symbol":"circle-joyful","label":"Test","released_at":"2024-01-01T00:00:00Z"}'
```

---

## 📝 Checklist When Nothing Works

Go through this systematically:

### Level 1: Basic Checks
- [ ] Website URL is correct
- [ ] API URL is correct in app.js (no typos)
- [ ] All files are on GitHub
- [ ] Latest code is on GitHub (check commit history)

### Level 2: Configuration
- [ ] Vercel API has all 3 environment variables
- [ ] Environment variables match Supabase keys exactly
- [ ] Root directory is `api` for API deployment
- [ ] Root directory is `/` for website deployment

### Level 3: Deployments
- [ ] API deployment shows "Success" in Vercel
- [ ] Website deployment shows "Success" in Netlify/Vercel
- [ ] Redeployed after adding environment variables
- [ ] No errors in deployment logs

### Level 4: Database
- [ ] Supabase project exists and is running
- [ ] "stones" table exists in Supabase
- [ ] RLS policies allow INSERT and SELECT
- [ ] Can see API requests in Supabase logs

### Level 5: Testing
- [ ] `/api/health` returns {"status":"ok"}
- [ ] Browser console has no red errors
- [ ] Network tab shows successful API requests
- [ ] Stones appear in Supabase when released

---

## 🆘 Getting Help

If you've tried everything and still stuck:

### Before Asking for Help, Gather This Information:

1. **What you're trying to do**
   - Example: "Release a stone"

2. **What's actually happening**
   - Example: "Stone appears but not in database"

3. **Error messages**
   - Exact text from browser console
   - Screenshots help!

4. **Your setup**
   - Website URL
   - API URL
   - Hosting services used (Netlify, Vercel, etc.)

5. **What you've tried**
   - List the solutions you've attempted

### Where to Get Help:

1. **GitHub Issues**
   - Go to the Wetoro repository
   - Click "Issues"
   - Click "New Issue"
   - Describe your problem with the information above

2. **Community Forums**
   - Supabase Discord: https://discord.supabase.com
   - Vercel Discord: https://vercel.com/discord
   - Netlify Community: https://answers.netlify.com

3. **Stack Overflow**
   - Tag your question with: `supabase`, `vercel`, `netlify`
   - Include all relevant code snippets

---

## 🎓 Common Beginner Mistakes

Learn from others' mistakes:

### 1. Wrong Root Directory
- API should be deployed from `/api` folder
- Website should be deployed from `/` root
- Don't mix these up!

### 2. Forgetting to Redeploy
- Adding environment variables doesn't auto-redeploy
- Always redeploy after changing environment variables

### 3. Trailing Slashes in URLs
- `https://api.com/` ❌
- `https://api.com` ✅

### 4. Not Committing Changes
- Changes on your computer aren't automatically on GitHub
- Must commit AND push
- Hosting services deploy from GitHub, not your computer

### 5. Using Wrong Keys
- Using "service_role" key instead of "anon" key
- Using old keys after regenerating
- Typos when copying keys

---

## ✅ When Everything Works

If you've solved your issue:
- 🎉 Celebrate! You did it!
- 📝 Document what fixed it (might help others)
- 🧪 Test thoroughly to make sure it's really fixed
- ☕ Take a break - you earned it!

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MDN Web Docs**: https://developer.mozilla.org (for JavaScript help)

---

**Remember: Every developer faces these issues. It's part of the learning process! Don't give up!** 💪
