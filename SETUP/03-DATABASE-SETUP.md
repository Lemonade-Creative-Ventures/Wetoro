# 3️⃣ Setting Up the Database

## 🎯 What We'll Do

In this guide, you'll:
1. Learn what a database table is (in simple terms)
2. Create the "stones" table where emotional stones will be saved
3. Set up security rules so anyone can add stones
4. Test that it works

**Time needed: ~10 minutes**

---

## 📋 What is a Database Table?

💡 **Plain English**: A database table is like a spreadsheet (think Excel or Google Sheets). It has:
- **Columns**: Categories of information (like "Name", "Age", "Email" in a contact list)
- **Rows**: Individual entries (each person in the contact list)

For Wetoro, you'll create a table called "stones" with columns like:
- `emotion_symbol`: The shape and color of the stone
- `label`: Optional text label
- `released_at`: When the stone was released

---

## Step 1: Open the SQL Editor

### 1.1 What is SQL?
💡 **Plain English**: SQL (pronounced "sequel") is the language that databases understand. It's like English, but for databases. Don't worry - you won't need to write any SQL! We'll just copy and paste a script that's already written for you.

### 1.2 Navigate to SQL Editor
1. In your Supabase project dashboard, look at the **left sidebar**
2. Find and click **"SQL Editor"**
3. You'll see a page with a text box - this is where you can type or paste SQL commands

---

## Step 2: Get the Database Setup Script

### 2.1 Find the Schema File
The setup script is already written and saved in your Wetoro repository. Here's where to find it:

**Option A: If you have the repository on your computer**
1. Open your file explorer (Finder on Mac, File Explorer on Windows)
2. Navigate to your Wetoro folder
3. Go into the `api` folder
4. Find the file called `schema.sql`
5. Open it with any text editor (Notepad, TextEdit, VS Code, etc.)
6. Select all the text (Ctrl+A on Windows, Cmd+A on Mac)
7. Copy it (Ctrl+C on Windows, Cmd+C on Mac)

**Option B: If you're viewing on GitHub**
1. Go to your Wetoro repository on GitHub
2. Click on the `api` folder
3. Click on `schema.sql`
4. Click the "Copy raw contents" button (📋 icon in the top-right of the file view)
5. OR select all text and copy it

### 2.2 What's in the Script?
Here's what the script does (you don't need to understand all of it):
- Creates a table called "stones"
- Sets up columns for emotion, label, and date
- Creates security rules so anyone can add stones but not delete them
- Creates an index to make searching faster

---

## Step 3: Run the Setup Script

### 3.1 Paste the Script
1. Go back to your Supabase SQL Editor
2. Click in the big text box
3. Paste the script you copied (Ctrl+V on Windows, Cmd+V on Mac)
4. You should see several lines of SQL code appear

### 3.2 Run the Script
1. Look for the **"Run"** button (usually in the top-right corner)
   - OR press **Ctrl+Enter** (Windows) or **Cmd+Enter** (Mac)
2. Click the Run button
3. **⏰ Wait a moment** - usually takes just a second or two

### 3.3 Check for Success
After running, you should see:
- ✅ A green message saying **"Success. No rows returned"** or **"Success"**
- OR a checkmark icon
- This is GOOD! It means the table was created successfully.

**If you see an error:**
- See the Troubleshooting section at the bottom of this guide

---

## Step 4: Verify the Table Was Created

Let's make sure the table actually exists!

### 4.1 Open Table Editor
1. In the **left sidebar**, find and click **"Table Editor"**
2. You should see a list of tables (might just be one right now)
3. Look for a table called **"stones"**
4. Click on it

### 4.2 Check the Table Structure
You should see:
- **Columns**: `id`, `emotion_symbol`, `label`, `released_at`, `created_at`
- **No data yet** (that's normal - you haven't released any stones!)
- Empty table with column headers

If you see this, congratulations! Your database is set up correctly! 🎉

---

## Step 5: Understand What You Created

Let's look at what each column means:

| Column | Type | What It Stores |
|--------|------|----------------|
| `id` | UUID | Unique ID for each stone (automatically generated) |
| `emotion_symbol` | Text | The shape and color info (e.g., "circle-joyful") |
| `label` | Text | Optional label (max 80 characters) |
| `released_at` | Timestamp | Date and time the stone was released |
| `created_at` | Timestamp | When the database entry was created |

💡 **Plain English**: Each row in this table will represent one emotional stone that someone released. The table automatically generates an ID and tracks when it was created. The website sends the emotion symbol, optional label, and release date.

---

## Step 6: Check Security Settings (Optional but Recommended)

This ensures anyone can add stones but not delete them.

### 6.1 Open RLS Settings
1. While viewing the "stones" table in Table Editor
2. Look for a shield icon (🛡️) or "RLS" indicator
3. OR go to **Authentication** → **Policies** in the left sidebar

### 6.2 Verify Policies
You should see:
- ✅ Row Level Security (RLS) is **enabled**
- ✅ A policy allowing **INSERT** (adding new stones)
- ✅ A policy allowing **SELECT** (reading stones)
- ❌ No policy for UPDATE or DELETE (can't modify or remove stones)

This is perfect! It means:
- ✅ Anyone can release a stone
- ✅ Anyone can see all stones
- ❌ No one can change or delete stones (preserves the clearing's integrity)

💡 **Plain English**: Think of it like a public bulletin board where anyone can post a note and everyone can read notes, but no one can remove or change other people's notes.

---

## ✅ Checkpoint

At this point, you should have:
- [ ] Successfully run the schema.sql script
- [ ] Verified the "stones" table exists
- [ ] Confirmed the table has the correct columns
- [ ] (Optional) Checked that security policies are in place

---

## 🎉 Excellent Work!

Your database is now ready to store emotional stones! Here's what you accomplished:
1. ✅ Created a database table with the right structure
2. ✅ Set up security rules to protect the data
3. ✅ Prepared the backend for your website

---

## 🔍 What You Just Did

To recap:
1. You ran a SQL script (a set of commands) that created a table
2. The table is like a special spreadsheet that lives in the cloud
3. Your website will send data to this table whenever someone releases a stone
4. The security rules ensure the data can't be tampered with

---

## 🚀 Next Steps

**👉 Next Guide**: [Deploying Your API Server →](./04-API-DEPLOYMENT.md)

In the next guide, you'll:
- Set up the API server (the messenger between your website and database)
- Deploy it to Vercel (put it online)
- Connect it to your database using the keys you saved

---

## 🆘 Troubleshooting

### "Error: relation 'stones' already exists"
- The table was already created!
- This can happen if you ran the script twice
- **Solution**: You're actually done! The table exists. Move to the next guide.

### "Error: permission denied"
- Make sure you're logged into the correct Supabase account
- Try refreshing the page and logging in again

### "Error: syntax error at or near..."
- The SQL script might not have been copied correctly
- **Solution**: 
  1. Clear the SQL Editor
  2. Go back and copy the schema.sql file again
  3. Make sure you copy the ENTIRE file (scroll to the end)
  4. Paste and run again

### "I don't see the 'stones' table in Table Editor"
- Try refreshing the page (F5 or Cmd+R)
- Make sure you're looking in the correct project
- Check if you saw a success message when running the script

### "The SQL Editor looks different"
- Supabase updates their interface occasionally
- Look for anything that says "SQL" or "Query Editor"
- The functionality is the same even if it looks a bit different

### "What if I made a mistake?"
- No problem! You can delete the table and start over:
  1. Go to Table Editor
  2. Find the "stones" table
  3. Click the "..." menu
  4. Select "Delete table"
  5. Run the schema.sql script again

---

## 📚 Learn More (Optional)

Want to understand SQL better?
- **SQL in 10 Minutes**: https://www.youtube.com/watch?v=27axs9dO7AE
- **What is PostgreSQL**: https://www.youtube.com/watch?v=qw--VYLpxG4

You don't need to know SQL to use Wetoro, but it's interesting if you're curious!

---

**Take a break if you need one! When ready, move on to deploying the API server.** ☕
