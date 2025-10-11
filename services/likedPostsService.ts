import AsyncStorage from '@react-native-async-storage/async-storage';

const LIKED_POSTS_KEY = 'unify_liked_posts';

class LikedPostsService {
  private static instance: LikedPostsService;

  private constructor() {}

  public static getInstance(): LikedPostsService {
    if (!LikedPostsService.instance) {
      LikedPostsService.instance = new LikedPostsService();
    }
    return LikedPostsService.instance;
  }

  // Get all liked post IDs
  public async getLikedPosts(): Promise<string[]> {
    try {
      const likedPostsJson = await AsyncStorage.getItem(LIKED_POSTS_KEY);
      return likedPostsJson ? JSON.parse(likedPostsJson) : [];
    } catch (error) {
      console.error('Error loading liked posts:', error);
      return [];
    }
  }

  // Check if a post is liked
  public async isPostLiked(postId: string): Promise<boolean> {
    try {
      const likedPosts = await this.getLikedPosts();
      return likedPosts.includes(postId);
    } catch (error) {
      console.error('Error checking if post is liked:', error);
      return false;
    }
  }

  // Toggle like status for a post
  public async toggleLike(postId: string): Promise<boolean> {
    try {
      const likedPosts = await this.getLikedPosts();
      const isLiked = likedPosts.includes(postId);
      
      let newLikedPosts: string[];
      if (isLiked) {
        // Remove from liked posts
        newLikedPosts = likedPosts.filter(id => id !== postId);
      } else {
        // Add to liked posts
        newLikedPosts = [...likedPosts, postId];
      }
      
      await AsyncStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(newLikedPosts));
      console.log(`✅ Post ${postId} ${isLiked ? 'unliked' : 'liked'}`);
      
      return !isLiked; // Return new like status
    } catch (error) {
      console.error('Error toggling like:', error);
      throw new Error('Failed to toggle like');
    }
  }

  // Like a post (add to liked posts)
  public async likePost(postId: string): Promise<void> {
    try {
      const likedPosts = await this.getLikedPosts();
      if (!likedPosts.includes(postId)) {
        const newLikedPosts = [...likedPosts, postId];
        await AsyncStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(newLikedPosts));
        console.log(`✅ Post ${postId} liked`);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      throw new Error('Failed to like post');
    }
  }

  // Unlike a post (remove from liked posts)
  public async unlikePost(postId: string): Promise<void> {
    try {
      const likedPosts = await this.getLikedPosts();
      const newLikedPosts = likedPosts.filter(id => id !== postId);
      await AsyncStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(newLikedPosts));
      console.log(`✅ Post ${postId} unliked`);
    } catch (error) {
      console.error('Error unliking post:', error);
      throw new Error('Failed to unlike post');
    }
  }

  // Clear all liked posts (useful for testing or logout)
  public async clearLikedPosts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LIKED_POSTS_KEY);
      console.log('✅ All liked posts cleared');
    } catch (error) {
      console.error('Error clearing liked posts:', error);
      throw new Error('Failed to clear liked posts');
    }
  }

  // Get count of liked posts
  public async getLikedPostsCount(): Promise<number> {
    try {
      const likedPosts = await this.getLikedPosts();
      return likedPosts.length;
    } catch (error) {
      console.error('Error getting liked posts count:', error);
      return 0;
    }
  }
}

export const likedPostsService = LikedPostsService.getInstance();
