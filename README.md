# 🧧 Angpao Tracker

A festive web application to track red envelope (Angpao) money received during Lunar New Year celebrations. Built with Firebase for authentication and real-time data storage.

**恭喜发财! - Wishing You Prosperity!**

## Features

✨ **Authentication**
- Google Sign-in integration
- User-specific data isolation with Firebase Authentication
- Secure data storage using user UIDs

📅 **Hierarchical Organization**
- Create multiple Year folders
- Organize Days within each year (Chu Yi, Chu Er, etc.)
- Add House Visits for each day
- Track individual Angpao entries within each house visit

💰 **Entry Management**
- Add Angpao entries with amount and description
- Real-time total calculations at each level:
  - Total per House Visit
  - Total per Day
  - Total per Year

📊 **Data Visualization**
- Year-over-year comparison line chart
- Visual tracking of Angpao trends across years

🎨 **Festive UI**
- Red and gold color scheme
- Responsive design (works on desktop, tablet, mobile)
- Smooth animations and interactions

## Project Structure

```
AngPaoNaLai/
├── index.html              # Main HTML file with UI
├── styles.css              # Festive red/gold styling
├── firebase-config.js      # Firebase initialization
├── app.js                  # Main application logic
├── FIRESTORE_SCHEMA.md     # Database structure documentation
├── SECURITY_RULES.md       # Firestore security rules
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable Google Authentication:
   - Go to **Authentication → Sign-in method**
   - Enable **Google** provider
4. Create a Firestore Database:
   - Go to **Firestore Database**
   - Create in production mode
   - Set your location and security rules (see below)

### 2. Get Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Click **Your apps** and select or create a Web app
3. Copy the Firebase config object
4. Open `firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Deploy Security Rules

Copy the security rules from `SECURITY_RULES.md` and paste them into your Firestore Rules tab:

1. Go to **Firestore Database → Rules**
2. Replace the default rules with the rules from `SECURITY_RULES.md`
3. Click **Publish**

### 4. Run Locally

Simply open `index.html` in a browser. No build tools needed!

**Or** run a local server:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server installed)
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## Firestore Data Schema

```
users/{userId}/
├── metadata (document with user info)
└── years/{yearId}/
    ├── year (number)
    ├── totalAmount (number - calculated)
    └── days/{dayId}/
        ├── name (string)
        ├── totalAmount (calculated)
        └── houseVisits/{visitId}/
            ├── name (string)
            ├── totalAmount (calculated)
            └── entries/{entryId}/
                ├── amount (number)
                ├── description (string)
                └── createdAt (timestamp)
```

See **FIRESTORE_SCHEMA.md** for detailed documentation.

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

**Key Security Features:**
- ✅ Only authenticated users can access data
- ✅ Users can only access their own data (UID-based isolation)
- ✅ All subcollections inherit parent document permissions
- ✅ Denies access to everything by default (principle of least privilege)

## Usage Guide

### 1. Sign In
- Click "Sign In with Google"
- Authenticate with your Google account
- Your data will be securely stored under your user UID

### 2. Create a Year
- Enter a year (e.g., 2026)
- Click "Add Year"
- Your year appears in the list with a total

### 3. Add Days
- Click "View" on a year
- Enter day names (e.g., "Chu Yi", "First Day", "Monday")
- Click "Add Day"

### 4. Add House Visits
- Click "View Details" on a day
- Enter house name (e.g., "Grandma's House")
- Click "Add House"

### 5. Add Angpao Entries
- Click "View Details" on a house visit
- Enter amount and description (who gave it)
- Click "Add Entry"
- Watch totals update automatically!

### 6. View Year-Over-Year Comparison
- Scroll to the analytics section
- See a line chart comparing your Angpao collection across years
- Click "Refresh Chart" to update

## Environment Variables (for Production)

If deploying to a service like Vercel, Netlify, or Firebase Hosting:

1. Create a `.env.local` file (not committed to Git):
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other variables
```

2. Or set environment variables in your hosting platform's settings

3. **Never commit your real API keys to GitHub!**

## Technologies Used

- **Firebase Authentication**: Google Sign-in
- **Cloud Firestore**: Real-time database with subcollections
- **Chart.js**: Year-over-year comparison visualization
- **HTML5/CSS3**: Responsive UI
- **JavaScript (ES Modules)**: Clean, modular code

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors
Edit `:root` variables in `styles.css`:
```css
:root {
  --primary-red: #dc143c;
  --gold: #ffd700;
  /* ... */
}
```

### Day Names
Add common Lunar New Year day names in input placeholders:
- 初一 (Chu Yi) - First day
- 初二 (Chu Er) - Second day
- 初三 (Chu San) - Third day
- 初四 (Chu Si) - Fourth day
- etc.

### Currency
Currently uses USD ($). To change:
1. Edit the `entries` collection to include a `currency` field
2. Update calculation logic in `app.js` if needed
3. Update display formatting

## Troubleshooting

**Q: "Sign in failed" error**
- A: Check that Google authentication is enabled in Firebase Console
- A: Verify your API key is correct in `firebase-config.js`

**Q: Data not saving**
- A: Check Firestore security rules are deployed
- A: Verify you're signed in
- A: Check browser console for errors (F12 → Console tab)

**Q: Chart not displaying**
- A: Ensure you have data for multiple years
- A: Click "Refresh Chart" button
- A: Check browser console for Chart.js errors

**Q: "Permission denied" errors**
- A: Your security rules may be too restrictive
- A: Copy rules from `SECURITY_RULES.md` again
- A: Make sure you're signed in with the correct account

## Tips

💡 **Backup Your Data**
- Export your Firestore data periodically
- In Firebase Console: Firestore → ⋮ → Export

💡 **Mobile-Friendly**
- The app works great on phones
- Use it during Lunar New Year to track in real-time!

💡 **Multiple Users**
- Each person who signs in with their Google account gets their own data space
- Perfect for family tracking!

## Future Enhancements

- 📱 Mobile app (React Native)
- 📧 Email receipts / summaries
- 👥 Family sharing features
- 💳 Support for different currencies
- 🎯 Angpao goals tracking
- 📸 Photo uploads for memories
- 🌙 Dark mode

## License

MIT License - Feel free to use and modify!

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Firebase documentation: https://firebase.google.com/docs
3. Check browser console for error messages

---

**恭祝发财! Happy Lunar New Year! 🧧🎊**

Made with ❤️ for celebrating the festive season.
