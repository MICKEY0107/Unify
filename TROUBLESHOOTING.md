# Troubleshooting Guide

This guide addresses common issues that may occur when running the Unify app with Google Authentication.

## Fixed Issues

### 1. Firebase Analytics Error
**Error:** `@firebase/analytics: Analytics: Firebase Analytics is not supported in this environment`

**Solution:** 
- Analytics is now conditionally loaded only for web platforms
- Mobile platforms will skip analytics initialization
- This prevents the error while maintaining functionality

### 2. Metro "window is not defined" Error
**Error:** `Metro error: window is not defined`

**Solution:**
- Google Sign-In configuration is now platform-specific
- Mobile-specific code only runs on mobile platforms
- Web-specific code only runs on web platforms
- Added proper error handling for cross-platform compatibility

## Platform-Specific Behavior

### Web Platform
- Uses Firebase `signInWithPopup` for Google authentication
- Analytics is enabled (if available)
- No native Google Sign-In SDK required

### Mobile Platform (iOS/Android)
- Uses `@react-native-google-signin/google-signin` SDK
- Analytics is disabled (not supported)
- Requires proper Google Sign-In configuration

## Error Handling

### Authentication Errors
- All authentication methods have try-catch blocks
- User-friendly error messages are displayed
- Fallback to guest mode is always available

### Error Boundary
- Added `ErrorBoundary` component to catch React errors
- Provides user-friendly error screens
- Includes retry functionality
- Shows detailed error information in development mode

## Common Solutions

### If Google Sign-In Fails
1. Check that the Google OAuth Client ID is correct
2. Verify that the authorized URIs are properly configured
3. Ensure Firebase project settings are correct
4. Try the "Continue as Guest" option as a fallback

### If App Crashes on Startup
1. Check the console for specific error messages
2. Verify all dependencies are properly installed
3. Clear Metro cache: `npx expo start --clear`
4. Restart the development server

### If Authentication State is Lost
1. The app automatically handles auth state changes
2. Users will be redirected to login if not authenticated
3. Guest mode is always available as a fallback

## Development Tips

### Testing Authentication
- Use guest mode for quick testing
- Test Google Sign-In on both web and mobile
- Verify sign-out functionality works correctly

### Debugging
- Check browser console for web-specific errors
- Use React Native debugger for mobile issues
- Enable verbose logging in development mode

## Dependencies

Make sure these packages are installed:
```json
{
  "firebase": "^10.x.x",
  "@react-native-google-signin/google-signin": "^10.x.x",
  "expo-auth-session": "^5.x.x",
  "expo-crypto": "^12.x.x"
}
```

## Configuration Files

### app.json
Ensure Google Sign-In plugin is configured:
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.996381423741-796ag40mjfpdegth9ntd0cf65jud61i8"
        }
      ]
    ]
  }
}
```

### Firebase Configuration
Verify your Firebase config in `services/firebase.ts` matches your project settings.

## Support

If you encounter issues not covered in this guide:
1. Check the console for error messages
2. Verify all configuration files are correct
3. Test with guest mode to isolate authentication issues
4. Ensure all dependencies are up to date
