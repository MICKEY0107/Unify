# Profile Management & Database Integration

This document outlines the new profile management features and database integration implemented in the Unify app.

## New Features Implemented

### 1. Profile Screen Updates
- **Removed sections**: Notifications, Privacy & Security, Help & Support, About
- **Added**: Edit Profile functionality with username and image upload
- **Sign out**: Now properly redirects to `/login` screen

### 2. User Database Integration
- **Storage**: Local AsyncStorage for user profiles (can be easily replaced with MongoDB API)
- **Collection**: `users` collection for storing user profiles
- **User Profile Schema**:
  ```typescript
  interface UserProfile {
    uid: string;           // Firebase user ID
    email: string;         // User email
    displayName: string;   // Original display name from Google
    photoURL?: string;     // Original photo URL from Google
    customUsername?: string; // Custom username set by user
    profileImageUrl?: string; // Custom profile image URL
    createdAt: Date;      // Account creation date
    updatedAt: Date;       // Last update date
  }
  ```

### 3. ImgBB Image Upload Service
- **Service**: ImgBB API for image hosting
- **Features**:
  - Upload images from device gallery
  - Automatic image compression and optimization
  - Returns public URL for image storage
  - Image validation and size limits

### 4. Edit Profile Functionality
- **Username Management**:
  - Users can set custom usernames
  - Username availability checking
  - 30 character limit
  - Real-time validation

- **Profile Image Upload**:
  - Tap to select from gallery
  - Image cropping and editing
  - Automatic upload to ImgBB
  - Circular profile image display

## Database Configuration

### Local Storage (AsyncStorage)
```typescript
const STORAGE_KEY = 'unify_user_profiles';
// Data is stored locally on device
// Can be easily replaced with MongoDB Atlas Data API
```

### ImgBB Configuration
```typescript
const IMGBB_API_KEY = '24196888d24258ecac028845c0b9aeea';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';
```

## User Flow

### 1. First Time User
1. User signs in with Google
2. System creates user profile in local storage
3. User can immediately edit profile
4. Custom username and image are saved locally

### 2. Returning User
1. User signs in with Google
2. System loads existing profile from local storage
3. Custom username and image are displayed
4. User can edit profile anytime

### 3. Guest User
1. User continues as guest
2. No database operations
3. Edit profile prompts sign-in
4. Limited functionality

## API Methods

### User Database Service (AsyncStorage)
- `createUser(userData)` - Create new user profile
- `getUserByUid(uid)` - Fetch user by Firebase UID
- `updateUser(uid, updates)` - Update user profile
- `deleteUser(uid)` - Delete user profile
- `checkUsernameAvailability(username, excludeUid)` - Check if username is available
- `clearAllUsers()` - Clear all user data (for testing)

### ImgBB Service
- `uploadImage(imageData, filename)` - Upload base64 image
- `uploadImageFromUri(imageUri, filename)` - Upload from file URI
- `deleteImage(deleteUrl)` - Delete uploaded image
- `validateImageFile(imageUri)` - Validate image format
- `getImageSizeLimit()` - Get size limit (32MB)

## Error Handling

### Database Errors
- Connection failures are handled gracefully
- User operations continue with fallbacks
- Error messages are user-friendly

### Image Upload Errors
- Network failures are handled
- Invalid image formats are rejected
- Size limits are enforced

### Username Validation
- Empty usernames are rejected
- Duplicate usernames are checked
- Character limits are enforced

## Security Considerations

### Data Protection
- User data is stored securely in MongoDB
- Images are hosted on ImgBB with public URLs
- No sensitive data is stored locally

### Input Validation
- All user inputs are validated
- Image uploads are sanitized
- Username availability is checked

## Dependencies Added

```json
{
  "@react-native-async-storage/async-storage": "^1.x.x",
  "expo-image-picker": "^14.x.x"
}
```

## Usage Examples

### Creating User Profile
```typescript
const userProfile = await mongoDBService.createUser({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});
```

### Uploading Profile Image
```typescript
const imageUrl = await imgBBService.uploadImageFromUri(imageUri);
await mongoDBService.updateUser(user.uid, {
  profileImageUrl: imageUrl,
});
```

### Updating Username
```typescript
const isAvailable = await mongoDBService.checkUsernameAvailability(username, user.uid);
if (isAvailable) {
  await mongoDBService.updateUser(user.uid, {
    customUsername: username,
  });
}
```

## Future Enhancements

- Profile image compression before upload
- Multiple image formats support
- Profile image backup and restore
- Username history and changes
- Profile privacy settings
- Social features integration
