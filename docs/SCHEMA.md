# Project Manifest: TamFinds

## Data Models (TypeScript)

### User Profile
- uid: string
- email: string
- displayName: string
- isSchoolVerified: boolean (Logic: email ends with @feuroosevelt.edu.ph)
- createdAt: timestamp

### Lost/Found Item
- id: string
- title: string
- description: string
- imageUrl: string
- location: string
- category: 'Electronics' | 'IDs' | 'Books' | 'Personal'
- status: 'LOST' | 'FOUND' | 'CLAIMED'
- reporterId: string (Ref: User.uid)
- reportedAt: timestamp
- isAtSecurity: boolean

## Firestore Collections

### `/users/{uid}`
Document per authenticated user. Written on register.

### `/items/{itemId}`
Document per lost/found report. Written by `itemsService.createItem()`.
- `imageUrl` points to Firebase Storage download URL.
- `reportedAt` is set via `serverTimestamp()` — never client-set.
- `status` starts as `'LOST'` or `'FOUND'` on creation; transitions to `'CLAIMED'` by admin or reporter.

## Firebase Storage

### Path convention
```
items/{uid}/{timestamp}_{filename}
```
Example: `items/abc123/1741651200000_photo.jpg`

- Scoped per user to allow Storage Security Rules: `request.auth.uid == userId`
- Filename includes timestamp to prevent collisions.