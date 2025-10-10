import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  style?: ViewStyle;
}

export default function ProgressBar({
  progress,
  height = 6,
  color = "#007AFF",
  backgroundColor = "#E5E5EA",
  showPercentage = false,
  style,
}: ProgressBarProps) {
  const getProgressColor = () => {
    if (progress === 100) return "#4CAF50";
    if (progress >= 50) return "#FF9800";
    return color;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.progressBar, { height, backgroundColor }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(100, Math.max(0, progress))}%`,
              height,
              backgroundColor: getProgressColor(),
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    borderRadius: 3,
  },
  percentageText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
    minWidth: 35,
  },
});
