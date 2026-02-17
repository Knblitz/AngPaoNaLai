# 🔐 API Key & Environment Setup Guide

## Current Setup (Recommended)

Your project now has the **correct** configuration:

### File Structure
```
AngPaoNaLai/
├── firebase-config.js              ✅ Has placeholder values (SAFE to commit)
├── firebase-config.local.js        ❌ Has real credentials (in .gitignore - NOT committed)
├── .env                            ❌ Reference only (in .gitignore - NOT committed)
├── .env.example                    ✅ Template only (safe to commit)
└── .gitignore                      ✅ Prevents secrets leaking
```

---

## How It Works

### 1. **Local Development** (Your Computer)
```
You edit firebase-config.local.js with your REAL API keys
          ↓
.gitignore prevents this file from being committed
          ↓
firebase-config.js tries to import from firebase-config.local.js
          ↓
✅ App uses your real credentials locally
          ↓
✅ No credentials are pushed to GitHub
```

### 2. **GitHub Repository**
```
Only firebase-config.js exists with PLACEHOLDER values
          ↓
firebase-config.js is commited (placeholders are safe)
          ↓
firebase-config.local.js is NOT committed (in .gitignore)
          ↓
✅ Your credentials stay private
```

### 3. **Production Deployment**
```
Option A: Self-hosted (Firebase Hosting, Netlify, Vercel)
  - Upload firebase-config.local.js separately
  - Or set environment variables in platform
  
Option B: GitHub Pages
  - Either create firebase-config.local.js after cloning
  - Or use build script to inject credentials
```

---

## Setup Checklist

### ✅ What You Have (Done Correctly)

- [x] `firebase-config.local.js` created with your REAL API keys
- [x] `firebase-config.local.js` is in `.gitignore` (won't be committed)
- [x] `firebase-config.js` has placeholder values (safe to commit)
- [x] `.env` file exists with reference credentials

### ✅ Verify Security

Run these to confirm:

**1. Check .gitignore includes firebase-config.local.js**
```bash
cat .gitignore | grep "firebase-config"
# Should show: firebase-config.local.js
```

**2. Check git won't track the file**
```bash
git check-ignore firebase-config.local.js
# Should output the path (means it's ignored)
```

**3. Check app loads correctly**
- Open browser console (F12)
- Look for message: ✅ "Using local Firebase configuration" or ⚠️ "firebase-config.local.js not found"

---

## If You Already Committed Credentials

If you accidentally committed real credentials, fix it:

```bash
# 1. Add file to .gitignore (done)
echo "firebase-config.local.js" >> .gitignore

# 2. Remove from git history (one-time)
git rm --cached firebase-config.local.js
git commit -m "Remove firebase-config.local.js from tracking"

# 3. Regenerate Firebase API key (⚠️ Important!)
#    - Go to Firebase Console
#    - Project Settings → Service Accounts
#    - Generate new API key
#    - Update your local firebase-config.local.js
#    - The old key is now invalidated
```

---

## File Purpose Reference

| File | Location | Contains | Commits | Purpose |
|------|----------|----------|---------|---------|
| `firebase-config.js` | Repo | Placeholders | ✅ YES | Entry point (safe) |
| `firebase-config.local.js` | Local Only | **Real Keys** | ❌ NO | Your credentials |
| `.env` | Local Only | Reference | ❌ NO | For build tools |
| `.env.example` | Repo | Template | ✅ YES | Shows format |

---

## For Different Deployment Scenarios

### Scenario 1: Local Development Only
```
✅ You have firebase-config.local.js with real keys
✅ Only you can access it (in .gitignore)
✅ Works perfect for testing
```

### Scenario 2: GitHub Pages / Static Hosting
```
Option A: Manual setup on each clone
  1. Clone repo: git clone ...
  2. Create firebase-config.local.js with your keys
  3. Run: open index.html

Option B: GitHub Secrets (for CI/CD)
  1. Add Firebase keys to GitHub Secrets
  2. Create build script that generates firebase-config.local.js
  3. Commit build script, not the generated file
```

### Scenario 3: Firebase Hosting / Netlify / Vercel
```
1. Upload code without firebase-config.local.js
2. In platform settings, add environment variables:
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_PROJECT_ID
   - ... (other keys)
3. Build script reads environment and creates config file
4. App uses generated config at runtime
```

---

## Verification Checklist

- [ ] `firebase-config.local.js` has your REAL API keys
- [ ] `firebase-config.local.js` is in `.gitignore`
- [ ] `firebase-config.js` has placeholder values
- [ ] App loads with message: "✅ Using local Firebase configuration"
- [ ] Opening index.html shows no errors in console
- [ ] Google Sign-in button appears and works
- [ ] You can create years and add angpao entries

---

## Summary

| Aspect | Status | What to Do |
|--------|--------|-----------|
| **Local Credentials** | ✅ Protected | Keep in `firebase-config.local.js` only |
| **Version Control** | ✅ Safe | Placeholders in `firebase-config.js` |
| **GitHub Repository** | ✅ Secure | Credentials never synced |
| **Firestore Rules** | ✅ Secure | Enforce user-specific access |
| **.gitignore** | ✅ Configured | Prevents secret leaks |

**Result: Your app is secure! 🔒**

---

## Need to Update Credentials?

If you need to change your Firebase keys:

1. Update `firebase-config.local.js` with new keys
2. That's it! The app will automatically use them
3. GitHub repository is never affected

---

## Questions?

- **Keys showing in browser?** → Normal for Firebase client-side apps. Security enforced by Firestore Rules.
- **"Placeholder configuration" message?** → Create `firebase-config.local.js` file
- **Error when pushing to GitHub?** → Check `.gitignore` includes `firebase-config.local.js`

---

**Last Updated**: February 17, 2026  
**Status**: ✅ Credentials properly configured and protected
