# 1️⃣ Overview & Prerequisites

## 🎯 What is Wetoro?

Wetoro is a web application where people can:
1. Write about their feelings (privately)
2. Choose an emotional "stone" (a shape and color)
3. Release it into a shared "clearing" where everyone can see it
4. The actual text you write is **never saved** - only the emotion symbol

Think of it like a collective emotional release board where everyone can see the emotions being released, but not the personal details.

---

## 🏗️ How Wetoro Works (Simple Explanation)

### The Website (Frontend)
This is what people see and interact with in their web browser. It's made of:
- **HTML** - The structure (like the bones of a house)
- **CSS** - The styling (like the paint and decorations)
- **JavaScript** - The interactive parts (like light switches and doors)

### The Database
This is where the emotional stones are stored. Think of it like a filing cabinet where each drawer holds information about a stone (its color, shape, when it was released, and optional label).

### The API Server
This is the "messenger" that helps the website talk to the database. 
- When someone releases a stone, the website tells the API
- The API saves it in the database
- When someone opens the clearing, the API gets all the stones from the database and sends them to the website

💡 **Plain English**: The API is like a waiter in a restaurant - the website (customer) asks for something, the waiter goes to the kitchen (database), and brings back what was requested.

---

## 📝 What You'll Need Before Starting

### Required Accounts (All FREE)

1. **GitHub Account** (you might already have this!)
   - Website: https://github.com
   - Why: To store your code and deploy to services
   - Sign up with: Email or existing Google account

2. **Supabase Account** (for the database)
   - Website: https://supabase.com
   - Why: To store the emotional stones
   - Sign up with: GitHub account (easiest)

3. **Vercel Account** (for the API server)
   - Website: https://vercel.com
   - Why: To run the code that connects the website to the database
   - Sign up with: GitHub account (easiest)

4. **Netlify Account** (for the website)
   - Website: https://netlify.com
   - Why: To host your website so people can visit it
   - Sign up with: GitHub account (easiest)

### Optional But Helpful

- **A text editor** - To save important information as you go
  - Windows: Notepad
  - Mac: TextEdit
  - Or use Google Docs, Notes app, etc.

- **A second browser or incognito window** - For testing
  - To make sure different users can see each other's stones

---

## ⏱️ How Long Will This Take?

| Step | Time |
|------|------|
| Creating accounts | 10 minutes |
| Setting up database | 10 minutes |
| Deploying API server | 15 minutes |
| Connecting everything | 5 minutes |
| Deploying website | 10 minutes |
| Testing | 10 minutes |
| **TOTAL** | **~1 hour** |

💡 **Tip**: You can do this in multiple sessions! Just save your progress and come back later.

---

## 💰 Cost Breakdown

| Service | Cost | What You Get |
|---------|------|--------------|
| Supabase | **FREE** | 500MB database, 2GB bandwidth |
| Vercel | **FREE** | Unlimited deployments, 100GB bandwidth |
| Netlify | **FREE** | Unlimited sites, 100GB bandwidth |
| **TOTAL** | **$0/month** | More than enough for thousands of users |

All these services have generous free tiers that are perfect for Wetoro. You won't need to pay anything unless you have massive traffic (tens of thousands of users).

---

## 🛠️ What You'll Be Doing

Here's the big picture of what you'll accomplish:

```
┌─────────────────────────────────────────────────┐
│  Step 1: Create Accounts                        │
│  ✓ GitHub, Supabase, Vercel, Netlify           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 2: Set Up Database                        │
│  ✓ Create Supabase project                      │
│  ✓ Run setup script to create tables            │
│  ✓ Get your API keys                            │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 3: Deploy API Server                      │
│  ✓ Connect GitHub to Vercel                     │
│  ✓ Add your database keys                       │
│  ✓ Deploy the API code                          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 4: Update Website Code                    │
│  ✓ Add your API URL to the code                 │
│  ✓ Commit changes to GitHub                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 5: Deploy Website                         │
│  ✓ Connect GitHub to Netlify                    │
│  ✓ Deploy your website                          │
│  ✓ Get your website URL                         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 6: Test Everything!                       │
│  ✓ Release a stone                              │
│  ✓ Check it appears in the clearing             │
│  ✓ Test with multiple users                     │
└─────────────────────────────────────────────────┘
```

---

## 🧠 Key Concepts to Understand

### Environment Variables
Think of these like secret passwords that your API server uses to connect to your database. You'll be copying and pasting two important values:
- `SUPABASE_URL` - The address of your database
- `SUPABASE_ANON_KEY` - The password to access it

### API URL
This is the web address where your API server lives. It looks like: `https://something.vercel.app`

### Deployment
This means "putting your code on the internet so it works." When you "deploy," you're publishing your website or API.

### Repository (Repo)
This is your project folder on GitHub. It contains all your code files.

---

## ✅ Checklist Before Starting

Make sure you have:
- [ ] A computer with internet access
- [ ] A web browser (Chrome, Firefox, Safari, Edge - any modern browser)
- [ ] An email address
- [ ] A text editor or note-taking app (to save important information)
- [ ] About 1 hour of uninterrupted time (or break it into 15-minute chunks)

---

## 🎓 What You'll Learn

Even though these guides are made for non-coders, you'll learn some valuable skills:
- How databases work
- How web applications connect to databases
- How to deploy applications to the internet
- How to use professional developer tools (GitHub, Vercel, Supabase)

These skills are **highly valuable** in today's world and used by professional developers every day!

---

## 🆘 Don't Panic!

**It's okay if:**
- You don't understand every technical term
- You need to read something twice
- You need to take breaks
- You make mistakes (most are easy to fix!)

**Remember:**
- Follow the steps exactly as written
- Don't skip steps (even if they seem obvious)
- Copy and paste carefully (don't type long keys manually)
- Save important information as you go

---

## 🚀 Ready to Continue?

Great! Now you understand what we're building and why.

**👉 Next Step**: [Getting Your API Keys →](./02-GETTING-KEYS.md)

---

## 📚 Additional Resources

- **What is an API?**: https://www.youtube.com/watch?v=s7wmiS2mSXY (3-minute video)
- **What is a database?**: https://www.youtube.com/watch?v=Tk1t3WKK-ZY (5-minute video)
- **What is GitHub?**: https://www.youtube.com/watch?v=w3jLJU7DT5E (8-minute video)

You don't need to watch these to complete the setup, but they can help you understand what you're doing!
