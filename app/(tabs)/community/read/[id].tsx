import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import stories from '../communityData';
import { colors, spacing, borderRadius, typography, shadows } from '../../../../constants/theme';

const { width } = Dimensions.get("window");

export default function CommunityReadById() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  
  const story = id ? stories.find((s) => s.id === id) : stories[0];
  
  // Add debugging
  console.log('Story ID:', id);
  console.log('Story found:', !!story);

  React.useEffect(() => {
    if (story?.likes) {
      setLikes(story.likes);
    }
  }, [story]);

  if (!story) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.textTertiary} />
        <Text style={styles.errorTitle}>Story Not Found</Text>
        <Text style={styles.errorSubtitle}>The story you're looking for doesn't exist</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

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
            source={story.image ?? require('../../../../assets/images/community - Read.png')} 
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
            <Text style={styles.categoryText}>{story.category || "Personal Story"}</Text>
          </View>
          <View style={styles.readTimeContainer}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.readTime}>{story.readTime || 3} min read</Text>
          </View>
        </View>

        {/* Title and Author */}
        <Text style={styles.title}>{story.title}</Text>
        {story.subtitle && (
          <Text style={styles.subtitle}>{story.subtitle}</Text>
        )}

        <View style={styles.authorSection}>
          <View style={styles.authorAvatar}>
            <Ionicons name="person" size={20} color={colors.primary} />
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{story.author || "Anonymous"}</Text>
            <Text style={styles.publishDate}>{story.date || "Recently"}</Text>
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
          {(story.content || []).map((paragraph, index) => (
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

        {/* Related Stories */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>More Inspiring Stories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stories
              .filter(s => s.id !== story.id)
              .slice(0, 3)
              .map((relatedStory) => (
                <TouchableOpacity 
                  key={relatedStory.id}
                  style={styles.relatedCard}
                  onPress={() => router.push(`/(tabs)/community/read/${relatedStory.id}`)}
                >
                  <Image source={relatedStory.image} style={styles.relatedImage} />
                  <View style={styles.relatedContent}>
                    <Text style={styles.relatedTitle} numberOfLines={2}>
                      {relatedStory.title}
                    </Text>
                    <Text style={styles.relatedAuthor}>{relatedStory.author}</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
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
  relatedTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  relatedAuthor: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
