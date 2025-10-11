import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, shadows } from "../constants/theme";
import LectureNavigation from "../components/LectureNavigation";

interface Lecture {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
  videoUrl?: string;
  content: string;
  notes: string[];
  parentChapterId: string;
}

const { width: screenWidth } = Dimensions.get("window");

export default function LecturePlayerScreen() {
  const params = useLocalSearchParams();
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(120); // 2 minutes in seconds

  const lectureId = params.lectureId as string;
  const lectureTitle = params.lectureTitle as string;
  const totalLectures = parseInt(params.totalLectures as string);
  const completedLectures = parseInt(params.completedLectures as string);

  const progressPercentage = (completedLectures / totalLectures) * 100;
  const currentLectureNumber = parseInt(lectureId);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for lectures
  const mockLectures: Lecture[] = [
    {
      id: 1,
      title: "Introduction to AAC Apps",
      duration: "5 min",
      isCompleted: true,
      content: "This lecture covers the fundamental concepts of Augmentative and Alternative Communication (AAC) applications.",
      notes: ["Understanding AAC fundamentals", "Types of AAC applications", "Features and capabilities"],
      parentChapterId: "aac-apps"
    },
    {
      id: 2,
      title: "Choosing the Right AAC App",
      duration: "8 min",
      isCompleted: true,
      content: "Learn how to select the most appropriate AAC application based on individual needs and preferences.",
      notes: ["Selection criteria", "User assessment", "Trial periods"],
      parentChapterId: "aac-apps"
    },
    {
      id: 3,
      title: "Setting Up Your First AAC App",
      duration: "10 min",
      isCompleted: true,
      content: "Step-by-step guide to configuring and customizing your AAC application for optimal use.",
      notes: ["Initial setup", "User preferences", "Vocabulary customization"],
      parentChapterId: "aac-apps"
    },
    {
      id: 4,
      title: "Customizing Vocabulary",
      duration: "12 min",
      isCompleted: false,
      content: "Advanced techniques for personalizing vocabulary and communication boards in AAC apps.",
      notes: ["Vocabulary organization", "Symbol selection", "Personalization strategies"],
      parentChapterId: "aac-apps"
    },
    {
      id: 5,
      title: "Using Symbols and Pictures",
      duration: "7 min",
      isCompleted: false,
      content: "Understanding the role of visual symbols and pictures in AAC communication systems.",
      notes: ["Symbol systems", "Picture communication", "Visual supports"],
      parentChapterId: "aac-apps"
    },
    {
      id: 6,
      title: "Voice Output Settings",
      duration: "6 min",
      isCompleted: false,
      content: "Configuring voice output options and speech synthesis settings in AAC applications.",
      notes: ["Voice selection", "Speech rate", "Volume control"],
      parentChapterId: "aac-apps"
    },
    {
      id: 7,
      title: "Creating Communication Boards",
      duration: "15 min",
      isCompleted: false,
      content: "Design and create effective communication boards for various situations and environments.",
      notes: ["Board design", "Layout considerations", "Environmental adaptation"],
      parentChapterId: "aac-apps"
    },
    {
      id: 8,
      title: "Advanced Features and Tips",
      duration: "9 min",
      isCompleted: false,
      content: "Explore advanced features and expert tips for maximizing the effectiveness of AAC applications.",
      notes: ["Advanced features", "Expert tips", "Troubleshooting"],
      parentChapterId: "aac-apps"
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

  const handleMarkComplete = () => {
    setIsCompleted(!isCompleted);
    // Here you would typically update the backend/database
  };

  const handleLectureSelect = (lectureId: number) => {
    router.push({
      pathname: "/lecture-player",
      params: {
        lectureId: lectureId.toString(),
        lectureTitle: lectures.find(l => l.id === lectureId)?.title || "Lecture",
        totalLectures: totalLectures.toString(),
        completedLectures: completedLectures.toString(),
      }
    });
  };

  const handlePreviousLecture = () => {
    if (currentLectureNumber > 1) {
      router.push({
        pathname: "/lecture-player",
        params: {
          lectureId: (currentLectureNumber - 1).toString(),
          lectureTitle: `Lecture ${currentLectureNumber - 1}`,
          totalLectures: totalLectures.toString(),
          completedLectures: completedLectures.toString(),
        },
      });
    }
  };

  const handleNextLecture = () => {
    if (currentLectureNumber < totalLectures) {
      router.push({
        pathname: "/lecture-player",
        params: {
          lectureId: (currentLectureNumber + 1).toString(),
          lectureTitle: `Lecture ${currentLectureNumber + 1}`,
          totalLectures: totalLectures.toString(),
          completedLectures: completedLectures.toString(),
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/aac-apps-lectures")}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{lectureTitle}</Text>
            <Text style={styles.headerSubtitle}>
              Lecture {lectureId} of {totalLectures}
            </Text>
          </View>
        </View>

        {/* Lecture Navigation */}
        <LectureNavigation
          lectures={lectures}
          currentLectureId={currentLectureNumber}
          onLectureSelect={handleLectureSelect}
          totalLectures={totalLectures}
          completedLectures={completedLectures}
        />

        {/* Video Player Placeholder */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play-circle" size={80} color="#4ECDC4" />
            <Text style={styles.videoPlaceholderText}>Video Player</Text>
            <Text style={styles.videoDuration}>2:50</Text>
          </View>
          
          {/* Video Controls */}
          <View style={styles.videoControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="play" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "30%" }]} />
              </View>
              <Text style={styles.timeText}>0:45 / 2:50</Text>
            </View>
          </View>
        </View>

        {/* Lecture Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Lecture Content</Text>
          <Text style={styles.contentText}>
            {lectures.find(l => l.id === currentLectureNumber)?.content || 
             "This lecture covers the fundamental concepts of Augmentative and Alternative Communication (AAC) applications. You'll learn about the different types of AAC apps available, their features, and how to choose the right one for individual needs."}
          </Text>
          
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Key Points:</Text>
            <Text style={styles.notesText}>
              • Understanding AAC fundamentals{"\n"}
              • Types of AAC applications{"\n"}
              • Features and capabilities{"\n"}
              • Selection criteria{"\n"}
              • Implementation strategies
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              isCompleted && styles.completeButtonCompleted
            ]}
            onPress={handleMarkComplete}
          >
            <Ionicons
              name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"}
              size={24}
              color={isCompleted ? "#4CAF50" : "#4ECDC4"}
            />
            <Text style={[
              styles.completeButtonText,
              isCompleted && styles.completeButtonTextCompleted
            ]}>
              {isCompleted ? "Marked as Complete" : "Mark as Complete"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentLectureNumber === 1 && styles.navButtonDisabled
            ]}
            onPress={handlePreviousLecture}
            disabled={currentLectureNumber === 1}
          >
            <Ionicons name="chevron-back" size={20} color={currentLectureNumber === 1 ? colors.textTertiary : colors.textPrimary} />
            <Text style={[
              styles.navButtonText,
              currentLectureNumber === 1 && styles.navButtonTextDisabled
            ]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentLectureNumber === totalLectures && styles.navButtonDisabled
            ]}
            onPress={handleNextLecture}
            disabled={currentLectureNumber === totalLectures}
          >
            <Text style={[
              styles.navButtonText,
              currentLectureNumber === totalLectures && styles.navButtonTextDisabled
            ]}>
              Next
            </Text>
            <Ionicons name="chevron-forward" size={20} color={currentLectureNumber === totalLectures ? colors.textTertiary : colors.textPrimary} />
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
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  videoContainer: {
    margin: spacing.xl,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.surface,
    ...shadows.medium,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  videoPlaceholderText: {
    ...typography.h4,
    color: "#FFFFFF",
    marginTop: spacing.sm,
  },
  videoDuration: {
    ...typography.caption,
    color: "#FFFFFF",
    marginTop: 4,
  },
  videoControls: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ECDC4",
    borderRadius: 2,
  },
  timeText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  contentTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  contentText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  notesSection: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4ECDC4",
    ...shadows.small,
  },
  notesTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  notesText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4ECDC4",
    backgroundColor: "transparent",
  },
  completeButtonCompleted: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  completeButtonText: {
    ...typography.button,
    color: "#4ECDC4",
    marginLeft: spacing.sm,
  },
  completeButtonTextCompleted: {
    color: "#FFFFFF",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  navButtonDisabled: {
    backgroundColor: colors.background,
  },
  navButtonText: {
    ...typography.button,
    color: colors.textPrimary,
    marginHorizontal: spacing.sm,
  },
  navButtonTextDisabled: {
    color: colors.textTertiary,
  },
});
