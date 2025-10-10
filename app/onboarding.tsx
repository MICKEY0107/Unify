import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { colors, spacing, typography } from "../constants/theme";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "Welcome to Unify",
    subtitle: "Bridging Worlds, Building Empathy",
    description: "Transform empathy into action through structured learning and practical tools for disability inclusion.",
    icon: "heart",
    color: colors.primary,
  },
  {
    id: 2,
    title: "Learn & Grow",
    subtitle: "Structured Skill-Building",
    description: "Interactive learning modules in disability awareness, communication etiquette, and Indian Sign Language (ISL).",
    icon: "book",
    color: colors.signLanguage,
  },
  {
    id: 3,
    title: "Connect & Support",
    subtitle: "Centralized Support Network",
    description: "A curated directory of NGOs and support organizations, connecting you directly to vetted help and resources.",
    icon: "people",
    color: colors.communication,
  },
  {
    id: 4,
    title: "Assistive Tools",
    subtitle: "Integrated Communication",
    description: "In-app features like text-to-speech and AI-powered Chatbot to facilitate communication and provide support.",
    icon: "accessibility",
    color: colors.awareness,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const skipOnboarding = () => {
    router.replace("/login");
  };

  const currentSlide = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: currentSlide.color + "20" }]}>
          <Ionicons name={currentSlide.icon as any} size={80} color={currentSlide.color} />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
                { backgroundColor: index === currentIndex ? currentSlide.color : colors.border },
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.prevButton} onPress={prevSlide}>
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
              <Text style={styles.prevText}>Previous</Text>
            </TouchableOpacity>
          )}

          <View style={styles.nextButtonContainer}>
            {currentIndex === onboardingData.length - 1 ? (
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: currentSlide.color }]}
                onPress={skipOnboarding}
              >
                <Text style={styles.nextText}>Get Started</Text>
                <Ionicons name="checkmark" size={20} color={colors.textInverse} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: currentSlide.color }]}
                onPress={nextSlide}
              >
                <Text style={styles.nextText}>Next</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textInverse} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: spacing.xl,
    zIndex: 1,
  },
  skipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xxxl,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.h3,
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  bottomSection: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.xxxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: spacing.xs,
  },
  activeDot: {
    width: 24,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prevButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  prevText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  nextButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: "center",
  },
  nextText: {
    ...typography.button,
    color: colors.textInverse,
    marginRight: spacing.xs,
  },
});
