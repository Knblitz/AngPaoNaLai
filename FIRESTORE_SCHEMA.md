# Firestore Data Schema - Angpao Tracker

## Collection Structure

```
users/{userId}
├── metadata (document)
│   ├── name: string
│   ├── email: string
│   ├── createdAt: timestamp
│   └── lastUpdated: timestamp
│
└── years/{yearId} (subcollection)
    ├── year: number (e.g., 2025)
    ├── createdAt: timestamp
    ├── totalAmount: number (calculated in real-time)
    │
    └── days/{dayId} (subcollection)
        ├── name: string (e.g., "Chu Yi", "Chu Er")
        ├── order: number (1, 2, 3, etc. for sorting)
        ├── createdAt: timestamp
        ├── totalAmount: number (calculated in real-time)
        │
        └── houseVisits/{visitId} (subcollection)
            ├── name: string (e.g., "Grandma's House")
            ├── createdAt: timestamp
            ├── totalAmount: number (calculated in real-time)
            │
            └── entries/{entryId} (subcollection)
                ├── amount: number (in dollars)
                ├── description: string (who gave it)
                ├── createdAt: timestamp
                └── currency: string (default "USD")
```

## Key Design Decisions

1. **Subcollections**: Used for high scalability and better data organization
2. **Denormalized Totals**: `totalAmount` stored at each level for quick display without complex queries
3. **Real-time Calculations**: Cloud Functions (optional) or client-side calculations keep totals current
4. **User-specific Data**: All data stored under user's UID for privacy and security
5. **Timestamps**: All entries timestamped for sorting and audit trails

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Root: deny all by default
    match /{document=**} {
      allow read, write: if false;
    }
    
    // User data: only user can access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Allow access to all subcollections
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

## Example Data Path

```
users/
  user123abc/
    metadata: {
      name: "John Doe",
      email: "john@example.com",
      createdAt: 2025-01-15,
      lastUpdated: 2025-02-17
    }
    years/
      year_2025/
        year: 2025
        totalAmount: 2500
        days/
          day_1/
            name: "Chu Yi"
            order: 1
            totalAmount: 800
            houseVisits/
              visit_grandma/
                name: "Grandma's House"
                totalAmount: 500
                entries/
                  entry_1: {amount: 200, description: "From Grandma"},
                  entry_2: {amount: 300, description: "From Grandpa"}
              visit_uncle/
                name: "Uncle's House"
                totalAmount: 300
                entries/
                  entry_1: {amount: 300, description: "From Uncle"}
```
