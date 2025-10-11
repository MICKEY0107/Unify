import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { borderRadius, colors, shadows, spacing, typography } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { imgBBService } from "../../../services/imgBBService";
import { mongoDBService, UserProfile } from "../../../services/mongoDBService";

const { width } = Dimensions.get("window");

export default function CommunityPost() {
  const router = useRouter();
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    if (user && user.uid !== 'guest') {
      loadUserProfile();
    } else if (user) {
      setAuthorName(user.displayName || user.email || "Anonymous");
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user || user.uid === 'guest') return;
    
    try {
      setIsLoadingProfile(true);
      const profile = await mongoDBService.getUserByUid(user.uid);
      if (profile) {
        setUserProfile(profile);
        setAuthorName(profile.customUsername || profile.displayName || user.displayName || "Anonymous");
      } else {
        // Fallback to auth user data if no profile
        setAuthorName(user.displayName || user.email || "Anonymous");
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback to auth user data on error
      setAuthorName(user.displayName || user.email || "Anonymous");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const categories = [
    "Communication", "Physical & Mobility", "Cognitive & Learning", 
    "Visual", "Hearing", "Mental Health", "General"
  ];

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Permission to access media library is required to upload images. Please enable it in your device settings.'
        );
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ['images'], 
        quality: 0.8,
        allowsEditing: true,
        aspect: [16, 9]
      });
      
      if (!res.canceled && res.assets?.length) {
        setImage(res.assets[0].uri);
      }
    } catch (err) {
      console.warn('Image picker error', err);
      Alert.alert('Image picker error', String(err));
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Permission to access camera is required to take photos. Please enable it in your device settings.'
        );
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [16, 9]
      });
      
      if (!res.canceled && res.assets?.length) {
        setImage(res.assets[0].uri);
      }
    } catch (err) {
      console.warn('Camera error', err);
      Alert.alert('Camera error', String(err));
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Add Image",
      "Choose how you'd like to add an image to your story",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Photo Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Missing Information", "Please fill in the title and story content.");
      return;
    }

    if (!category) {
      Alert.alert("Missing Category", "Please select a category for your story.");
      return;
    }

    if (!user) {
      Alert.alert("Authentication Required", "Please sign in to create a post.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload image if provided (mirror profile logic)
      let imageUrl = image;
      if (image && !image.startsWith('http')) {
        try {
          console.log('Uploading cover image to ImgBB...');
          imageUrl = await imgBBService.uploadImageFromUri(image);
          console.log('Cover image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Error uploading cover image:', uploadError);
          Alert.alert('Upload Error', 'Failed to upload cover image. Post will be created without image.');
          imageUrl = null;
        }
      }

      // Split body into paragraphs
      const content = body.trim().split('\n').filter(paragraph => paragraph.trim().length > 0);
      
      const postData = {
        _id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        content,
        image: imageUrl || undefined,
        author: userProfile?.customUsername || authorName,
        authorId: user.uid,
        authorCustomUsername: userProfile?.customUsername,
        authorProfileImage: userProfile?.profileImageUrl,
        category,
      };

      await mongoDBService.createPost(postData);
      
      // Navigate back immediately after successful creation
      router.push('/(tabs)/community');
      
      // Show success message after navigation
      Alert.alert(
        "Story Published!",
        "Your inspiring story has been shared with the community. Thank you for contributing!"
      );
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(
        "Error",
        "Failed to publish your story. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = title.trim() && body.trim();

  return (
    <View style={styles.modalContainer}>
      {/* Close Button */}
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => router.push('/(tabs)/community')}
      >
        <Ionicons name="close" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Share Your Story</Text>
        </View>

      {/* Profile Loading Indicator */}
      {isLoadingProfile && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      )}

      {/* Form */}
      <View style={styles.form}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Add a Cover Image</Text>
          <Text style={styles.sectionSubtitle}>Help your story stand out with a meaningful image</Text>
          
          <TouchableOpacity style={styles.imageUpload} onPress={showImageOptions}>
            {image ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: image }} style={styles.uploadedImage} />
                <TouchableOpacity 
                  style={styles.removeImage}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="camera" size={48} color={colors.textTertiary} />
                <Text style={styles.uploadText}>Tap to add image</Text>
                <Text style={styles.uploadSubtext}>Camera or Photo Library</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Story Title *</Text>
          <TextInput
            style={styles.inputTitle}
            placeholder="What's the main message of your story?"
            placeholderTextColor={colors.textTertiary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.characterCount}>{title.length}/100</Text>
        </View>

        {/* Subtitle Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Subtitle (Optional)</Text>
          <TextInput
            style={styles.inputSubtitle}
            placeholder="A brief description or tagline"
            placeholderTextColor={colors.textTertiary}
            value={subtitle}
            onChangeText={setSubtitle}
            maxLength={150}
          />
          <Text style={styles.characterCount}>{subtitle.length}/150</Text>
        </View>

        {/* Category Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipSelected
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryChipText,
                  category === cat && styles.categoryChipTextSelected
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Story Content */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Your Story *</Text>
          <Text style={styles.inputHelper}>
            Share your experience, challenges overcome, or insights gained. Your story can inspire others!
          </Text>
          <TextInput
            style={styles.inputBody}
            placeholder="Tell us about your journey... What challenges did you face? How did you overcome them? What did you learn? Your story matters and can help others facing similar situations."
            placeholderTextColor={colors.textTertiary}
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>{body.length} characters</Text>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelinesSection}>
          <Text style={styles.guidelinesTitle}>Community Guidelines</Text>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.guidelineText}>Be respectful and supportive</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.guidelineText}>Share authentic experiences</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.guidelineText}>Focus on inspiration and hope</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submittingContainer}>
              <Ionicons name="hourglass-outline" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Publishing...</Text>
            </View>
          ) : (
            <View style={styles.submitContainer}>
              <Ionicons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Publish Story</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  form: {
    padding: spacing.lg,
  },
  imageSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  imageUpload: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  imagePreview: {
    position: "relative",
  },
  uploadedImage: {
    width: "100%",
    height: 200,
    borderRadius: borderRadius.lg,
  },
  removeImage: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
  },
  uploadPlaceholder: {
    height: 200,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    ...typography.body,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  uploadSubtext: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  inputSection: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  inputHelper: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  inputSubtitle: {
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  inputBody: {
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 120,
  },
  characterCount: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  categoryScroll: {
    marginTop: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
  },
  guidelinesSection: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guidelinesTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  guidelineText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    ...shadows.medium,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textTertiary,
    opacity: 0.6,
  },
  submitContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  submittingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButtonText: {
    ...typography.button,
    color: "#FFFFFF",
    marginLeft: spacing.sm,
  },
});
