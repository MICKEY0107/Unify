import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Linking,
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
      name: "National Association of the Blind (NAB)",
      description: "Leading organization for visually impaired persons in India",
      category: "visual",
      location: "New Delhi, India",
      rating: 4.8,
      reviews: 324,
      services: ["Braille Training", "Computer Training", "Employment Support", "Rehabilitation"],
      contact: "+91 11 2436 6500",
      website: "www.nabindia.org",
      verified: true,
    },
    {
      id: 2,
      name: "All India Institute of Speech and Hearing (AIISH)",
      description: "Premier institute for hearing and speech disorders",
      category: "hearing",
      location: "Mysore, Karnataka",
      rating: 4.9,
      reviews: 456,
      services: ["Hearing Assessment", "Speech Therapy", "Cochlear Implant", "Research"],
      contact: "+91 821 251 4444",
      website: "www.aiishmysore.in",
      verified: true,
    },
    {
      id: 3,
      name: "Spastics Society of India",
      description: "Comprehensive support for cerebral palsy and developmental disabilities",
      category: "mobility",
      location: "Mumbai, Maharashtra",
      rating: 4.7,
      reviews: 289,
      services: ["Physiotherapy", "Occupational Therapy", "Special Education", "Parent Training"],
      contact: "+91 22 2402 8888",
      website: "www.spasticssocietyofindia.org",
      verified: true,
    },
    {
      id: 4,
      name: "Action for Autism (AFA)",
      description: "Supporting individuals with autism spectrum disorders",
      category: "cognitive",
      location: "New Delhi, India",
      rating: 4.6,
      reviews: 198,
      services: ["Early Intervention", "Behavioral Therapy", "Parent Support", "Training Programs"],
      contact: "+91 11 4054 0991",
      website: "www.actionforautism.org",
      verified: true,
    },
    {
      id: 5,
      name: "Indian Spinal Injuries Centre (ISIC)",
      description: "Comprehensive rehabilitation for spinal cord injuries",
      category: "mobility",
      location: "New Delhi, India",
      rating: 4.8,
      reviews: 312,
      services: ["Spinal Rehabilitation", "Wheelchair Services", "Vocational Training", "Research"],
      contact: "+91 11 4225 5225",
      website: "www.isiconline.org",
      verified: true,
    },
    {
      id: 6,
      name: "National Institute for the Mentally Handicapped (NIMH)",
      description: "Research and training for intellectual disabilities",
      category: "cognitive",
      location: "Secunderabad, Telangana",
      rating: 4.5,
      reviews: 167,
      services: ["Assessment", "Training Programs", "Research", "Community Services"],
      contact: "+91 40 2775 5500",
      website: "www.nimhindia.org",
      verified: true,
    },
    {
      id: 7,
      name: "Hearing Impaired Foundation (HIF)",
      description: "Empowering deaf and hard-of-hearing community",
      category: "hearing",
      location: "Bangalore, Karnataka",
      rating: 4.4,
      reviews: 134,
      services: ["Sign Language Training", "Hearing Aid Support", "Education", "Employment"],
      contact: "+91 80 2559 3333",
      website: "www.hearingimpairedfoundation.org",
      verified: true,
    },
    {
      id: 8,
      name: "Blind People's Association (BPA)",
      description: "Comprehensive services for visually impaired persons",
      category: "visual",
      location: "Ahmedabad, Gujarat",
      rating: 4.7,
      reviews: 245,
      services: ["Education", "Rehabilitation", "Employment", "Technology Training"],
      contact: "+91 79 2755 5555",
      website: "www.bpaindia.org",
      verified: true,
    },
    {
      id: 9,
      name: "Association of People with Disability (APD)",
      description: "Holistic development of persons with disabilities",
      category: "all",
      location: "Bangalore, Karnataka",
      rating: 4.6,
      reviews: 278,
      services: ["Education", "Healthcare", "Livelihood", "Advocacy"],
      contact: "+91 80 2549 7000",
      website: "www.apd-india.org",
      verified: true,
    },
    {
      id: 10,
      name: "Cheshire Home India",
      description: "Rehabilitation and independent living for persons with disabilities",
      category: "mobility",
      location: "Multiple Locations",
      rating: 4.5,
      reviews: 189,
      services: ["Rehabilitation", "Independent Living", "Vocational Training", "Community Support"],
      contact: "+91 11 2371 2000",
      website: "www.cheshirehomeindia.org",
      verified: true,
    },
    {
      id: 11,
      name: "Down Syndrome Federation of India (DSFI)",
      description: "Supporting individuals with Down syndrome and their families",
      category: "cognitive",
      location: "Chennai, Tamil Nadu",
      rating: 4.8,
      reviews: 156,
      services: ["Early Intervention", "Education", "Therapy", "Family Support"],
      contact: "+91 44 2495 5555",
      website: "www.downsyndromeindia.org",
      verified: true,
    },
    {
      id: 12,
      name: "National Centre for Promotion of Employment for Disabled People (NCPEDP)",
      description: "Employment and economic empowerment for persons with disabilities",
      category: "all",
      location: "New Delhi, India",
      rating: 4.7,
      reviews: 203,
      services: ["Employment Support", "Skill Development", "Policy Advocacy", "Research"],
      contact: "+91 11 2649 7000",
      website: "www.ncpedp.org",
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

  const handleWebsitePress = async (website: string) => {
    try {
      // Ensure the URL has a protocol
      const url = website.startsWith('http') ? website : `https://${website}`;
      
      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Cannot Open Website",
          "Unable to open the website. Please check the URL or try again later.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error opening website:', error);
      Alert.alert(
        "Error",
        "Failed to open the website. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  const handleContactPress = (contact: string) => {
    const phoneNumber = contact.replace(/\s/g, ''); // Remove spaces
    const url = `tel:${phoneNumber}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            "Cannot Make Call",
            "Unable to make a phone call. Please copy the number and call manually.",
            [{ text: "OK" }]
          );
        }
      })
      .catch((error) => {
        console.error('Error opening phone dialer:', error);
        Alert.alert(
          "Error",
          "Failed to open phone dialer. Please try again later.",
          [{ text: "OK" }]
        );
      });
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
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => handleContactPress(ngo.contact)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Call ${ngo.contact}`}
                accessibilityHint="Opens phone dialer to call this organization"
              >
                <Ionicons name="call-outline" size={16} color="#007AFF" />
                <Text style={styles.contactText}>{ngo.contact}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => handleWebsitePress(ngo.website)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Visit ${ngo.website}`}
                accessibilityHint="Opens the organization's website in your browser"
              >
                <Ionicons name="globe-outline" size={16} color="#007AFF" />
                <Text style={styles.contactText}>{ngo.website}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ngoActions}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleContactPress(ngo.contact)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Call ${ngo.name} at ${ngo.contact}`}
                accessibilityHint="Opens phone dialer to call this organization"
              >
                <Ionicons name="call" size={16} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.websiteButton}
                onPress={() => handleWebsitePress(ngo.website)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Visit ${ngo.name} website`}
                accessibilityHint="Opens the organization's website in your browser"
              >
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
