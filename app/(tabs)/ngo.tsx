import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { colors, shadows, spacing, typography } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function NGOScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All", icon: "grid-outline" },
    { id: "visual", name: "Visual", icon: "eye-outline" },
    { id: "hearing", name: "Hearing", icon: "ear-outline" },
    { id: "mobility", name: "Mobility", icon: "walk-outline" },
    { id: "cognitive", name: "Cognitive", icon: "brain-outline" },
  ];

  const ngoOrganizations = [
    {
      id: 1,
      name: "Accessible India Foundation",
      description: "Comprehensive support for accessibility and inclusion",
      category: "all",
      location: "New Delhi, India",
      rating: 4.8,
      reviews: 124,
      services: ["Accessibility Audits", "Training", "Advocacy"],
      contact: "+91 11 2345 6789",
      website: "www.accessibleindia.org",
      verified: true,
    },
    {
      id: 2,
      name: "National Association of the Deaf",
      description: "Supporting deaf and hard-of-hearing community",
      category: "hearing",
      location: "Mumbai, India",
      rating: 4.6,
      reviews: 89,
      services: ["Sign Language Training", "Employment Support", "Legal Aid"],
      contact: "+91 22 9876 5432",
      website: "www.nadindia.org",
      verified: true,
    },
    {
      id: 3,
      name: "Blind Relief Association",
      description: "Empowering visually impaired individuals",
      category: "visual",
      location: "Bangalore, India",
      rating: 4.7,
      reviews: 156,
      services: ["Braille Training", "Mobility Training", "Technology Support"],
      contact: "+91 80 1234 5678",
      website: "www.blindrelief.org",
      verified: true,
    },
    {
      id: 4,
      name: "Wheelchair Foundation India",
      description: "Mobility solutions and support services",
      category: "mobility",
      location: "Chennai, India",
      rating: 4.5,
      reviews: 67,
      services: ["Wheelchair Distribution", "Repair Services", "Training"],
      contact: "+91 44 8765 4321",
      website: "www.wheelchairindia.org",
      verified: false,
    },
    {
      id: 5,
      name: "Autism Society of India",
      description: "Supporting individuals with autism and their families",
      category: "cognitive",
      location: "Pune, India",
      rating: 4.9,
      reviews: 203,
      services: ["Early Intervention", "Therapy", "Parent Support"],
      contact: "+91 20 3456 7890",
      website: "www.autismindia.org",
      verified: true,
    },
    {
      id: 6,
      name: "Spinal Cord Injury Foundation",
      description: "Rehabilitation and support for spinal cord injuries",
      category: "mobility",
      location: "Hyderabad, India",
      rating: 4.4,
      reviews: 45,
      services: ["Rehabilitation", "Counseling", "Equipment Support"],
      contact: "+91 40 5678 9012",
      website: "www.sciindia.org",
      verified: true,
    },
  ];

  const filteredNGOs = ngoOrganizations.filter((ngo) => {
    const matchesCategory = selectedCategory === "all" || ngo.category === selectedCategory;
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "#4CAF50";
    if (rating >= 4.0) return "#FF9800";
    return "#FF6B6B";
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NGO Directory</Text>
        <Text style={styles.headerSubtitle}>
          Connect with verified support organizations
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search NGOs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
        </View>
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
                size={18}
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

      {/* NGO Cards */}
      <View style={styles.ngosContainer}>
        {filteredNGOs.map((ngo) => (
          <TouchableOpacity key={ngo.id} style={styles.ngoCard}>
            <View style={styles.ngoHeader}>
              <View style={styles.ngoInfo}>
                <View style={styles.ngoTitleRow}>
                  <Text style={styles.ngoName}>{ngo.name}</Text>
                  {ngo.verified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    </View>
                  )}
                </View>
                <Text style={styles.ngoDescription}>{ngo.description}</Text>
                <View style={styles.ngoLocation}>
                  <Ionicons name="location-outline" size={14} color="#8E8E93" />
                  <Text style={styles.locationText}>{ngo.location}</Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={[styles.rating, { color: getRatingColor(ngo.rating) }]}>
                    {ngo.rating}
                  </Text>
                </View>
                <Text style={styles.reviewsText}>({ngo.reviews} reviews)</Text>
              </View>
            </View>

            <View style={styles.servicesContainer}>
              <Text style={styles.servicesTitle}>Services:</Text>
              <View style={styles.servicesList}>
                {ngo.services.map((service, index) => (
                  <View key={index} style={styles.serviceTag}>
                    <Text style={styles.serviceText}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.contactContainer}>
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={16} color="#007AFF" />
                <Text style={styles.contactText}>{ngo.contact}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="globe-outline" size={16} color="#007AFF" />
                <Text style={styles.contactText}>{ngo.website}</Text>
              </View>
            </View>

            <View style={styles.ngoActions}>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call" size={16} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.websiteButton}>
                <Ionicons name="globe" size={16} color="#007AFF" />
                <Text style={styles.websiteButtonText}>Website</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Directory Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{ngoOrganizations.length}</Text>
            <Text style={styles.statLabel}>Total NGOs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {ngoOrganizations.filter(ngo => ngo.verified).length}
            </Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.7</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1A1A1A",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  ngosContainer: {
    paddingHorizontal: 20,
  },
  ngoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  ngoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  ngoInfo: {
    flex: 1,
    marginRight: 12,
  },
  ngoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ngoName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginRight: 8,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  ngoDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 8,
  },
  ngoLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#8E8E93",
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  reviewsText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  servicesContainer: {
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  servicesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  serviceTag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "500",
  },
  contactContainer: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#007AFF",
  },
  ngoActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  contactButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  websiteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
  },
  websiteButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
});
