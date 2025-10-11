import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, shadows, spacing, typography } from "../constants/theme";

interface Lecture {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
}

export default function AACAppsLecturesScreen() {
  const [completedLectures, setCompletedLectures] = useState([1, 2, 3]); // 3/8 completed
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for AAC Apps lectures
  const mockLectures: Lecture[] = [
    {
      id: 1,
      title: "Introduction to AAC Apps",
      duration: "5 min",
      isCompleted: true
    },
    {
      id: 2,
      title: "Choosing the Right AAC App",
      duration: "8 min",
      isCompleted: true
    },
    {
      id: 3,
      title: "Setting Up Your First AAC App",
      duration: "10 min",
      isCompleted: true
    },
    {
      id: 4,
      title: "Customizing Vocabulary",
      duration: "12 min",
      isCompleted: false
    },
    {
      id: 5,
      title: "Using Symbols and Pictures",
      duration: "7 min",
      isCompleted: false
    },
    {
      id: 6,
      title: "Voice Output Settings",
      duration: "6 min",
      isCompleted: false
    },
    {
      id: 7,
      title: "Creating Communication Boards",
      duration: "15 min",
      isCompleted: false
    },
    {
      id: 8,
      title: "Advanced Features and Tips",
      duration: "9 min",
      isCompleted: false
    }
  ];

  // Load lectures for AAC Apps chapter
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setLectures(mockLectures);
      } catch (error) {
        console.error('Error loading lectures:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLecturePress = (lectureId: number) => {
    router.push({
      pathname: "/lecture-player",
      params: {
        lectureId: lectureId.toString(),
        lectureTitle: lectures.find(l => l.id === lectureId)?.title || "Lecture",
        totalLectures: totalLectures.toString(),
        completedLectures: completedCount.toString(),
      }
    });
  };

  const totalLectures = lectures.length;
  const completedCount = completedLectures.length;
  const progressPercentage = (completedCount / totalLectures) * 100;

  const handleMarkComplete = (lectureId: number) => {
    if (completedLectures.includes(lectureId)) {
      setCompletedLectures(completedLectures.filter(id => id !== lectureId));
    } else {
      setCompletedLectures([...completedLectures, lectureId]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/communication-support")}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Using AAC Apps</Text>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Course Progress</Text>
            <Text style={styles.progressStats}>
              {completedCount}/{totalLectures} chapters completed
            </Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: progressPercentage === 100 ? "#4CAF50" : "#4ECDC4",
                  },
                ]}
              />
            </View>
            <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
          </View>
        </View>

        {/* Lectures List */}
        <View style={styles.lecturesContainer}>
          <Text style={styles.sectionTitle}>LECTURES ({totalLectures})</Text>
          {lectures.map((lecture, index) => (
            <TouchableOpacity
              key={lecture.id}
              style={[
                styles.lectureCard,
                lecture.isCompleted && styles.lectureCardCompleted,
              ]}
              onPress={() => handleLecturePress(lecture.id)}
            >
              <View style={styles.lectureContent}>
                <View style={styles.lectureInfo}>
                  <View style={styles.lectureNumber}>
                    <Text style={[
                      styles.lectureNumberText,
                      lecture.isCompleted && styles.lectureNumberCompleted
                    ]}>
                      {lecture.id}
                    </Text>
                  </View>
                  
                  <View style={styles.lectureDetails}>
                    <Text style={[
                      styles.lectureTitle,
                      lecture.isCompleted && styles.lectureTitleCompleted
                    ]}>
                      {lecture.title}
                    </Text>
                    <Text style={styles.lectureDuration}>{lecture.duration}</Text>
                  </View>
                </View>

                <View style={styles.lectureActions}>
                  {lecture.isCompleted ? (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={() => handleLecturePress(lecture.id)}
                    >
                      <Ionicons name="play-circle-outline" size={24} color="#4ECDC4" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Course Button */}
        <View style={styles.continueContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              progressPercentage === 100 && styles.continueButtonCompleted
            ]}
            onPress={() => {
              // Navigate to next incomplete lecture or course completion
              const nextIncomplete = lectures.find(lecture => !lecture.isCompleted);
              if (nextIncomplete) {
                handleLecturePress(nextIncomplete.id);
              }
            }}
          >
            <Ionicons
              name={progressPercentage === 100 ? "checkmark" : "play"}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.continueButtonText}>
              {progressPercentage === 100 ? "Course Completed" : "Continue Course"}
            </Text>
          </TouchableOpacity>
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
  progressContainer: {
    backgroundColor: colors.surface,
    margin: spacing.xl,
    padding: spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4ECDC4",
    ...shadows.small,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  progressTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  progressStats: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginRight: spacing.md,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressPercentage: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  lecturesContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  lectureCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: "#4ECDC4",
    ...shadows.small,
  },
  lectureCardCompleted: {
    backgroundColor: "#F8F9FA",
    borderLeftColor: "#4CAF50",
  },
  lectureContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lectureInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  lectureNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  lectureNumberCompleted: {
    //backgroundColor: "#4CAF50",
  },
  lectureNumberText: {
    ...typography.caption,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  lectureDetails: {
    flex: 1,
  },
  lectureTitle: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  lectureTitleCompleted: {
    color: colors.textSecondary,
    textDecorationLine: "line-through",
  },
  lectureDuration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  lectureActions: {
    marginLeft: spacing.md,
  },
  completedBadge: {
    // Styling for completed state
  },
  playButton: {
    // Styling for play button
  },
  continueContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  continueButton: {
    backgroundColor: "#4ECDC4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    ...shadows.medium,
  },
  continueButtonCompleted: {
    backgroundColor: "#4CAF50",
  },
  continueButtonText: {
    ...typography.button,
    color: "#FFFFFF",
    marginLeft: spacing.sm,
  },
});
