import AsyncStorage from '@react-native-async-storage/async-storage';

// MongoDB REST API configuration
const API_BASE_URL = 'http://localhost:3000'; // Replace with your deployed API URL
const FALLBACK_TO_LOCAL = false; // Use MongoDB Atlas as primary, local storage only for offline

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  customUsername?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityPost {
  _id: string;
  title: string;
  subtitle?: string;
  content: string[];
  image?: string;
  author: string;
  authorId: string;
  authorCustomUsername?: string;
  authorProfileImage?: string;
  category: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

class MongoDBService {
  private static instance: MongoDBService;
  private readonly STORAGE_KEY = 'unify_user_profiles';
  private readonly POSTS_STORAGE_KEY = 'unify_community_posts';

  private constructor() {}

  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  // Make API request to MongoDB backend
  private async makeApiRequest(endpoint: string, method: string, body?: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      if (FALLBACK_TO_LOCAL) {
        console.log('🔄 Falling back to local storage');
        throw new Error('API_UNAVAILABLE');
      }
      throw error;
    }
  }

  // Log MongoDB operations for debugging
  private logMongoDBOperation(operation: string, data: any) {
    console.log(`🔵 MONGODB ${operation.toUpperCase()}:`, JSON.stringify(data, null, 2));
    console.log(`📡 Would send to MongoDB Atlas: ${operation}`);
    console.log(`🗄️  Database: unify, Collection: users`);
  }

  private async getAllUsers(): Promise<UserProfile[]> {
    try {
      const usersJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error loading users from storage:', error);
      return [];
    }
  }

  private async saveAllUsers(users: UserProfile[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to storage:', error);
      throw new Error('Failed to save user data');
    }
  }

  public async createUser(userData: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    try {
      // Try API first
      const now = new Date();
      const userProfile: UserProfile = {
        ...userData,
        createdAt: now,
        updatedAt: now,
      };

      try {
        const response = await this.makeApiRequest('/api/users', 'POST', userProfile);
        if (response.success) {
          console.log('✅ User created in MongoDB Atlas:', userData.uid);
          return response.user;
        }
      } catch (apiError: any) {
        if (apiError.message === 'API_UNAVAILABLE') {
          // Fallback to local storage
          return await this.createUserLocal(userData);
        }
        throw apiError;
      }
      
      // If API succeeds but response is not successful, fallback to local
      return await this.createUserLocal(userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user profile');
    }
  }

  private async createUserLocal(userData: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const users = await this.getAllUsers();
    
    // Check if user already exists
    const existingUser = users.find(user => user.uid === userData.uid);
    if (existingUser) {
      console.log('User already exists locally:', userData.uid);
      return existingUser;
    }

    const now = new Date();
    const userProfile: UserProfile = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    // Log MongoDB operation
    this.logMongoDBOperation('INSERT', {
      collection: 'users',
      database: 'unify',
      document: userProfile
    });

    users.push(userProfile);
    await this.saveAllUsers(users);
    
    console.log('✅ User created in local storage (MongoDB simulation):', userData.uid);
    return userProfile;
  }

  public async getUserByUid(uid: string): Promise<UserProfile | null> {
    try {
      // Try API first
      try {
        const response = await this.makeApiRequest(`/api/users/${uid}`, 'GET');
        if (response.success) {
          console.log('✅ User found in MongoDB Atlas:', uid);
          return response.user;
        }
      } catch (apiError: any) {
        if (apiError.message === 'API_UNAVAILABLE') {
          // Fallback to local storage
          return await this.getUserByUidLocal(uid);
        }
        throw apiError;
      }
      
      // If API succeeds but no user found, fallback to local
      return await this.getUserByUidLocal(uid);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  private async getUserByUidLocal(uid: string): Promise<UserProfile | null> {
    const users = await this.getAllUsers();
    
    // Log MongoDB operation
    this.logMongoDBOperation('FIND_ONE', {
      collection: 'users',
      database: 'unify',
      filter: { uid }
    });

    const user = users.find(user => user.uid === uid) || null;
    
    if (user) {
      console.log('✅ User found in local storage (MongoDB simulation):', uid);
    } else {
      console.log('❌ User not found in local storage (MongoDB simulation):', uid);
    }
    
    return user;
  }

  public async updateUser(uid: string, updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>): Promise<UserProfile | null> {
    try {
      // Try API first
      try {
        const response = await this.makeApiRequest(`/api/users/${uid}`, 'PUT', updates);
        if (response.success) {
          console.log('✅ User updated in MongoDB Atlas:', uid);
          return response.user;
        }
      } catch (apiError: any) {
        if (apiError.message === 'API_UNAVAILABLE') {
          // Fallback to local storage
          return await this.updateUserLocal(uid, updates);
        }
        throw apiError;
      }
      
      // If API succeeds but no user found, fallback to local
      return await this.updateUserLocal(uid, updates);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user profile');
    }
  }

  private async updateUserLocal(uid: string, updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>): Promise<UserProfile | null> {
    const users = await this.getAllUsers();
    const userIndex = users.findIndex(user => user.uid === uid);
    
    if (userIndex === -1) {
      return null;
    }

    const updatedUser: UserProfile = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date(),
    };

    // Log MongoDB operation
    this.logMongoDBOperation('UPDATE', {
      collection: 'users',
      database: 'unify',
      filter: { uid },
      update: { $set: updates }
    });

    users[userIndex] = updatedUser;
    await this.saveAllUsers(users);
    
    console.log('✅ User updated in local storage (MongoDB simulation):', uid);
    return updatedUser;
  }

  public async deleteUser(uid: string): Promise<boolean> {
    try {
      // Try API first
      try {
        const response = await this.makeApiRequest(`/api/users/${uid}`, 'DELETE');
        if (response.success) {
          console.log('✅ User deleted from MongoDB Atlas:', uid);
          return true;
        }
      } catch (apiError: any) {
        if (apiError.message === 'API_UNAVAILABLE') {
          // Fallback to local storage
          return await this.deleteUserLocal(uid);
        }
        throw apiError;
      }
      
      // If API succeeds but no user found, fallback to local
      return await this.deleteUserLocal(uid);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user profile');
    }
  }

  private async deleteUserLocal(uid: string): Promise<boolean> {
    const users = await this.getAllUsers();
    const filteredUsers = users.filter(user => user.uid !== uid);
    
    if (filteredUsers.length === users.length) {
      return false; // User not found
    }

    // Log MongoDB operation
    this.logMongoDBOperation('DELETE', {
      collection: 'users',
      database: 'unify',
      filter: { uid }
    });

    await this.saveAllUsers(filteredUsers);
    console.log('✅ User deleted from local storage (MongoDB simulation):', uid);
    return true;
  }

  public async checkUsernameAvailability(username: string, excludeUid?: string): Promise<boolean> {
    try {
      // Try API first
      try {
        const response = await this.makeApiRequest('/api/users/check-username', 'POST', {
          username,
          excludeUid
        });
        if (response.success) {
          console.log(`✅ Username "${username}" is ${response.available ? 'available' : 'taken'} in MongoDB Atlas`);
          return response.available;
        }
      } catch (apiError: any) {
        if (apiError.message === 'API_UNAVAILABLE') {
          // Fallback to local storage
          return await this.checkUsernameAvailabilityLocal(username, excludeUid);
        }
        throw apiError;
      }
      
      // If API succeeds but response is not successful, fallback to local
      return await this.checkUsernameAvailabilityLocal(username, excludeUid);
    } catch (error) {
      console.error('Error checking username availability:', error);
      throw new Error('Failed to check username availability');
    }
  }

  private async checkUsernameAvailabilityLocal(username: string, excludeUid?: string): Promise<boolean> {
    const users = await this.getAllUsers();
    
    // Log MongoDB operation
    const filter: any = { customUsername: username };
    if (excludeUid) {
      filter.uid = { $ne: excludeUid };
    }
    
    this.logMongoDBOperation('FIND_ONE', {
      collection: 'users',
      database: 'unify',
      filter
    });

    const existingUser = users.find(user => 
      user.customUsername === username && 
      (!excludeUid || user.uid !== excludeUid)
    );
    
    const isAvailable = !existingUser;
    console.log(`✅ Username "${username}" is ${isAvailable ? 'available' : 'taken'} in local storage (MongoDB simulation)`);
    
    return isAvailable;
  }

  // Method to clear all user data (useful for testing)
  public async clearAllUsers(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      console.log('✅ All user data cleared');
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw new Error('Failed to clear user data');
    }
  }

  // Method to export all users (for debugging)
  public async exportAllUsers(): Promise<UserProfile[]> {
    const users = await this.getAllUsers();
    console.log('📊 All users in database:', JSON.stringify(users, null, 2));
    return users;
  }

  // ===== COMMUNITY POSTS METHODS =====

  private async getAllPosts(): Promise<CommunityPost[]> {
    try {
      const postsJson = await AsyncStorage.getItem(this.POSTS_STORAGE_KEY);
      return postsJson ? JSON.parse(postsJson) : [];
    } catch (error) {
      console.error('Error loading posts from storage:', error);
      return [];
    }
  }

  private async saveAllPosts(posts: CommunityPost[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts to storage:', error);
      throw new Error('Failed to save posts data');
    }
  }

  public async createPost(postData: Omit<CommunityPost, '_id' | 'createdAt' | 'updatedAt' | 'likes'>): Promise<CommunityPost> {
    try {
      // Try API first
      const now = new Date();
      const post: CommunityPost = {
        ...postData,
        _id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        likes: 0,
        createdAt: now,
        updatedAt: now,
      };

      try {
        const response = await this.makeApiRequest('/api/posts', 'POST', post);
        if (response.success) {
          console.log('✅ Post created in MongoDB Atlas:', post._id);
          return response.post;
        }
      } catch (apiError: any) {
        if (apiError.message === 'API_UNAVAILABLE') {
          // Fallback to local storage
          return await this.createPostLocal(post);
        }
        throw apiError;
      }
      
      // If API succeeds but response is not successful, fallback to local
      return await this.createPostLocal(post);
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  }

  private async createPostLocal(post: CommunityPost): Promise<CommunityPost> {
    const posts = await this.getAllPosts();
    
    // Log MongoDB operation
    this.logMongoDBOperation('INSERT', {
      collection: 'posts',
      database: 'unify',
      document: post
    });

    posts.push(post);
    await this.saveAllPosts(posts);
    
    console.log('✅ Post created in local storage (MongoDB simulation):', post._id);
    return post;
  }

  public async getPosts(category?: string): Promise<CommunityPost[]> {
    try {
      // Try API first
      try {
        const endpoint = category ? `/api/posts?category=${encodeURIComponent(category)}` : '/api/posts';
        const response = await this.makeApiRequest(endpoint, 'GET');
        if (response.success) {
          console.log('✅ Posts fetched from MongoDB Atlas');
          return response.posts;
        }
      } catch (apiError: any) {
        if (apiError.message === 'API_UNAVAILABLE') {
          // Fallback to local storage
          return await this.getPostsLocal(category);
        }
        throw apiError;
      }
      
      // If API succeeds but response is not successful, fallback to local
      return await this.getPostsLocal(category);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts');
    }
  }

  private async getPostsLocal(category?: string): Promise<CommunityPost[]> {
    const posts = await this.getAllPosts();
    
    // Log MongoDB operation
    const filter = category ? { category } : {};
    this.logMongoDBOperation('FIND', {
      collection: 'posts',
      database: 'unify',
      filter
    });

    let filteredPosts = posts;
    if (category) {
      filteredPosts = posts.filter(post => post.category === category);
    }

    // Sort by creation date (newest first)
    filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`✅ ${filteredPosts.length} posts found in local storage (MongoDB simulation)`);
    return filteredPosts;
  }

  public async getPostById(id: string): Promise<CommunityPost | null> {
    try {
      // Try API first
      try {
        const response = await this.makeApiRequest(`/api/posts/${id}`, 'GET');
        if (response.success) {
          console.log('✅ Post found in MongoDB Atlas:', id);
          return response.post;
        }
      } catch (apiError: any) {
        if (apiError.message === 'API_UNAVAILABLE') {
          // Fallback to local storage
          return await this.getPostByIdLocal(id);
        }
        throw apiError;
      }
      
      // If API succeeds but no post found, fallback to local
      return await this.getPostByIdLocal(id);
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Failed to fetch post');
    }
  }

  private async getPostByIdLocal(id: string): Promise<CommunityPost | null> {
    const posts = await this.getAllPosts();
    
    // Log MongoDB operation
    this.logMongoDBOperation('FIND_ONE', {
      collection: 'posts',
      database: 'unify',
      filter: { _id: id }
    });

    const post = posts.find(post => post._id === id) || null;
    
    if (post) {
      console.log('✅ Post found in local storage (MongoDB simulation):', id);
    } else {
      console.log('❌ Post not found in local storage (MongoDB simulation):', id);
    }
    
    return post;
  }

  public async updatePostLikes(postId: string, increment: boolean): Promise<CommunityPost | null> {
    try {
      // Try API first
      try {
        const response = await this.makeApiRequest(`/api/posts/${postId}/likes`, 'PUT', { increment });
        if (response.success) {
          console.log('✅ Post likes updated in MongoDB Atlas:', postId);
          return response.post;
        }
      } catch (apiError: any) {
        if (apiError.message === 'API_UNAVAILABLE') {
          // Fallback to local storage
          return await this.updatePostLikesLocal(postId, increment);
        }
        throw apiError;
      }
      
      // If API succeeds but no post found, fallback to local
      return await this.updatePostLikesLocal(postId, increment);
    } catch (error) {
      console.error('Error updating post likes:', error);
      throw new Error('Failed to update post likes');
    }
  }

  private async updatePostLikesLocal(postId: string, increment: boolean): Promise<CommunityPost | null> {
    const posts = await this.getAllPosts();
    const postIndex = posts.findIndex(post => post._id === postId);
    
    if (postIndex === -1) {
      return null;
    }

    const updatedPost: CommunityPost = {
      ...posts[postIndex],
      likes: increment ? posts[postIndex].likes + 1 : Math.max(0, posts[postIndex].likes - 1),
      updatedAt: new Date(),
    };

    // Log MongoDB operation
    this.logMongoDBOperation('UPDATE', {
      collection: 'posts',
      database: 'unify',
      filter: { _id: postId },
      update: { $inc: { likes: increment ? 1 : -1 } }
    });

    posts[postIndex] = updatedPost;
    await this.saveAllPosts(posts);
    
    console.log('✅ Post likes updated in local storage (MongoDB simulation):', postId);
    return updatedPost;
  }

  // Method to seed posts (for initial data)
  public async seedPosts(posts: Omit<CommunityPost, '_id' | 'createdAt' | 'updatedAt' | 'likes'>[]): Promise<void> {
    try {
      const now = new Date();
      const seededPosts: CommunityPost[] = posts.map((post, index) => ({
        ...post,
        _id: `seed_post_${index + 1}_${Date.now()}`,
        likes: 0,
        createdAt: now,
        updatedAt: now,
      }));

      // Log MongoDB operation
      this.logMongoDBOperation('INSERT_MANY', {
        collection: 'posts',
        database: 'unify',
        documents: seededPosts
      });

      await this.saveAllPosts(seededPosts);
      console.log(`✅ ${seededPosts.length} posts seeded successfully`);
    } catch (error) {
      console.error('Error seeding posts:', error);
      throw new Error('Failed to seed posts');
    }
  }

  // Method to clear all posts (useful for testing)
  public async clearAllPosts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.POSTS_STORAGE_KEY);
      console.log('✅ All posts data cleared');
    } catch (error) {
      console.error('Error clearing posts data:', error);
      throw new Error('Failed to clear posts data');
    }
  }
}

export const mongoDBService = MongoDBService.getInstance();