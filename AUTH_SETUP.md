# Google Authentication Setup

This document outlines the Google Sign-In authentication implementation for the Unify app.

## Features Implemented

### 1. Firebase Configuration
- Firebase app initialization with your project credentials
- Google Auth Provider setup
- Analytics integration (optional)

### 2. Authentication Service
- Cross-platform Google Sign-In (Web and Mobile)
- User state management
- Sign-out functionality
- Guest mode support

### 3. Login Screen
- Google Sign-In button
- Guest mode option
- Loading states and error handling
- Beautiful UI with accessibility features

### 4. Authentication Context
- Global authentication state management
- User information access throughout the app
- Automatic auth state changes handling

### 5. Profile Screen
- User information display
- Sign-out functionality
- Guest mode indicators
- Account management options

## Configuration Details

### Firebase Config
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDvrjOHX6OdIFiT_cKDa7Shsd695xVLPQA",
  authDomain: "unify-28c3e.firebaseapp.com",
  projectId: "unify-28c3e",
  storageBucket: "unify-28c3e.firebasestorage.app",
  messagingSenderId: "996381423741",
  appId: "1:996381423741:web:887bb97414eb05e11a1914",
  measurementId: "G-JMKXDB90FG"
};
```

### Google OAuth Client ID
```
996381423741-796ag40mjfpdegth9ntd0cf65jud61i8.apps.googleusercontent.com
```

### Authorized URIs
- Browser: `https://unify-28c3e.firebaseapp.com`
- Web Server: `https://unify-28c3e.firebaseapp.com/__/auth/handler`

## App Flow

1. **Splash Screens** → **Onboarding** → **Login Screen**
2. **Login Options:**
   - Google Sign-In (gets user info from Google)
   - Guest Mode (no authentication required)
3. **Main App** with user-specific features
4. **Profile Screen** for account management and sign-out

## User Information Available

When signed in with Google, the app has access to:
- `uid`: Unique user identifier
- `email`: User's email address
- `displayName`: User's full name
- `photoURL`: User's profile picture URL

## Security Notes

- This is a test application with minimal security protocols
- User data is stored locally in the app
- No sensitive data is transmitted or stored on external servers
- Guest mode allows full app functionality without authentication

## Dependencies Added

```json
{
  "firebase": "^10.x.x",
  "@react-native-google-signin/google-signin": "^10.x.x",
  "expo-auth-session": "^5.x.x",
  "expo-crypto": "^12.x.x"
}
```

## Usage

The authentication system is automatically integrated into the app flow. Users will be prompted to sign in after the onboarding process, and can choose between Google Sign-In or Guest mode.

The `useAuth()` hook is available throughout the app to access user information and authentication state.
