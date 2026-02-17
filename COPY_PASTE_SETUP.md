# 🚀 Quick Copy-Paste: Create Repository

## For PowerShell (Windows)

Copy and paste this entire block into PowerShell:

```powershell
cd c:\Users\khent\Documents\Code\Knblitz.github.io\AngPaoNaLai
git init
git add .
git commit -m "Initial commit: Angpao Tracker - Firebase, Google Auth, real-time tracking"
git status
```

Then:
1. Go to GitHub.com and create a new repository named `AngPaoNaLai`
2. Copy the commands GitHub gives you (will look like below)
3. Paste into PowerShell:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/AngPaoNaLai.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username!

---

## One Command at a Time (If Above Doesn't Work)

### Step 1: Navigate to folder
```powershell
cd c:\Users\khent\Documents\Code\Knblitz.github.io\AngPaoNaLai
```
Press Enter

### Step 2: Initialize git repo
```powershell
git init
```
Should see: `Initialized empty Git repository in c:\Users\khent...`

### Step 3: Add all files
```powershell
git add .
```
No output = success

### Step 4: Create first commit
```powershell
git commit -m "Initial commit: Angpao Tracker - Firebase, Google Auth, real-time tracking"
```
Should see file counts and changes

### Step 5: Check what will upload
```powershell
git status
```
Should see `On branch master` or `On branch main`

---

## GitHub Setup Instructions

**⚠️ Skip to Step 6 if you already have a GitHub account**

### Step 1-5: GitHub Account
- Go to [github.com](https://github.com)
- Sign up for free account
- Verify email

### Step 6: Create New Repository
- Click **+** icon (top right) → **New repository**
- **Repository name**: `AngPaoNaLai`
- **Description**: `🧧 Track red envelope money during Lunar New Year`
- Choose: **Public** or **Private**
- **DON'T** check any boxes (no README, .gitignore, or license)
- Click **Create repository**

### Step 7: Copy Commands from GitHub
GitHub will show you something like:
```
git remote add origin https://github.com/YOUR_USERNAME/AngPaoNaLai.git
git branch -M main
git push -u origin main
```

From the "...or push an existing repository" section

### Step 8: Replace Username and Run
Replace `YOUR_USERNAME` with your actual GitHub username, then copy-paste into PowerShell:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/AngPaoNaLai.git
git branch -M main
git push -u origin main
```

**It may ask for your GitHub password** - enter it (you won't see characters)

### Step 9: You're Done! 🎉
Go to `https://github.com/YOUR_USERNAME/AngPaoNaLai` in browser
Should see all your files!

---

## Troubleshooting

### ❓ "Git is not recognized"
- Install Git: https://git-scm.com/download/win
- Restart PowerShell after install
- Try again

### ❓ "No such file or directory"
- Make sure path is correct:
  ```powershell
  ls c:\Users\khent\Documents\Code\Knblitz.github.io\AngPaoNaLai
  ```
  Should show your project files

### ❓ "remote origin already exists"
```powershell
git remote remove origin
# Then run the git remote add command again
```

### ❓ "fatal: not a git repository"
Make sure you ran:
```powershell
git init
```

### ❓ "Authentication failed"
- Make sure you typed your GitHub username correctly
- Double-check password
- Or use SSH key method (see CREATE_REPO.md)

---

## What Gets Uploaded

✅ All your `.html`, `.js`, `.css`, `.md` files
✅ `.gitignore` (keeps credentials safe)
❌ `firebase-config.local.js` (your real keys - NOT uploaded)
❌ `.env` (reference only - NOT uploaded)

**Result**: Your code is on GitHub, credentials are safe! 🔒

---

## Next: Clone on Another Computer

After pushing, you can clone on any computer:

```powershell
git clone https://github.com/YOUR_USERNAME/AngPaoNaLai.git
cd AngPaoNaLai
```

Then create your own `firebase-config.local.js` with your credentials.

---

## Continue Development

After setting up repo, any time you want to save changes:

```powershell
git add .
git commit -m "Description of what you changed"
git push
```

**Done!** 🚀
