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

interface SubCourse {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  parentCourseId: string;
}

export default function AutismScreen() {
  const [subCourses, setSubCourses] = useState<SubCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for Autism sub-courses
  const mockSubCourses: SubCourse[] = [
    {
      id: "communication-support",
      title: "Communication Support",
      description: "Essential communication strategies for both verbal and non-verbal individuals",
      icon: "chatbubbles-outline",
      color: "#4ECDC4",
      parentCourseId: "3"
    },
    {
      id: "sensory-strategies",
      title: "Sensory Strategies",
      description: "Understanding and managing sensory sensitivities",
      icon: "eye-outline",
      color: "#FF6B6B",
      parentCourseId: "3"
    },
    {
      id: "social-skills",
      title: "Social Skills",
      description: "Building meaningful relationships and social connections",
      icon: "people-outline",
      color: "#45B7D1",
      parentCourseId: "3"
    },
    {
      id: "routine-management",
      title: "Routine Management",
      description: "Creating structure and managing transitions",
      icon: "time-outline",
      color: "#96CEB4",
      parentCourseId: "3"
    }
  ];

  // Load sub-courses for Autism
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setSubCourses(mockSubCourses);
      } catch (error) {
        console.error('Error loading sub-courses:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubCoursePress = (subCourseId: string) => {
    if (subCourseId === "communication-support") {
      router.push("/communication-support");
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
            onPress={() => router.push("/(tabs)/learning")}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Autism</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Autism is a condition that affects how a person communicates, interacts, 
            and experiences the world. People with autism may find social situations, 
            communication, or changes in routine challenging. They often have unique 
            strengths, such as strong focus, creativity, or memory.
          </Text>
        </View>

        {/* Sub Courses */}
        <View style={styles.subCoursesContainer}>
          <Text style={styles.sectionTitle}>Learning Modules</Text>
          {subCourses.map((subCourse) => (
            <TouchableOpacity
              key={subCourse.id}
              style={[styles.subCourseCard, { borderLeftColor: subCourse.color }]}
              onPress={() => handleSubCoursePress(subCourse.id)}
            >
              <View style={styles.subCourseContent}>
                <View style={styles.subCourseInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: `${subCourse.color}20` }]}>
                    <Ionicons name={subCourse.icon as any} size={24} color={subCourse.color} />
                  </View>
                  <View style={styles.subCourseText}>
                    <Text style={styles.subCourseTitle}>{subCourse.title}</Text>
                    <Text style={styles.subCourseDescription}>{subCourse.description}</Text>
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
    borderLeftColor: "#FF6B6B",
    ...shadows.small,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  subCoursesContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  subCourseCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    ...shadows.medium,
  },
  subCourseContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subCourseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  subCourseText: {
    flex: 1,
  },
  subCourseTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subCourseDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
