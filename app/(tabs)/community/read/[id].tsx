import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../../../../constants/theme';
import { likedPostsService } from '../../../../services/likedPostsService';
import { CommunityPost, mongoDBService } from '../../../../services/mongoDBService';

const { width } = Dimensions.get("window");

export default function CommunityReadById() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [story, setStory] = useState<CommunityPost | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStory = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedStory = await mongoDBService.getPostById(id);
      
      if (fetchedStory) {
        setStory(fetchedStory);
        setLikes(fetchedStory.likes);
        
        // Check if user has liked this post
        const hasLiked = await likedPostsService.isPostLiked(id);
        setIsLiked(hasLiked);
      } else {
        setError('Story not found');
      }
    } catch (err) {
      console.error('Error loading story:', err);
      setError('Failed to load story');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStory();
  }, [id]);

  const handleLike = async () => {
    if (!story) return;
    
    try {
      const newLikeStatus = await likedPostsService.toggleLike(story._id);
      setIsLiked(newLikeStatus);
      
      // Update likes count in database
      const updatedStory = await mongoDBService.updatePostLikes(story._id, newLikeStatus);
      if (updatedStory) {
        setLikes(updatedStory.likes);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={64} color={colors.primary} />
          <Text style={styles.loadingTitle}>Loading Story...</Text>
          <Text style={styles.loadingSubtitle}>Please wait while we fetch the story</Text>
        </View>
      </View>
    );
  }

  if (error || !story) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.textTertiary} />
        <Text style={styles.errorTitle}>Story Not Found</Text>
        <Text style={styles.errorSubtitle}>{error || "The story you're looking for doesn't exist"}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = () => {
    // Share functionality would go here
    console.log('Share story:', story.title);
  };

  return (
    <View style={styles.modalContainer}>
      {/* Close Button */}
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => router.push('/(tabs)/community')}
      >
        <Ionicons name="close" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image 
            source={story.image ? { uri: story.image } : require('../../../../assets/images/community - Read.png')} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={20} 
                  color={isLiked ? "#FF6B6B" : "#FFFFFF"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Story Content */}
        <View style={styles.storyContainer}>
          {/* Header */}
          <View style={styles.storyHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{story.category}</Text>
            </View>
            <View style={styles.readTimeContainer}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.readTime}>{Math.ceil(story.content.join(' ').split(' ').length / 200)} min read</Text>
            </View>
          </View>

          {/* Title and Author */}
          <Text style={styles.title}>{story.title}</Text>
          {story.subtitle && (
            <Text style={styles.subtitle}>{story.subtitle}</Text>
          )}

          <View style={styles.authorSection}>
            <View style={styles.authorAvatar}>
              {story.authorProfileImage ? (
                <Image 
                  source={{ uri: story.authorProfileImage }} 
                  style={styles.authorAvatarImage}
                />
              ) : (
                <Ionicons name="person" size={20} color={colors.primary} />
              )}
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>
                {story.authorCustomUsername || story.author}
              </Text>
              <Text style={styles.publishDate}>{new Date(story.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.likeSection}>
              <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={18} 
                  color={isLiked ? "#FF6B6B" : colors.textSecondary} 
                />
                <Text style={[styles.likeCount, { color: isLiked ? "#FF6B6B" : colors.textSecondary }]}>
                  {likes}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Story Content */}
          <View style={styles.storyContent}>
            {story.content.map((paragraph, index) => (
              <Text key={index} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Inspired by this story?</Text>
          <Text style={styles.ctaSubtitle}>Share your own experience and help others on their journey</Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/(tabs)/community/post')}
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            <Text style={styles.ctaButtonText}>Share Your Story</Text>
          </TouchableOpacity>
        </View>

        {/* Related Stories - Simplified for now */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>More Inspiring Stories</Text>
          <View style={styles.relatedPlaceholder}>
            <Ionicons name="book-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.relatedPlaceholderText}>More stories coming soon!</Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  content: { 
    paddingBottom: spacing.xxl 
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
    marginBottom: spacing.xl,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    ...typography.button,
    color: "#FFFFFF",
  },
  heroContainer: {
    position: "relative",
    height: 250,
  },
  heroImage: { 
    width: "100%", 
    height: "100%" 
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: spacing.lg,
  },
  heroActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  storyContainer: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
  },
  storyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  categoryText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },
  readTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  readTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  title: { 
    ...typography.h2, 
    color: colors.textPrimary, 
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  subtitle: { 
    ...typography.h4, 
    color: colors.textSecondary, 
    marginBottom: spacing.lg,
    fontStyle: "italic",
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    overflow: "hidden",
  },
  authorAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  publishDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  likeSection: {
    alignItems: "center",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
  },
  likeCount: {
    ...typography.caption,
    marginLeft: spacing.xs,
    fontWeight: "600",
  },
  storyContent: {
    marginBottom: spacing.xl,
  },
  paragraph: { 
    ...typography.body, 
    color: colors.textPrimary, 
    marginBottom: spacing.lg, 
    lineHeight: 24,
    fontSize: 16,
  },
  ctaSection: {
    backgroundColor: colors.primaryLight,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  ctaTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  ctaSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  ctaButtonText: {
    ...typography.button,
    color: "#FFFFFF",
    marginLeft: spacing.sm,
  },
  relatedSection: {
    marginTop: spacing.lg,
  },
  relatedTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  relatedCard: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    overflow: "hidden",
    ...shadows.small,
  },
  relatedImage: {
    width: "100%",
    height: 120,
  },
  relatedContent: {
    padding: spacing.md,
  },
  relatedCardTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  relatedAuthor: {
    ...typography.caption,
    color: colors.textSecondary,
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
  relatedPlaceholder: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  relatedPlaceholderText: {
    ...typography.body,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
});
