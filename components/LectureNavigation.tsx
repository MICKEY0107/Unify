import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, shadows } from "../constants/theme";

interface Lecture {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
}

interface LectureNavigationProps {
  lectures: Lecture[];
  currentLectureId: number;
  onLectureSelect: (lectureId: number) => void;
  totalLectures: number;
  completedLectures: number;
}

export default function LectureNavigation({
  lectures,
  currentLectureId,
  onLectureSelect,
  totalLectures,
  completedLectures,
}: LectureNavigationProps) {
  const progressPercentage = (completedLectures / totalLectures) * 100;

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>
          {completedLectures}/{totalLectures} lectures completed
        </Text>
        <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
      </View>
      
      {/* Progress Bar */}
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
      </View>

      {/* Lecture Navigation Icons */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.lectureScrollView}
        contentContainerStyle={styles.lectureContainer}
      >
        {lectures.map((lecture) => (
          <TouchableOpacity
            key={lecture.id}
            style={[
              styles.lectureIcon,
              currentLectureId === lecture.id && styles.lectureIconActive,
              lecture.isCompleted && styles.lectureIconCompleted,
            ]}
            onPress={() => onLectureSelect(lecture.id)}
          >
            <View style={styles.lectureIconContent}>
              <Ionicons
                name={
                  lecture.isCompleted
                    ? "checkmark-circle"
                    : currentLectureId === lecture.id
                    ? "play-circle"
                    : "play-circle-outline"
                }
                size={20}
                color={
                  lecture.isCompleted
                    ? "#4CAF50"
                    : currentLectureId === lecture.id
                    ? "#FFFFFF"
                    : "#4ECDC4"
                }
              />
              <Text
                style={[
                  styles.lectureNumber,
                  currentLectureId === lecture.id && styles.lectureNumberActive,
                  lecture.isCompleted && styles.lectureNumberCompleted,
                ]}
              >
                {lecture.id}
              </Text>
            </View>
            <Text
              style={[
                styles.lectureTitle,
                currentLectureId === lecture.id && styles.lectureTitleActive,
              ]}
              numberOfLines={1}
            >
              {lecture.title}
            </Text>
            <Text style={styles.lectureDuration}>{lecture.duration}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.small,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  progressTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  progressPercentage: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  progressBarContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  lectureScrollView: {
    maxHeight: 120,
  },
  lectureContainer: {
    paddingRight: spacing.lg,
  },
  lectureIcon: {
    alignItems: "center",
    marginRight: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.background,
    minWidth: 80,
    ...shadows.small,
  },
  lectureIconActive: {
    backgroundColor: "#4ECDC4",
  },
  lectureIconCompleted: {
    backgroundColor: "#F0F9F0",
  },
  lectureIconContent: {
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  lectureNumber: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
    marginTop: 2,
  },
  lectureNumberActive: {
    color: "#FFFFFF",
  },
  lectureNumberCompleted: {
    color: "#4CAF50",
  },
  lectureTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 10,
    marginBottom: 2,
  },
  lectureTitleActive: {
    color: "#FFFFFF",
  },
  lectureDuration: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 9,
  },
});
