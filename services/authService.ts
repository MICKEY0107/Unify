import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signInWithPopup,
    User
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth, googleProvider } from './firebase';

// Configure Google Sign-In only for mobile platforms
if (Platform.OS !== 'web') {
  GoogleSignin.configure({
    webClientId: '996381423741-796ag40mjfpdegth9ntd0cf65jud61i8.apps.googleusercontent.com',
    offlineAccess: true,
  });
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export class AuthService {
  private static instance: AuthService;
  private authStateListeners: ((user: AuthUser | null) => void)[] = [];

  private constructor() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      const authUser = user ? this.mapFirebaseUserToAuthUser(user) : null;
      this.authStateListeners.forEach(listener => listener(authUser));
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private mapFirebaseUserToAuthUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }

  public async signInWithGoogle(): Promise<AuthUser> {
    try {
      if (Platform.OS === 'web') {
        // Web implementation
        const result = await signInWithPopup(auth, googleProvider);
        return this.mapFirebaseUserToAuthUser(result.user);
      } else {
        // Mobile implementation
        try {
          await GoogleSignin.hasPlayServices();
          const result = await GoogleSignin.signIn();
        const idToken = result.data?.idToken;
        if (!idToken) {
          throw new Error('No ID token received from Google Sign-In');
        }
          const googleCredential = GoogleAuthProvider.credential(idToken);
          const firebaseResult = await signInWithCredential(auth, googleCredential);
          return this.mapFirebaseUserToAuthUser(firebaseResult.user);
        } catch (mobileError) {
          console.error('Mobile Google Sign-In Error:', mobileError);
          throw new Error('Mobile Google Sign-In failed');
        }
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw new Error('Failed to sign in with Google');
    }
  }

  public async signOut(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        try {
          await GoogleSignin.signOut();
        } catch (mobileError) {
          console.error('Mobile Google Sign-Out Error:', mobileError);
          // Continue with Firebase sign out even if Google sign out fails
        }
      }
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  public getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? this.mapFirebaseUserToAuthUser(user) : null;
  }

  public onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }
}

export const authService = AuthService.getInstance();
