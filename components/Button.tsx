import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  icon,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case "primary":
        return [...baseStyle, styles.primary, disabled && styles.disabled];
      case "secondary":
        return [...baseStyle, styles.secondary, disabled && styles.disabledSecondary];
      case "outline":
        return [...baseStyle, styles.outline, disabled && styles.disabledOutline];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case "primary":
        return [...baseTextStyle, styles.primaryText, disabled && styles.disabledText];
      case "secondary":
        return [...baseTextStyle, styles.secondaryText, disabled && styles.disabledText];
      case "outline":
        return [...baseTextStyle, styles.outlineText, disabled && styles.disabledText];
      default:
        return baseTextStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={size === "small" ? 16 : size === "large" ? 24 : 20}
          color={variant === "outline" ? "#007AFF" : "#FFFFFF"}
          style={styles.icon}
        />
      )}
      <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  primary: {
    backgroundColor: "#007AFF",
  },
  secondary: {
    backgroundColor: "#8E8E93",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  disabled: {
    backgroundColor: "#C7C7CC",
  },
  disabledSecondary: {
    backgroundColor: "#C7C7CC",
  },
  disabledOutline: {
    borderColor: "#C7C7CC",
  },
  text: {
    fontWeight: "500",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#007AFF",
  },
  disabledText: {
    color: "#8E8E93",
  },
  icon: {
    marginRight: 6,
  },
});
