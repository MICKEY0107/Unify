import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors, shadows } from "../constants/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  shadow?: "small" | "medium" | "large";
}

export default function Card({ 
  children, 
  style, 
  padding = 16, 
  shadow = "medium" 
}: CardProps) {
  return (
    <View style={[styles.card, shadows[shadow], { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
});
