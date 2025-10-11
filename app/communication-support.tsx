import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, typography, shadows } from "../constants/theme";

interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  totalLectures: number;
  completedLectures: number;
  parentSubCourseId: string;
}

export default function CommunicationSupportScreen() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for Communication Support chapters
  const mockChapters: Chapter[] = [
    {
      id: "aac-apps",
      title: "AAC Apps & Tools",
      description: "Learn about Augmentative and Alternative Communication applications",
      icon: "phone-portrait-outline",
      color: "#4ECDC4",
      progress: 60,
      totalLectures: 8,
      completedLectures: 5,
      parentSubCourseId: "communication-support"
    },
    {
      id: "sign-language",
      title: "Sign Language Basics",
      description: "Essential signs for everyday communication",
      icon: "hand-left-outline",
      color: "#FF6B6B",
      progress: 25,
      totalLectures: 12,
      completedLectures: 3,
      parentSubCourseId: "communication-support"
    },
    {
      id: "visual-supports",
      title: "Visual Supports",
      description: "Using pictures, symbols, and visual schedules",
      icon: "image-outline",
      color: "#45B7D1",
      progress: 0,
      totalLectures: 6,
      completedLectures: 0,
      parentSubCourseId: "communication-support"
    },
    {
      id: "social-communication",
      title: "Social Communication",
      description: "Building conversation skills and social interaction",
      icon: "people-outline",
      color: "#96CEB4",
      progress: 0,
      totalLectures: 10,
      completedLectures: 0,
      parentSubCourseId: "communication-support"
    }
  ];

  // Load chapters for Communication Support
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setChapters(mockChapters);
      } catch (error) {
        console.error('Error loading chapters:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChapterPress = (chapterId: string) => {
    if (chapterId === "aac-apps") {
      router.push("/aac-apps-lectures");
    }
    // Add other navigation routes as needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/autism")}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Communication Support</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Essential communication strategies for both verbal and non-verbal individuals.
          </Text>
        </View>

        {/* Chapters */}
        <View style={styles.chaptersContainer}>
          <Text style={styles.sectionTitle}>Course Chapters</Text>
          {chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter.id}
              style={[styles.chapterCard, { borderLeftColor: chapter.color }]}
              onPress={() => handleChapterPress(chapter.id)}
            >
              <View style={styles.chapterContent}>
                <View style={styles.chapterInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: `${chapter.color}20` }]}>
                    <Ionicons name={chapter.icon as any} size={24} color={chapter.color} />
                  </View>
                  <View style={styles.chapterText}>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    <Text style={styles.chapterDescription}>{chapter.description}</Text>
                  </View>
                </View>
                
                {/* Progress Section */}
                <View style={styles.progressSection}>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressText}>
                      {chapter.completedLectures}/{chapter.totalLectures} lectures
                    </Text>
                    <Text style={styles.progressPercentage}>{Math.round(chapter.progress)}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${chapter.progress}%`,
                          backgroundColor: chapter.progress === 100 ? "#4CAF50" : chapter.color,
                        },
                      ]}
                    />
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  descriptionContainer: {
    backgroundColor: colors.surface,
    margin: spacing.xl,
    padding: spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4ECDC4",
    ...shadows.small,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  chaptersContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  chapterCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    ...shadows.medium,
  },
  chapterContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chapterInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  chapterText: {
    flex: 1,
  },
  chapterTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  chapterDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  progressSection: {
    alignItems: "flex-end",
    minWidth: 120,
  },
  progressInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  progressPercentage: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
