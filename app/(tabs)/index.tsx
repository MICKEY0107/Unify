import { Ionicons } from "@expo/vector-icons";
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
import { colors, shadows, spacing, typography } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useAuth();
  const isGuest = user?.uid === 'guest';
  
  const quickActions = [
    {
      id: 1,
      title: "Behavioral Tips",
      description: "Learn respectful interaction guidelines",
      icon: "bulb-outline",
      color: colors.awareness,
      gradient: ["#FF6B6B", "#FF8E8E"],
    },
    {
      id: 2,
      title: "Sign Language",
      description: "Start learning Indian Sign Language",
      icon: "hand-left-outline",
      color: colors.signLanguage,
      gradient: ["#4ECDC4", "#6ED5D0"],
    },
    {
      id: 3,
      title: "Communication",
      description: "Improve inclusive communication",
      icon: "chatbubbles-outline",
      color: colors.communication,
      gradient: ["#45B7D1", "#6BC5D8"],
    },
    {
      id: 4,
      title: "Find Support",
      description: "Connect with NGOs and resources",
      icon: "people-outline",
      color: colors.mobility,
      gradient: ["#96CEB4", "#A8D4C1"],
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
            Welcome{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''} to Unify
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
                color="#007AFF"
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
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
});
