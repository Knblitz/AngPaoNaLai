# Firestore Security Rules for Angpao Tracker

## Rules

Copy and paste the following rules into your Firebase Firestore Rules section:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // DENY ALL BY DEFAULT (Principle of Least Privilege)
    match /{document=**} {
      allow read, write: if false;
    }
    
    // USER DATA - Only the authenticated user can access their own data
    match /users/{userId} {
      // User can read and write to their own user document
      allow read, write: if request.auth.uid == userId;
      
      // User can read and write to all their subcollections
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

## How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database**
4. Click on **Rules** tab
5. Delete the default rules
6. Paste the rules above
7. Click **Publish**

## Security Features Explained

### 1. Default Deny Rule
```javascript
match /{document=**} {
  allow read, write: if false;
}
```
- Denies access to ALL documents by default
- Follows the "fail-secure" principle
- Only explicitly allowed access is granted

### 2. User Data Access Control
```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```
- Each user can only access their OWN user document
- Compares the document path `userId` with the authenticated user's `uid`
- Prevents users from reading/writing other users' data

### 3. Subcollection Inheritance
```javascript
match /{document=**} {
  allow read, write: if request.auth.uid == userId;
}
```
- All nested subcollections (years, days, houses, entries) inherit permissions
- A user can access all data under `/users/{theirUID}/...`
- Wildcard `{document=**}` matches nested paths recursively

## What This Protects Against

✅ **Unauthorized Access**
- Users cannot read other users' Angpao data
- Prevents data leaks

✅ **Unauthorized Writes**
- Users cannot modify other users' data
- Prevents tampering with records

✅ **Privilege Escalation**
- Users cannot access admin-only data
- Clear separation between user roles

✅ **Accidental Overwrites**
- Only authenticated, authorized users can modify documents
- Prevents accidental data loss from unauthenticated requests

## Advanced Rules (Optional)

### If You Want Additional Features:

#### 1. Create Timestamps Automatically
```javascript
match /users/{userId}/years/{yearId} {
  allow create: if request.auth.uid == userId && 
                   request.resource.data.createdAt == request.time;
}
```

#### 2. Prevent Modification of Creation Date
```javascript
match /users/{userId} {
  allow update: if request.resource.data.createdAt == resource.data.createdAt;
}
```

#### 3. Rate Limiting (Premium Feature)
```javascript
match /users/{userId} {
  allow write: if request.auth.uid == userId &&
                  request.time > resource.data.lastWrite.toMillis() + 1000;
}
```

## Testing Rules in Firebase Emulator

To test rules locally before deploying:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase emulator
firebase init emulator

# Start emulator
firebase emulators:start

# Run tests
firebase test firestore --rules-file firestore.rules
```

## Monitoring & Debugging

### In Firebase Console:

1. **Usage Dashboard**
   - Monitor read/write operations
   - Track Firestore costs

2. **Audit Logs**
   - View authentication events
   - Track security rule triggers

3. **Error Messages**
   - Browser console shows permission denied errors
   - Check Firebase Cloud Logging for details

## Common Issues & Solutions

### Issue: "Permission denied" errors
**Solution:**
- Verify user is authenticated: `auth.currentUser` should exist
- Check rule logic: `request.auth.uid == userId`
- Ensure `userId` in path matches `auth.currentUser.uid`

### Issue: Rules not updating
**Solution:**
- Wait 5-10 seconds for rules to propagate
- Clear browser cache (Ctrl+Shift+Delete)
- Try in incognito window

### Issue: Can create but not read/update
**Solution:**
- Add both `allow read` and `allow write` for operations you need
- Remember: `write` includes create, update, delete

## Best Practices

✅ **DO:**
- Use `== request.auth.uid` for user-specific data
- Use `request.auth != null` to verify authentication
- Test rules before deploying
- Use wildcards `{document=**}` for recursive subcollections
- Start restrictive, add permissions as needed
- Document why each rule exists

❌ **DON'T:**
- Use `allow read, write: if true;` (Security Risk!)
- Rely only on frontend validation (security theater)
- Store sensitive data without encryption
- Mix admin and user data in same collection
- Change rules frequently without testing

## Rule Testing Examples

### Test: User can read own data
```javascript
// Should PASS
path: /users/user123/metadata
auth.uid: user123

// Should FAIL
path: /users/user456/metadata
auth.uid: user123
```

### Test: User can write to subcollections
```javascript
// Should PASS
path: /users/user123/years/year2025/days/day1
auth.uid: user123

// Should FAIL
path: /users/user456/years/year2025/days/day1
auth.uid: user123
```

## Migration from Test Mode

If your database was created in Test Mode:

1. **Backup data** (Export → Download)
2. **Replace test rules** with production rules above
3. **Test thoroughly** with real authentication
4. **Monitor** Firestore Dashboard for errors
5. **Adjust** if needed using patterns above

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/basics)
- [Firestore Rules Cookbook](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Security Rules Simulator](https://firebase.google.com/docs/rules/simulator)

---

**Remember:** Security is everyone's responsibility. Never commit API keys or authentication tokens to version control!

Last Updated: February 2026
