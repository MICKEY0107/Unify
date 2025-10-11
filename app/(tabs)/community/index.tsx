import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography, shadows } from "../../../constants/theme";

import stories from './communityData';

// Add error handling for data import
const safeStories = stories || [];

const { width } = Dimensions.get("window");

export default function CommunityList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStories = safeStories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add debugging
  console.log('Community Stories loaded:', safeStories.length);

  // Add error boundary
  if (!safeStories || safeStories.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textTertiary} />
          <Text style={styles.errorTitle}>Unable to load stories</Text>
          <Text style={styles.errorSubtitle}>Please try again later</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
          <Text style={styles.storyCount}>{filteredStories.length} stories</Text>
        </View>

        {filteredStories.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No stories found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? "Try adjusting your search" : "Be the first to share your story"}
            </Text>
          </View>
        ) : (
          filteredStories.map((story) => (
            <Link key={story.id} href={`/community/read/${story.id}`} asChild>
              <TouchableOpacity style={styles.storyCard}>
                <View style={styles.storyImageContainer}>
                  <Image 
                    source={story.image || require("../../../assets/images/community.png")} 
                    style={styles.storyImage} 
                    resizeMode="cover" 
                  />
                  <View style={styles.storyOverlay}>
                    <View style={styles.readTimeContainer}>
                      <Ionicons name="time-outline" size={14} color="#FFFFFF" />
                      <Text style={styles.readTime}>3 min read</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.storyContent}>
                  <View style={styles.storyHeader}>
                    <Text style={styles.storyTitle}>{story.title}</Text>
                    <View style={styles.storyBadge}>
                      <Ionicons name="heart" size={12} color="#FF6B6B" />
                      <Text style={styles.storyBadgeText}>Inspiring</Text>
                    </View>
                  </View>
                  
                  {story.subtitle && (
                    <Text style={styles.storySubtitle}>{story.subtitle}</Text>
                  )}
                  
                  <Text style={styles.storyExcerpt} numberOfLines={3}>
                    {story.excerpt}
                  </Text>
                  
                  <View style={styles.storyFooter}>
                    <View style={styles.authorInfo}>
                      <View style={styles.authorAvatar}>
                        <Ionicons name="person" size={16} color={colors.primary} />
                      </View>
                      <Text style={styles.authorName}>{story.author || "Anonymous"}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.readMoreButton}>
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
});
