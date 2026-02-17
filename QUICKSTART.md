# 🚀 Quick Start Guide - Angpao Tracker

## 5-Minute Setup Checklist

### Step 1: Firebase Project Setup (2 minutes)
- [ ] Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
- [ ] Click "Create Project" or select existing project
- [ ] Wait for project to initialize

### Step 2: Enable Google Authentication (1 minute)
- [ ] In Firebase Console, go **Authentication**
- [ ] Click "Get Started"
- [ ] Click "Sign-in method" tab
- [ ] Click Google (or enable it)
- [ ] Check "Enabled" toggle
- [ ] Add email (your testing email)
- [ ] Click "Save"

### Step 3: Create Firestore Database (1 minute)
- [ ] In Firebase Console, go **Firestore Database**
- [ ] Click "Create Database"
- [ ] Select "Start in Production Mode"
- [ ] Choose location (closest to you)
- [ ] Click "Create"

### Step 4: Get Firebase Config (1 minute)
- [ ] In Firebase Console, go **Project Settings** (⚙️ gear icon)
- [ ] Go to "Your apps" section
- [ ] Click on your Web app (or create one)
- [ ] Copy the Firebase config

### Step 5: Update Configuration
- [ ] Open `firebase-config.js` in the project folder
- [ ] Replace the placeholder values with your config:
  ```javascript
  const firebaseConfig = {
    apiKey: "COPY_YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
  };
  ```

### Step 6: Add Security Rules
- [ ] Go back to Firebase Console → **Firestore Database**
- [ ] Click "Rules" tab
- [ ] Delete all default text
- [ ] Copy-paste rules from `SECURITY_RULES.md`
- [ ] Click "Publish"

### Step 7: Test the App
- [ ] Open `index.html` in your browser
  - **Option A**: Double-click the file
  - **Option B**: Run a local server:
    ```
    python -m http.server 8000
    ```
    Then open `http://localhost:8000`
- [ ] Click "Sign In with Google"
- [ ] Authenticate with your Google account
- [ ] You should see the welcome message!

### Step 8: Try It Out
- [ ] Enter a year (e.g., 2026) and click "Add Year"
- [ ] Click "View" on the year
- [ ] Add a day (e.g., "Chu Yi")
- [ ] Add a house (e.g., "Grandma's House")
- [ ] Add an angpao entry ($50 from Grandma)
- [ ] Watch totals update in real-time! 🎉

---

## File Guide

| File | Purpose |
|------|---------|
| `index.html` | Main UI (open in browser) |
| `styles.css` | Festive red/gold styling |
| `firebase-config.js` | Firebase setup (UPDATE WITH YOUR CONFIG) |
| `app.js` | Application logic & calculations |
| `README.md` | Full documentation |
| `SECURITY_RULES.md` | Firestore security rules |
| `FIRESTORE_SCHEMA.md` | Database structure |
| `.env.example` | Environment variables template |

---

## Common Errors & Fixes

### ❌ "Sign-in failed"
- Check Firebase Console → Google provider is enabled
- Check `firebase-config.js` has correct values
- Check API key is valid

### ❌ "Permission denied" in console
- Apply security rules from `SECURITY_RULES.md`
- Go to Firestore Rules tab and click Publish
- Wait 10 seconds and refresh browser

### ❌ "Collection not found"
- Make sure Firestore database is created
- Check in Firebase Console → Firestore Database
- If empty, it's normal - data creates on first entry

### ❌ Chart not showing
- Make sure you have multiple years created
- Click "Refresh Chart" button
- Check browser console (F12 → Console)

---

## Next Steps

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

### Deploy to Other Services
- **Netlify**: Drag & drop the folder
- **GitHub Pages**: Push to `gh-pages` branch
- **Vercel**: Connect your GitHub repo

### Protect Your API Key
- Create `.env.local` file (NOT committed to Git)
- Add your Firebase config there
- Update `firebase-config.js` to load from `.env`

---

## Features You Can Use Right Now

✅ **Authentication**
- Sign in with Google
- Each user's data is private

✅ **Organization**
- Create years (2025, 2026, etc.)
- Create days within years
- Add house visits
- Track individual angpao entries

✅ **Real-time Calculations**
- Automatic totals per house
- Automatic totals per day
- Automatic totals per year

✅ **Visualizations**
- Year-over-year comparison chart
- See trends across multiple years

✅ **Responsive Design**
- Works on desktop, tablet, and phone!

---

## Tips for Using the App

### During Lunar New Year
📱 Open the app on your phone to track in real-time
- Add entries immediately after receiving angpao
- See your daily totals update instantly

### For Family Tracking
👨‍👩‍👧‍👦 Each family member signs in with their own Google account
- Their data is completely private
- Perfect for tracking each person's collection

### Year-over-Year Tracking
📊 Compare your collection between years
- See if you collected more this year
- Track over decades!

---

## Customization Ideas

### Change Colors
Edit `styles.css` at the top:
```css
:root {
  --primary-red: #dc143c;    /* Change this for different red */
  --gold: #ffd700;           /* Change this for different gold */
}
```

### Change Currency Symbol
Edit `app.js` - replace `$` with:
- `¥` (Chinese Yuan)
- `€` (Euro)  
- `₹` (Indian Rupee)
- Or any other symbol

### Add Day Names
Edit `index.html` input placeholders:
```html
placeholder="Day name (e.g., Chu Yi, Chu Er, First Day)"
```

---

## Important Security Note

⚠️ **NEVER commit your API keys to GitHub!**

Before pushing to GitHub:
1. Open `firebase-config.js`
2. Replace your real keys with:
   ```javascript
   apiKey: "YOUR_API_KEY_HERE",
   ```
3. Add `firebase-config.js` to `.gitignore`
4. Ask Firebase to regenerate your API key if it was exposed

---

## Getting Help

🔗 **Resources:**
- Firebase Docs: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- Browser Console: Press F12 → Console tab (for errors)

📧 **Check for errors:**
1. Open browser (F12 → Console tab)
2. Try the action again
3. Look for red error messages
4. Read the error message carefully
5. Search Google for that error

---

## Fun Ideas to Extend

After you get it working:
- 📸 Add photo uploads
- 📧 Send email receipts
- 👥 Family leaderboard
- 🎯 Angpao collection goals
- 🌙 Dark mode
- 📱 Mobile app

---

## Success!

If you can:
✅ Sign in with Google
✅ Create a year
✅ Add a day and house
✅ Add an angpao entry
✅ See totals update

**Congratulations! Your Angpao Tracker is working!** 🎉🧧

---

**Happy Lunar New Year! 恭喜发财!**

Questions? Check **README.md** for full documentation.

Last Updated: February 2026
