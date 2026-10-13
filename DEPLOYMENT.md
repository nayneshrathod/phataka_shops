# Firebase Deployment Guide: PRATIK PHATAKE

This guide describes how to deploy **PRATIK PHATAKE (प्रतीक फटाके)** to Google Firebase Hosting, Cloud Firestore, and Firebase Storage.

---

## 1. Prerequisites

1. Install the Firebase CLI globally if not already installed:
   ```powershell
   npm install -g firebase-tools
   ```
2. Verify Firebase CLI version:
   ```powershell
   firebase --version
   ```

---

## 2. Firebase Project Association

1. Log in to your Google Account associated with Firebase:
   ```powershell
   firebase login
   ```
2. Link this directory with your real Firebase Project:
   ```powershell
   firebase use --add
   ```
   Select your existing Firebase project (e.g. `pratik-phatake-production`) and give it an alias (e.g. `production` or `default`).

---

## 3. Update Environment Credentials

Open `src/environments/environment.prod.ts` and replace the placeholder credentials with your real Firebase Web App configuration from the **Firebase Console > Project Settings > General > Your Apps**:

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_ACTUAL_FIREBASE_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  },
  useEmulators: false,
  // ...
};
```

---

## 4. Build the Production Application

Compile the Angular application:

### Windows PowerShell:
```powershell
npm run build
```

### macOS / Linux Bash:
```bash
npm run build
```

The output will be generated inside `dist/pratik-phatake/browser`.

---

## 5. Deploy Security Rules & Firestore Indexes

Before deploying the frontend, deploy your security rules and indexes:

### Deploy Firestore Security Rules & Indexes:
```powershell
firebase deploy --only firestore
```

### Deploy Cloud Storage Security Rules:
```powershell
firebase deploy --only storage
```

---

## 6. Deploy to Firebase Hosting

Deploy the compiled Angular single-page application to Firebase Hosting:

```powershell
firebase deploy --only hosting
```

Or deploy all resources at once:

```powershell
firebase deploy
```

Once deployment finishes, the Firebase CLI will print your live URL:
`Hosting URL: https://your-project-id.web.app`

---

## 7. Post-Deployment Verification Checklist

- [ ] **Catalog Browsing:** Open the public URL and verify categories and products render without errors.
- [ ] **Language Switcher:** Toggle between Marathi, Hindi, and English. Confirm translations update.
- [ ] **Inquiry Submission:** Submit a store inquiry with consent and verify reference ID (`INQ-2026-XXXX`).
- [ ] **Admin Authentication:** Navigate to `/admin/login`, log in with staff credentials, and check that `/admin/dashboard` loads correctly.
- [ ] **Stock Adjustment:** Perform a test stock adjustment under `/admin/inventory` and verify movement audit logs.
- [ ] **Mobile Responsiveness:** Test UI on mobile viewports (360px, 390px, 430px) ensuring no horizontal overflow.
- [ ] **Legal Disclaimers:** Confirm Supreme Court and PESO compliance notices are prominently displayed.
