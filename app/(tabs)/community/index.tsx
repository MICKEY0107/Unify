import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, shadows, spacing, typography } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { likedPostsService } from "../../../services/likedPostsService";
import { CommunityPost, mongoDBService } from "../../../services/mongoDBService";

const { width } = Dimensions.get("window");

const categories = [
  "All Categories",
  "Communication", 
  "Physical & Mobility", 
  "Cognitive & Learning", 
  "Visual", 
  "Hearing", 
  "Mental Health", 
  "General"
];

export default function CommunityList() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const loadLikedPosts = async () => {
    try {
      const liked = await likedPostsService.getLikedPosts();
      setLikedPosts(new Set(liked));
    } catch (error) {
      console.error('Error loading liked posts:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const newLikeStatus = await likedPostsService.toggleLike(postId);
      
      // Update local state
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (newLikeStatus) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
      
      // Update likes count in database
      const updatedPost = await mongoDBService.updatePostLikes(postId, newLikeStatus);
      if (updatedPost) {
        setPosts(prev => prev.map(post => 
          post._id === postId ? { ...post, likes: updatedPost.likes } : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const loadPosts = async (category?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedPosts = await mongoDBService.getPosts(category === "All Categories" ? undefined : category);
      setPosts(fetchedPosts);
      console.log('Community Posts loaded:', fetchedPosts.length);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPosts(selectedCategory === "All Categories" ? undefined : selectedCategory);
    setIsRefreshing(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadPosts(category === "All Categories" ? undefined : category);
  };

  useEffect(() => {
    loadPosts();
    loadLikedPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.some(paragraph => 
      paragraph.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (isLoading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={64} color={colors.primary} />
          <Text style={styles.loadingTitle}>Loading Stories...</Text>
          <Text style={styles.loadingSubtitle}>Please wait while we fetch the latest posts</Text>
        </View>
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textTertiary} />
          <Text style={styles.errorTitle}>Unable to load stories</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadPosts()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Stories</Text>
        <Text style={styles.headerSubtitle}>Share your journey, inspire others</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stories..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Filter by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected
              ]}
              onPress={() => handleCategoryChange(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextSelected
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Post Composer */}
      <View style={styles.composer}>
        <View style={styles.composerHeader}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
          <Text style={styles.composerTitle}>Share Your Story</Text>
        </View>
        <TextInput
          style={styles.composerInput}
          placeholder="What's your Unifying experience? Share your journey..."
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity 
          style={styles.postButton} 
          onPress={() => router.push('/community/post')}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.postButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View>

      {/* Stories Section */}
      <View style={styles.storiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Inspiring Stories</Text>
          <Text style={styles.storyCount}>{filteredPosts.length} stories</Text>
        </View>

        {filteredPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No stories found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? "Try adjusting your search" : "Be the first to share your story"}
            </Text>
          </View>
        ) : (
          filteredPosts.map((post) => (
            <Link key={post._id} href={`/community/read/${post._id}`} asChild>
              <TouchableOpacity style={styles.storyCard}>
                <View style={styles.storyImageContainer}>
                  <Image 
                    source={post.image ? { uri: post.image } : require("../../../assets/images/community.png")} 
                    style={styles.storyImage} 
                    resizeMode="cover" 
                  />
                  <View style={styles.storyOverlay}>
                    <View style={styles.readTimeContainer}>
                      <Ionicons name="time-outline" size={14} color="#FFFFFF" />
                      <Text style={styles.readTime}>{Math.ceil(post.content.join(' ').split(' ').length / 200)} min read</Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{post.category}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.storyContent}>
                  <View style={styles.storyHeader}>
                    <Text style={styles.storyTitle}>{post.title}</Text>
                    <TouchableOpacity 
                      style={styles.storyBadge}
                      onPress={() => handleLike(post._id)}
                    >
                      <Ionicons 
                        name={likedPosts.has(post._id) ? "heart" : "heart-outline"} 
                        size={12} 
                        color={likedPosts.has(post._id) ? "#FF6B6B" : "#FF6B6B"} 
                      />
                      <Text style={styles.storyBadgeText}>{post.likes} likes</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {post.subtitle && (
                    <Text style={styles.storySubtitle}>{post.subtitle}</Text>
                  )}
                  
                  <Text style={styles.storyExcerpt} numberOfLines={3}>
                    {post.content[0] || "Read the full story..."}
                  </Text>
                  
                  <View style={styles.storyFooter}>
                    <View style={styles.authorInfo}>
                      <View style={styles.authorAvatar}>
                        <Ionicons name="person" size={16} color={colors.primary} />
                      </View>
                      <Text style={styles.authorName}>{post.author}</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.readMoreButton}
                      onPress={() => router.push(`/community/read/${post._id}`)}
                    >
                      <Text style={styles.readMoreText}>Read More</Text>
                      <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  composer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  composerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  composerTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  composerInput: {
    minHeight: 80,
    ...typography.body,
    color: colors.textPrimary,
    textAlignVertical: "top",
    marginBottom: spacing.md,
  },
  postButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  postButtonText: {
    ...typography.button,
    color: "#FFFFFF",
    marginLeft: spacing.sm,
  },
  storiesSection: {
    marginTop: spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  storyCount: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  storyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: "hidden",
    ...shadows.medium,
  },
  storyImageContainer: {
    position: "relative",
    height: 200,
  },
  storyImage: {
    width: "100%",
    height: "100%",
  },
  storyOverlay: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
  },
  readTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  readTime: {
    ...typography.caption,
    color: "#FFFFFF",
    marginLeft: spacing.xs,
  },
  storyContent: {
    padding: spacing.lg,
  },
  storyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  storyTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  storyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B20",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  storyBadgeText: {
    ...typography.caption,
    color: "#FF6B6B",
    marginLeft: spacing.xs,
    fontWeight: "600",
  },
  storySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontStyle: "italic",
  },
  storyExcerpt: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  storyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  authorName: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  readMoreText: {
    ...typography.button,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  errorSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
  },
  retryButtonText: {
    ...typography.button,
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  loadingSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  categoryScroll: {
    marginTop: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
  },
  categoryBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  categoryBadgeText: {
    ...typography.caption,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
