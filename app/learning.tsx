import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function LearningScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All", icon: "grid-outline" },
    { id: "sign-language", name: "Sign Language", icon: "hand-left-outline" },
    { id: "communication", name: "Communication", icon: "chatbubbles-outline" },
    { id: "awareness", name: "Awareness", icon: "bulb-outline" },
  ];

  const learningModules = [
    {
      id: 1,
      title: "Indian Sign Language Basics",
      description: "Learn fundamental ISL gestures and expressions",
      category: "sign-language",
      duration: "2 hours",
      progress: 75,
      level: "Beginner",
      lessons: 12,
      completed: 9,
    },
    {
      id: 2,
      title: "Communication Etiquette",
      description: "Master respectful interaction guidelines",
      category: "communication",
      duration: "1.5 hours",
      progress: 100,
      level: "Beginner",
      lessons: 8,
      completed: 8,
    },
    {
      id: 3,
      title: "Disability Awareness",
      description: "Understanding different types of disabilities",
      category: "awareness",
      duration: "3 hours",
      progress: 40,
      level: "Intermediate",
      lessons: 15,
      completed: 6,
    },
    {
      id: 4,
      title: "Assistive Communication",
      description: "Tools and techniques for better communication",
      category: "communication",
      duration: "2.5 hours",
      progress: 0,
      level: "Intermediate",
      lessons: 10,
      completed: 0,
    },
    {
      id: 5,
      title: "Advanced ISL",
      description: "Complex gestures and conversation skills",
      category: "sign-language",
      duration: "4 hours",
      progress: 0,
      level: "Advanced",
      lessons: 20,
      completed: 0,
    },
  ];

  const filteredModules = selectedCategory === "all" 
    ? learningModules 
    : learningModules.filter(module => module.category === selectedCategory);

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "#4CAF50";
    if (progress >= 50) return "#FF9800";
    return "#FF6B6B";
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning Center</Text>
        <Text style={styles.headerSubtitle}>
          Build skills for inclusive communication
        </Text>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={20}
                color={selectedCategory === category.id ? "#FFFFFF" : "#007AFF"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Learning Modules */}
      <View style={styles.modulesContainer}>
        {filteredModules.map((module) => (
          <TouchableOpacity key={module.id} style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleDescription}>{module.description}</Text>
              </View>
              <View style={styles.moduleBadge}>
                <Text style={styles.moduleLevel}>{module.level}</Text>
              </View>
            </View>

            <View style={styles.moduleStats}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="#8E8E93" />
                <Text style={styles.statText}>{module.duration}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="book-outline" size={16} color="#8E8E93" />
                <Text style={styles.statText}>
                  {module.completed}/{module.lessons} lessons
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${module.progress}%`,
                      backgroundColor: getProgressColor(module.progress),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{module.progress}%</Text>
            </View>

            <View style={styles.moduleActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  module.progress === 100
                    ? styles.actionButtonCompleted
                    : styles.actionButtonPrimary,
                ]}
              >
                <Ionicons
                  name={module.progress === 100 ? "checkmark" : "play"}
                  size={16}
                  color="#FFFFFF"
                />
                <Text style={styles.actionButtonText}>
                  {module.progress === 100 ? "Completed" : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>Quick Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#FFD700" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Daily Practice</Text>
            <Text style={styles.tipDescription}>
              Practice sign language for 10 minutes daily to improve retention
            </Text>
          </View>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="people" size={24} color="#4CAF50" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Community Learning</Text>
            <Text style={styles.tipDescription}>
              Join our community to practice with others and get feedback
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  categoriesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "#FFFFFF",
  },
  categoryButtonActive: {
    backgroundColor: "#007AFF",
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  modulesContainer: {
    paddingHorizontal: 20,
  },
  moduleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  moduleInfo: {
    flex: 1,
    marginRight: 12,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
  },
  moduleBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moduleLevel: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "500",
  },
  moduleStats: {
    flexDirection: "row",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#8E8E93",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E5EA",
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
  moduleActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonPrimary: {
    backgroundColor: "#007AFF",
  },
  actionButtonCompleted: {
    backgroundColor: "#4CAF50",
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  tipsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    color: "#666666",
    lineHeight: 16,
  },
});
