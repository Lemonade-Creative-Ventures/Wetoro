# 2️⃣ Getting Your API Keys

## 🎯 What We'll Do

In this guide, you'll:
1. Create a Supabase account (where your database will live)
2. Create a new project for Wetoro
3. Find and copy your API keys (the passwords your code needs)

**Time needed: ~15 minutes**

---

## 📋 What Are API Keys?

💡 **Plain English**: API keys are like special passwords that let your website talk to your database. You need two things:
- **SUPABASE_URL** - The address of your database (like a house address)
- **SUPABASE_ANON_KEY** - The key to get in (like a door key)

These keys are safe to use on public websites because they only allow reading and adding stones, not deleting or changing them.

---

## Step 1: Create a Supabase Account

### 1.1 Go to Supabase
1. Open your web browser
2. Go to: **https://supabase.com**
3. You'll see the Supabase homepage

### 1.2 Sign Up
1. Click the **"Start your project"** button (it's green and hard to miss!)
2. You'll see three sign-up options:
   - **GitHub** (recommended - easiest option)
   - **Google**
   - **Email**

3. **If using GitHub** (recommended):
   - Click "Continue with GitHub"
   - You'll be taken to GitHub to authorize Supabase
   - Click "Authorize supabase"
   - You'll be redirected back to Supabase

4. **If using Email**:
   - Enter your email address
   - Create a password (write it down!)
   - Click "Sign Up"
   - Check your email for a verification link
   - Click the link to verify your account

### 1.3 Welcome Screen
After signing up, you might see a welcome screen asking about your project. You can:
- Skip this (click "Skip" or "Close")
- Fill it out if you want (doesn't matter for setup)

---

## Step 2: Create Your Wetoro Project

### 2.1 Start a New Project
1. You should see a button that says **"New project"** or **"Create a new project"**
2. Click it
3. You'll see a form asking for project details

### 2.2 Fill in Project Details

**Organization** (you might not see this)
- If you see this dropdown, select your personal account or organization
- If you don't see it, skip to the next field

**Project Name**
- Type: `wetoro`
- (Or any name you like - this is just for you to identify the project)

**Database Password**
- Click the "Generate a password" button (🔄 icon)
- OR make up a strong password
- **⚠️ IMPORTANT**: Copy this password and save it somewhere safe!
  - Open your text editor (Notepad, TextEdit, etc.)
  - Paste the password
  - Label it: "Supabase Database Password"
- You might need this password later if you want to connect directly to the database

**Region**
- Click the dropdown
- Choose the region closest to where most of your users will be:
  - `East US` - If users are in North/South America (East Coast)
  - `West US` - If users are in North/South America (West Coast)
  - `Central EU` - If users are in Europe
  - `Southeast Asia` - If users are in Asia/Pacific
  - Pick the closest one - it affects speed

**Pricing Plan**
- Make sure **"Free"** is selected (it should be by default)
- The free tier is more than enough for Wetoro

### 2.3 Create the Project
1. Click the **"Create new project"** button at the bottom
2. You'll see a loading screen that says "Setting up project..."
3. **⏰ This takes 2-3 minutes** - perfect time to:
   - Get a drink ☕
   - Stretch 🙆
   - Pet your cat/dog 🐱🐶
   - Just wait patiently

The screen will show progress:
- "Initializing project..."
- "Setting up database..."
- "Your project is almost ready..."

### 2.4 Project Dashboard
When it's done, you'll see your project dashboard! It has:
- A sidebar on the left with menu items
- A main area showing project information
- Lots of data and charts (you can ignore these for now)

---

## Step 3: Get Your API Keys

Now comes the important part - getting the keys your code needs!

### 3.1 Navigate to API Settings
1. Look at the **left sidebar**
2. Scroll down if needed
3. Find and click the **⚙️ Settings** icon (looks like a gear or cog)
4. In the settings menu that appears, click **"API"**

### 3.2 Find Your Keys
You'll see a page with lots of information. Don't be overwhelmed! You only need two things:

**Thing #1: Project URL**
- Look for a section called "Project URL" or "Config"
- You'll see a URL that looks like: `https://abcdefghijklmnop.supabase.co`
- The random letters will be different for you

**Thing #2: Project API Keys**
- Scroll down a bit to find "Project API keys"
- You'll see several keys listed
- Find the one labeled **"anon" / "public"** (they're the same thing)
- It's a very long string that starts with `eyJ`
- It looks something like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...` (continues for many characters)

### 3.3 Copy Your Keys

**⚠️ IMPORTANT**: Copy these EXACTLY - one wrong character and things won't work!

**Copy the Project URL:**
1. Find the Project URL field
2. You'll see a 📋 (clipboard) icon next to it
3. Click the clipboard icon to copy
4. Open your text editor
5. Paste it and label it: "SUPABASE_URL"

Example of what to save:
```
SUPABASE_URL: https://abcdefghijklmnop.supabase.co
```

**Copy the Anon/Public Key:**
1. Find the "anon" or "public" key
2. Click the 📋 (clipboard) icon next to it
3. In your text editor, paste it on a new line
4. Label it: "SUPABASE_ANON_KEY"

Example of what to save:
```
SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTUxMjAwMCwiZXhwIjoxOTU1MDg4MDAwfQ.abcdefgh123456789
```

### 3.4 Double-Check
Make sure you have BOTH of these saved:
- [ ] SUPABASE_URL (starts with `https://`)
- [ ] SUPABASE_ANON_KEY (starts with `eyJ`)

**💾 Save your text file!** - Give it a name like "wetoro-keys.txt"

---

## ✅ Checkpoint

At this point, you should have:
- [ ] A Supabase account
- [ ] A Wetoro project in Supabase
- [ ] Your database password saved
- [ ] Your SUPABASE_URL copied and saved
- [ ] Your SUPABASE_ANON_KEY copied and saved

---

## 🎉 Great Job!

You've successfully created your database and got your API keys! These keys are what will allow your website to save and retrieve emotional stones.

**Security Note**: 
- ✅ These keys are safe to share in your website code
- ✅ They only allow reading and adding stones (not deleting or changing)
- ❌ Don't share your database password publicly
- ❌ Don't share the "service_role" key (we're not using it)

---

## 🔍 What You Just Did

Let's review what happened:
1. You created a cloud database with Supabase (it's like renting a tiny piece of a huge computer)
2. You got the "address" of your database (SUPABASE_URL)
3. You got a "key" that lets your website access the database (SUPABASE_ANON_KEY)

These are like getting a PO Box at a post office - you now have an address and a key!

---

## 🚀 Next Steps

**👉 Next Guide**: [Setting Up the Database →](./03-DATABASE-SETUP.md)

In the next guide, you'll:
- Create the "table" where stones will be stored
- Learn what tables and columns are
- Run your first SQL command (sounds scary but it's just copy-paste!)

---

## 🆘 Troubleshooting

### "I can't find the API keys"
- Make sure you clicked Settings (⚙️) → API
- Scroll down - they're usually in the middle or bottom of the page
- Look for words like "Project API keys" or "anon" or "public"

### "My key doesn't start with eyJ"
- You might have copied a different key
- Make sure you're copying the "anon" or "public" key, not "service_role"
- Try clicking the copy icon (📋) instead of selecting and copying

### "The page looks different than described"
- Supabase sometimes updates their interface
- The keys should still be in Settings → API
- Look for anything that says "anon" or "public" key

### "I lost my keys!"
- No problem! You can always find them again
- Log into Supabase → select your project → Settings → API
- The keys never change, so you can copy them again anytime

---

**Take a break if you need one! When you're ready, continue to the next guide.** ☕
