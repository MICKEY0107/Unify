import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { borderRadius, colors, shadows, spacing, typography } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { CommunityPost, mongoDBService } from "../../services/mongoDBService";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const isGuest = user?.uid === 'guest';
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [topStories, setTopStories] = React.useState<CommunityPost[]>([]);
  const [loadingStories, setLoadingStories] = React.useState(true);

  React.useEffect(() => {
    if (user && user.uid !== 'guest') {
      loadUserProfile();
    }
    loadTopStories();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user || user.uid === 'guest') return;
    
    try {
      const profile = await mongoDBService.getUserByUid(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadTopStories = async () => {
    try {
      setLoadingStories(true);
      const allPosts = await mongoDBService.getPosts();
      // Sort by likes and take top 3
      const sortedPosts = allPosts
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 3);
      setTopStories(sortedPosts);
    } catch (error) {
      console.error('Error loading top stories:', error);
    } finally {
      setLoadingStories(false);
    }
  };
  
  const   quickActions = [
    {
      id: 1,
      title: "Behavioral Tips",
      description: "Learn respectful interaction guidelines",
      icon: "bulb-outline",
      color: "#D4A574", // Warm golden brown
      gradient: ["#D4A574", "#E6B885"],
    },
    {
      id: 2,
      title: "Sign Language",
      description: "Start learning Indian Sign Language",
      icon: "hand-left-outline",
      color: "#8FBC8F", // Sage green
      gradient: ["#8FBC8F", "#A5C9A5"],
    },
    {
      id: 3,
      title: "Communication",
      description: "Improve inclusive communication",
      icon: "chatbubbles-outline",
      color: "#87CEEB", // Sky blue
      gradient: ["#87CEEB", "#9DD4F0"],
    },
    {
      id: 4,
      title: "Find Support",
      description: "Connect with NGOs and resources",
      icon: "people-outline",
      color: "#DDA0DD", // Plum
      gradient: ["#DDA0DD", "#E6B3E6"],
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Completed: Basic Sign Language Module 1",
      time: "2 hours ago",
      type: "learning",
    },
    {
      id: 2,
      title: "Read: Communication Etiquette Guide",
      time: "1 day ago",
      type: "tips",
    },
    {
      id: 3,
      title: "Connected with: Accessible India Foundation",
      time: "3 days ago",
      type: "ngo",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <Ionicons name="heart" size={16} color={colors.primary} />
            <Text style={styles.heroBadgeText}>Empathy in Action</Text>
          </View>
          <Text style={styles.heroTitle}>
            Welcome{userProfile?.customUsername ? `, ${userProfile.customUsername.split(' ')[0]}` : user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''} to Unify
          </Text>
          <Text style={styles.heroSubtitle}>
            Bridging Worlds, Building Empathy
          </Text>
          <Text style={styles.heroDescription}>
            Transform empathy into action through structured learning and
            practical tools for disability inclusion.
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>500+</Text>
              <Text style={styles.heroStatLabel}>Users</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>50+</Text>
              <Text style={styles.heroStatLabel}>NGOs</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>100+</Text>
              <Text style={styles.heroStatLabel}>Tips</Text>
            </View>
          </View>
        </View>
        <View style={styles.heroImage}>
          <Image
            source={require("../../assets/images/logo.svg")}
            style={styles.heroLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Top Stories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Top Stories</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/(tabs)/community')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {loadingStories ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="hourglass-outline" size={32} color={colors.primary} />
            <Text style={styles.loadingText}>Loading top stories...</Text>
          </View>
        ) : topStories.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
            {topStories.map((story, index) => (
              <TouchableOpacity
                key={story._id}
                style={[styles.storyCard, { marginRight: index === topStories.length - 1 ? 0 : spacing.md }]}
                onPress={() => router.push(`/community/read/${story._id}`)}
              >
                <View style={styles.storyImageContainer}>
                  <Image 
                    source={story.image ? { uri: story.image } : require("../../assets/images/community.png")} 
                    style={styles.storyImage} 
                    resizeMode="cover" 
                  />
                  <View style={styles.storyOverlay}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.likesBadge}>
                      <Ionicons name="heart" size={12} color="#E74C3C" />
                      <Text style={styles.likesText}>{story.likes}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.storyContent}>
                  <Text style={styles.storyTitle} numberOfLines={2}>{story.title}</Text>
                  <Text style={styles.storyExcerpt} numberOfLines={2}>
                    {story.content[0] || "Read the full story..."}
                  </Text>
                  <View style={styles.storyFooter}>
                    <View style={styles.authorInfo}>
                      <View style={styles.authorAvatar}>
                        <Ionicons name="person" size={12} color={colors.primary} />
                      </View>
                      <Text style={styles.authorName}>{story.author}</Text>
                    </View>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryText}>{story.category}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No stories yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to share your story!</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons
                name={
                  activity.type === "learning"
                    ? "book"
                    : activity.type === "tips"
                    ? "bulb"
                    : "people"
                }
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </View>
        ))}
      </View>

      {/* Progress Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>12</Text>
            <Text style={styles.progressLabel}>Tips Learned</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>3</Text>
            <Text style={styles.progressLabel}>Modules Completed</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>5</Text>
            <Text style={styles.progressLabel}>NGOs Connected</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroSection: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: 20,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    ...shadows.medium,
  },
  heroContent: {
    flex: 1,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: spacing.lg,
  },
  heroBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
    marginLeft: spacing.xs,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  heroDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  heroStat: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  heroStatNumber: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  heroStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  heroImage: {
    alignSelf: "center",
    marginTop: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  heroLogo: {
    width: 80,
    height: 80,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderTopWidth: 4,
    ...shadows.medium,
  },
  actionIcon: {
    marginBottom: spacing.md,
  },
  actionTitle: {
    ...typography.bodySmall,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  actionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.small,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...typography.bodySmall,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  activityTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-around",
    ...shadows.medium,
  },
  progressItem: {
    alignItems: "center",
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  // Top Stories Styles
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  viewAllText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
    marginRight: spacing.xs,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  storiesScroll: {
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  storyCard: {
    width: 280,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.medium,
  },
  storyImageContainer: {
    position: "relative",
    height: 160,
  },
  storyImage: {
    width: "100%",
    height: "100%",
  },
  storyOverlay: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  rankBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  rankText: {
    ...typography.caption,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  likesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  likesText: {
    ...typography.caption,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: spacing.xs,
  },
  storyContent: {
    padding: spacing.lg,
  },
  storyTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  storyExcerpt: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
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
    width: 24,
    height: 24,
    borderRadius: 12,
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
  categoryTag: {
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
});
