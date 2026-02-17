# 📦 Creating a Git Repository for Angpao Tracker

## Quick Start: Initialize Repository

### Step 1: Initialize Git in Your Project Folder
```bash
cd c:\Users\khent\Documents\Code\Knblitz.github.io\AngPaoNaLai
git init
```

### Step 2: Check Status
```bash
git status
```
You should see all files listed as "Untracked files"

### Step 3: Add All Files to Git
```bash
git add .
```

This stages all files EXCEPT those in `.gitignore` (which already includes `.env` and `firebase-config.local.js`)

### Step 4: Create First Commit
```bash
git commit -m "Initial commit: Angpao Tracker with Firebase, Google Auth, and real-time calculations"
```

### Step 5: Verify Commit
```bash
git log
```
Should show your first commit

---

## Part 2: Push to GitHub

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click **"+"** in top right → **"New repository"**
3. Fill in:
   - **Repository name**: `AngPaoNaLai` (or your choice)
   - **Description**: `🧧 Track red envelope money during Lunar New Year`
   - **Visibility**: Choose **Public** (if you want it visible) or **Private**
   - **Don't initialize** with README, .gitignore, or license (you already have these)
4. Click **"Create repository"**

### Step 2: Connect Local Repo to GitHub
After creating the repo, GitHub shows commands. Run in PowerShell:

```bash
git remote add origin https://github.com/YOUR_USERNAME/AngPaoNaLai.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username!

### Step 3: Verify Push
```bash
git log --oneline
```
Should show your commit

Go to your GitHub repo URL - you should see all your files! 🎉

---

## Complete Step-by-Step Commands

### For Windows PowerShell:

```powershell
# Navigate to project
cd c:\Users\khent\Documents\Code\Knblitz.github.io\AngPaoNaLai

# Initialize git
git init

# Check what will be added
git status

# Add all files (respects .gitignore)
git add .

# Create commit
git commit -m "Initial commit: Angpao Tracker - Firebase, Google Auth, real-time tracking"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/AngPaoNaLai.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Verify Credentials Won't Leak

Before pushing, verify:

```bash
# Check if sensitive files are excluded
git check-ignore firebase-config.local.js
git check-ignore .env

# Both should output their paths (meaning they're ignored)
```

If they show paths = ✅ **Protected**
If they show nothing = ⚠️ **Problem - update .gitignore**

---

## What Gets Committed ✅

```
index.html ✅
styles.css ✅
app.js ✅
firebase-config.js ✅ (has placeholders only)
.gitignore ✅
.env.example ✅ (template only)
README.md ✅
SECURITY_RULES.md ✅
AUTHENTICATION.md ✅
QUICKSTART.md ✅
SETUP_CREDENTIALS.md ✅
SETUP_COMPLETE.md ✅
FIRESTORE_SCHEMA.md ✅
```

## What Does NOT Get Committed ❌

```
firebase-config.local.js ❌ (in .gitignore - has real credentials)
.env ❌ (in .gitignore - reference only)
node_modules/ ❌ (if you add)
.DS_Store, Thumbs.db ❌ (system files)
```

---

## Useful Git Commands After Setup

### Check status
```bash
git status
```

### See commit history
```bash
git log --oneline
```

### Make a new commit after changes
```bash
git add .
git commit -m "Description of changes"
git push
```

### View remote
```bash
git remote -v
```

---

## Two Options for GitHub

### Option 1: Public Repository (Recommended)
- Anyone can see your code
- ✅ Great for portfolio
- ✅ Get feedback from others
- ✅ Contribute to community
- ⚠️ Make sure no secrets are exposed

### Option 2: Private Repository
- Only you can see it
- ✅ Full privacy
- ⚠️ No portfolio showcase unless you share link
- GitHub Free tier allows unlimited private repos

---

## Setting Up SSH (Optional - Better Security)

Instead of HTTPS with passwords, use SSH:

### 1. Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
Press Enter to use default location

### 2. Add to SSH Agent
```bash
eval $(ssh-agent -s)
ssh-add ~/.ssh/id_ed25519
```

### 3. Copy SSH Public Key
```bash
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

### 4. Add to GitHub
- Go to GitHub → Settings → SSH and GPG keys
- Click "New SSH key"
- Paste the key
- Click "Add SSH key"

### 5. Use SSH for Remote
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/AngPaoNaLai.git
git push -u origin main
```

---

## If You Get Stuck

### Error: "remote origin already exists"
```bash
git remote remove origin
# Then run: git remote add origin https://...
```

### Error: "fatal: not a git repository"
```bash
git init  # Initialize first
```

### Error: "Permission denied"
Make sure you're using correct GitHub URL and have credentials saved

### Error: "Updates were rejected"
Pull changes first:
```bash
git pull origin main
git push
```

---

## GitHub URL Options

### HTTPS (easier, but needs credentials each time)
```
https://github.com/YOUR_USERNAME/AngPaoNaLai.git
```

### SSH (secure, but needs key setup)
```
git@github.com:YOUR_USERNAME/AngPaoNaLai.git
```

---

## After Pushing to GitHub

### Share Your Repository
1. Copy your repo URL: `https://github.com/YOUR_USERNAME/AngPaoNaLai`
2. Share it with others
3. They can clone it:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AngPaoNaLai.git
   ```

### Update Your Project on Different Computer
```bash
git clone https://github.com/YOUR_USERNAME/AngPaoNaLai.git
cd AngPaoNaLai
# Add your firebase-config.local.js
# Open index.html
```

### Continue Development
```bash
git add .
git commit -m "Feature: Added [description]"
git push
```

---

## Summary

| Step | Command |
|------|---------|
| 1. Initialize | `git init` |
| 2. Add files | `git add .` |
| 3. First commit | `git commit -m "message"` |
| 4. Add GitHub remote | `git remote add origin https://...` |
| 5. Set main branch | `git branch -M main` |
| 6. Push to GitHub | `git push -u origin main` |

---

## Checklist Before Pushing

- [ ] `.gitignore` includes `firebase-config.local.js`
- [ ] `.gitignore` includes `.env`
- [ ] `firebase-config.js` has placeholder values (no real keys)
- [ ] No `node_modules/` folder (unless intentional)
- [ ] All markdown docs included
- [ ] README.md explains the project

Then push with confidence! 🚀

---

**Questions?** See full setup guide in `SETUP_CREDENTIALS.md`
