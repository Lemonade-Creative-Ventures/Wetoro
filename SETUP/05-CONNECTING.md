# 5️⃣ Connecting Everything Together

## 🎯 What We'll Do

In this guide, you'll:
1. Update your website code to point to your API server
2. Make this change in GitHub (or locally)
3. Commit the change so it's saved

**Time needed: ~5 minutes**

---

## 📋 Why Do We Need To Do This?

Right now:
- ✅ Your database is set up (Supabase)
- ✅ Your API server is running (Vercel)
- ❌ Your website doesn't know where the API is!

We need to tell the website: "Hey, when you want to save or get stones, talk to this URL!"

💡 **Plain English**: It's like giving someone your phone number so they can call you. Right now the website has a blank phone number (`''`), and we need to fill it in with your API's address.

---

## Step 1: Choose Your Method

You can update the code in two ways:

**Method A: Edit on GitHub (Easier for non-coders)**
- Edit directly in your browser
- No software needed
- Perfect if you don't have the code on your computer

**Method B: Edit Locally (If you have the code on your computer)**
- Edit in a text editor on your computer
- Commit and push to GitHub
- Better if you're comfortable with Git

Choose the method that works for you!

---

## Method A: Edit on GitHub (Recommended)

### A1. Go to Your Repository
1. Open your browser
2. Go to **https://github.com/[your-username]/Wetoro**
   - Replace `[your-username]` with your actual GitHub username
3. You should see your Wetoro repository

### A2. Navigate to the File
1. You'll see a list of files and folders
2. Click on the **`js`** folder
3. Click on **`app.js`**
4. You'll see the contents of the file

### A3. Edit the File
1. Look for a **pencil icon** (✏️) in the top-right area of the file view
   - It might say "Edit this file" when you hover over it
2. Click the pencil icon
3. The file will become editable

### A4. Find the API_URL Line
1. The file is LONG (over 1000 lines) - don't worry!
2. Use the browser's search function:
   - Press **Ctrl+F** (Windows) or **Cmd+F** (Mac)
   - Type: `const API_URL`
   - Press Enter
3. You should see this line highlighted (around line 15):
   ```javascript
   const API_URL = '';
   ```

### A5. Update the URL
1. Change the line from:
   ```javascript
   const API_URL = '';
   ```
   
2. To this (using YOUR API URL from the previous guide):
   ```javascript
   const API_URL = 'https://your-api-url.vercel.app';
   ```

**IMPORTANT NOTES:**
- ✅ Keep the single quotes `'...'`
- ✅ Use YOUR actual Vercel URL
- ❌ Don't add a trailing slash `/` at the end
- ❌ Don't add `/api` to the end (the code handles that)

**Example of what it should look like:**
```javascript
const API_URL = 'https://wetoro.vercel.app';
```

### A6. Save the Changes
1. Scroll down to the bottom of the page
2. You'll see a section called "Commit changes"
3. In the text box, you can leave the default message or type:
   ```
   Add API URL for production deployment
   ```
4. Make sure **"Commit directly to the main branch"** is selected
5. Click the green **"Commit changes"** button

### A7. Verify
1. Navigate back to `js/app.js` in your repository
2. Look at line 15 (or search for `API_URL` again)
3. Confirm it now shows your Vercel URL
4. If it does, you're done! ✅

---

## Method B: Edit Locally

### B1. Open the File
1. On your computer, navigate to your Wetoro project folder
2. Open the `js` folder
3. Find and open `app.js` in your text editor
   - Windows: Notepad, Notepad++, VS Code
   - Mac: TextEdit, VS Code, Sublime

### B2. Find the API_URL Line
1. Use the Find function:
   - Press **Ctrl+F** (Windows) or **Cmd+F** (Mac)
   - Type: `const API_URL`
   - Press Enter
2. You should find this line (around line 15):
   ```javascript
   const API_URL = '';
   ```

### B3. Update the URL
1. Change from:
   ```javascript
   const API_URL = '';
   ```
   
2. To (using YOUR API URL):
   ```javascript
   const API_URL = 'https://your-api-url.vercel.app';
   ```

**Example:**
```javascript
const API_URL = 'https://wetoro.vercel.app';
```

### B4. Save the File
1. Press **Ctrl+S** (Windows) or **Cmd+S** (Mac)
2. OR use File → Save
3. Close the text editor

### B5. Commit and Push to GitHub

**If you're comfortable with Git:**
```bash
git add js/app.js
git commit -m "Add API URL for production deployment"
git push origin main
```

**If you're not familiar with Git:**
1. Open GitHub Desktop (if you have it)
2. You'll see `app.js` has changed
3. Add a commit message: "Add API URL for production deployment"
4. Click "Commit to main"
5. Click "Push origin"

**OR use GitHub's web interface:**
1. Go to github.com and your repository
2. GitHub will detect your file has changed
3. Upload the new version of the file

---

## Step 2: Verify the Change

Let's make sure the change was saved correctly!

### 2.1 Check on GitHub
1. Go to your Wetoro repository on GitHub
2. Navigate to `js/app.js`
3. Look at line 15 (or search for `API_URL`)
4. You should see your Vercel URL there

### 2.2 What You Should See
```javascript
const API_URL = 'https://your-actual-url.vercel.app';
```

If you see this, perfect! ✅

---

## ✅ Checkpoint

At this point, you should have:
- [ ] Updated the `API_URL` in `js/app.js` with your Vercel URL
- [ ] Committed the change to GitHub
- [ ] Verified the change is visible on GitHub

---

## 🎉 Excellent Work!

Your website code now knows where to find your API server! Here's what you just did:
1. ✅ Connected the frontend (website) to the backend (API)
2. ✅ Saved the change in version control (GitHub)
3. ✅ Prepared your code for deployment

---

## 🔍 What This Actually Does

When someone uses your website:
1. They release a stone with an emotion and label
2. The JavaScript code in `app.js` runs
3. It looks at `API_URL` to know where to send the data
4. It makes a request to `https://your-url.vercel.app/api/stones`
5. Your API receives it and saves it to Supabase
6. The API responds "Success!"
7. The website shows the stone in the clearing

Before you added the URL, the code couldn't find the API, so stones would only be saved locally in the browser (using localStorage).

---

## 🚀 Next Steps

**👉 Next Guide**: [Putting Your Website Online →](./06-WEBSITE-DEPLOYMENT.md)

In the next guide, you'll:
- Deploy your website to Netlify (or GitHub Pages)
- Get a public URL that anyone can visit
- Make Wetoro accessible to the world!

---

## 🆘 Troubleshooting

### "I can't find the pencil/edit icon on GitHub"
- Make sure you're logged into GitHub
- Make sure you're viewing YOUR repository (not someone else's fork)
- Try refreshing the page

### "I'm not sure if I have the right URL"
- Go back to your Vercel dashboard
- Click on your Wetoro project
- The URL is displayed at the top (in the Domains section)
- It should look like `something.vercel.app`

### "The file looks different / I can't find line 15"
- Line numbers might be slightly different
- Just search for `const API_URL = ''`
- It should be near the top of the file

### "I made a mistake, how do I undo it?"
- On GitHub, click "History" for the file
- Find the previous version (before your change)
- Click "..." and select "View file at this point"
- Copy the correct line
- Edit the file again and fix it

### "What if my API URL changes later?"
- No problem! Just repeat this process
- Edit `app.js` again with the new URL
- Commit the change
- Redeploy your website (we'll cover deployment next)

---

## 💡 Pro Tips

### Keeping Your URLs Organized
Create a simple text file with all your important URLs:

```
Wetoro Setup Information
========================

Supabase Project URL: https://abcd.supabase.co
Supabase Anon Key: eyJ... (your key here)

Vercel API URL: https://wetoro.vercel.app
Netlify Website URL: (you'll get this in the next guide)

GitHub Repository: https://github.com/yourusername/Wetoro
```

Save this somewhere safe! You might need these later.

---

**Almost there! Continue to the next guide to deploy your website!** 🚀
