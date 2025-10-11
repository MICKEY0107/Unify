import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  InteractionManager,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MarkdownText from "../components/MarkdownText";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { googleAIService } from "../services/googleAIService";
import { FavoriteText } from "../services/storageService";

const { width } = Dimensions.get("window");

export default function AssistiveScreen() {
  // TTS Hook
  const {
    speak,
    speakLongText,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isLoading,
    isInitialized,
    error,
    currentText,
    voices,
    currentVoice,
    setVoice,
    speechRate,
    setSpeechRate,
    speechPitch,
    setSpeechPitch,
    favorites,
    saveFavorite,
    deleteFavorite,
    settings,
    updateSettings,
    clearError,
    getPlatformCapabilities,
    refreshVoices,
  } = useTextToSpeech();

  // Local state
  const [textToSpeech, setTextToSpeech] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteTitle, setFavoriteTitle] = useState("");
  const [showSaveFavorite, setShowSaveFavorite] = useState(false);

  // SOS Emergency functionality
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosTimer, setSosTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const [sosNumber, setSosNumber] = useState("9315274121"); // Default SOS number
  const [showSOSSettings, setShowSOSSettings] = useState(false);
  const [newSOSNumber, setNewSOSNumber] = useState("");
  const [isSavingSOS, setIsSavingSOS] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Voice filtering state
  const [voiceSearchQuery, setVoiceSearchQuery] = useState("");
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState("all");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("all");
  const [chatbotMessage, setChatbotMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: "bot",
      message: "Hello! I'm your AI assistant for disability awareness and mental health support. I'm here to help you learn about accessibility, inclusion, and provide guidance on various topics related to disabilities. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Platform capabilities
  const capabilities = getPlatformCapabilities();

  // Second-chance initialization when screen gains focus and after interactions
  useFocusEffect(
    React.useCallback(() => {
      // If not initialized on first mount via hook, attempt a post-focus recovery
      if (!isInitialized) {
        InteractionManager.runAfterInteractions(async () => {
          try {
            // Re-run voices load which internally ensures service is initialized
            await refreshVoices();
          } catch (e) {
            // Intentionally swallow; UI already shows error state via hook
          }
        });
      }
      return () => { };
    }, [isInitialized, refreshVoices])
  );

  // Voice filtering helpers
  const getUniqueLanguages = () => {
    const languages = new Set<string>();
    voices.forEach(voice => {
      // Extract language code (e.g., "en-US" -> "en")
      const langCode = voice.language.split('-')[0];
      languages.add(langCode);
    });
    return Array.from(languages).sort();
  };

  const getUniqueRegions = () => {
    const regions = new Set<string>();
    voices.forEach(voice => {
      // Extract region code (e.g., "en-US" -> "US")
      const parts = voice.language.split('-');
      if (parts.length > 1) {
        regions.add(parts[1]);
      }
    });
    return Array.from(regions).sort();
  };

  const getLanguageName = (langCode: string) => {
    const languageNames: { [key: string]: string } = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'da': 'Danish',
      'no': 'Norwegian',
      'fi': 'Finnish',
      'pl': 'Polish',
      'tr': 'Turkish',
      'he': 'Hebrew',
    };
    return languageNames[langCode] || langCode.toUpperCase();
  };

  const getRegionName = (regionCode: string) => {
    const regionNames: { [key: string]: string } = {
      'US': 'United States',
      'GB': 'United Kingdom',
      'AU': 'Australia',
      'CA': 'Canada',
      'IN': 'India',
      'IE': 'Ireland',
      'ZA': 'South Africa',
      'ES': 'Spain',
      'MX': 'Mexico',
      'AR': 'Argentina',
      'FR': 'France',
      'DE': 'Germany',
      'IT': 'Italy',
      'BR': 'Brazil',
      'PT': 'Portugal',
      'RU': 'Russia',
      'JP': 'Japan',
      'KR': 'South Korea',
      'CN': 'China',
      'TW': 'Taiwan',
      'HK': 'Hong Kong',
      'TH': 'Thailand',
      'VN': 'Vietnam',
      'NL': 'Netherlands',
      'SE': 'Sweden',
      'DK': 'Denmark',
      'NO': 'Norway',
      'FI': 'Finland',
      'PL': 'Poland',
      'TR': 'Turkey',
      'IL': 'Israel',
    };
    return regionNames[regionCode] || regionCode;
  };

  const filteredVoices = voices.filter(voice => {
    // Search query filter
    if (voiceSearchQuery) {
      const query = voiceSearchQuery.toLowerCase();
      const matchesName = voice.name.toLowerCase().includes(query);
      const matchesLanguage = voice.language.toLowerCase().includes(query);
      const matchesLangName = getLanguageName(voice.language.split('-')[0]).toLowerCase().includes(query);
      if (!matchesName && !matchesLanguage && !matchesLangName) {
        return false;
      }
    }

    // Language filter
    if (selectedLanguageFilter !== "all") {
      const voiceLangCode = voice.language.split('-')[0];
      if (voiceLangCode !== selectedLanguageFilter) {
        return false;
      }
    }

    // Region filter
    if (selectedRegionFilter !== "all") {
      const voiceRegionCode = voice.language.split('-')[1];
      if (voiceRegionCode !== selectedRegionFilter) {
        return false;
      }
    }

    return true;
  });

  // Refs for focus management
  const textInputRef = useRef<TextInput>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (error) {
      // Announce error to screen readers
      console.log(`TTS Error: ${error}`);
    }
  }, [error]);


  const quickTips = [
    {
      id: 1,
      title: "Communication Tips",
      tip: "Speak clearly and at a normal pace when communicating with someone who has hearing difficulties.",
    },
    {
      id: 2,
      title: "Visual Accessibility",
      tip: "Use high contrast colors and large fonts for better readability.",
    },
    {
      id: 3,
      title: "Mobility Support",
      tip: "Always ask before offering assistance to someone with mobility challenges.",
    },
  ];

  // Input validation
  const validateTextInput = (text: string): { isValid: boolean; error?: string } => {
    if (!text || !text.trim()) {
      return { isValid: false, error: "Please enter some text to speak" };
    }

    if (text.length > 4000) {
      return { isValid: false, error: "Text is too long. Maximum 4000 characters allowed." };
    }

    // Check for potentially problematic characters
    const problematicChars = /[^\w\s.,!?;:'"()\-\n\r]/g;
    if (problematicChars.test(text)) {
      console.warn("Text contains special characters that may affect speech quality");
    }

    return { isValid: true };
  };

  // Enhanced TTS Handlers
  const handleSpeak = async () => {
    const validation = validateTextInput(textToSpeech);
    if (!validation.isValid) {
      Alert.alert("Input Error", validation.error || "Invalid text input");
      return;
    }

    if (!isInitialized) {
      Alert.alert("Not Ready", "Text-to-speech is still initializing. Please wait a moment and try again.");
      return;
    }

    try {
      clearError();

      if (textToSpeech.length > 1000) {
        await speakLongText(textToSpeech);
      } else {
        await speak(textToSpeech);
      }
    } catch (err) {
      console.error("Speech failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      Alert.alert("Speech Error", errorMessage);
    }
  };

  const proceedWithSpeech = async () => {
    try {
      if (textToSpeech.length > 1000) {
        await speakLongText(textToSpeech);
      } else {
        await speak(textToSpeech);
      }
    } catch (err) {
      throw err; // Re-throw to be handled by caller
    }
  };

  const handleStop = () => {
    stop();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleSaveFavorite = async () => {
    const validation = validateTextInput(textToSpeech);
    if (!validation.isValid) {
      Alert.alert("Cannot Save", validation.error || "Invalid text input");
      return;
    }

    // Validate title if provided
    if (favoriteTitle && favoriteTitle.length > 100) {
      Alert.alert("Title Too Long", "Favorite title must be 100 characters or less");
      return;
    }

    try {
      await saveFavorite(textToSpeech, favoriteTitle || undefined);
      setShowSaveFavorite(false);
      setFavoriteTitle("");

      // Announce success to screen readers
      Alert.alert("Success", "Text saved to favorites!");

      // Optional: Clear the text input after saving
      // setTextToSpeech("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save favorite";
      Alert.alert("Save Failed", errorMessage);
      console.error("Failed to save favorite:", err);
    }
  };

  const handleSelectFavorite = (favorite: FavoriteText) => {
    setTextToSpeech(favorite.text);
    setShowFavorites(false);
  };

  const handleDeleteFavorite = async (id: string) => {
    // Find the favorite to show confirmation
    const favorite = favorites.find(f => f.id === id);
    const favoriteTitle = favorite?.title || "this favorite";

    Alert.alert(
      "Delete Favorite",
      `Are you sure you want to delete "${favoriteTitle}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFavorite(id);
              // Success feedback for screen readers
              console.log(`Favorite "${favoriteTitle}" deleted successfully`);
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : "Failed to delete favorite";
              Alert.alert("Delete Failed", errorMessage);
              console.error("Failed to delete favorite:", err);
            }
          }
        }
      ]
    );
  };


  const handleSendMessage = async () => {
    if (chatbotMessage.trim() && !isChatLoading) {
      const userMessage = chatbotMessage.trim();
      const newMessage = {
        id: chatHistory.length + 1,
        type: "user" as const,
        message: userMessage,
        timestamp: new Date().toLocaleTimeString(),
      };

      // Add user message to chat
      setChatHistory(prev => [...prev, newMessage]);
      setChatbotMessage("");
      setIsChatLoading(true);

      try {
        // Generate AI response
        const aiResponse = await googleAIService.generateResponse(userMessage);

        const botResponse = {
          id: chatHistory.length + 2,
          type: "bot" as const,
          message: aiResponse,
          timestamp: new Date().toLocaleTimeString(),
        };

        setChatHistory(prev => [...prev, botResponse]);
      } catch (error) {
        console.error('Error generating AI response:', error);

        // Fallback response on error
        const errorResponse = {
          id: chatHistory.length + 2,
          type: "bot" as const,
          message: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. For immediate support, consider reaching out to a healthcare professional or crisis helpline.",
          timestamp: new Date().toLocaleTimeString(),
        };

        setChatHistory(prev => [...prev, errorResponse]);
      } finally {
        setIsChatLoading(false);
      }
    }
  };

  // SOS Emergency functions
  const handleNationalHelplinePress = () => {
    setShowSOSModal(true);
    setSosCountdown(5);
    
    // Animate modal appearance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Start countdown timer
    const timer = setInterval(() => {
      setSosCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSOSCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setSosTimer(timer);
  };

  const handleSOSCall = async () => {
    try {
      const phoneNumber = sosNumber;
      const url = `tel:${phoneNumber}`;
      
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Cannot Make Call",
          `Unable to make a phone call. Please dial ${phoneNumber} manually.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error making SOS call:', error);
      Alert.alert(
        "Error",
        `Failed to make the call. Please dial ${sosNumber} manually.`,
        [{ text: "OK" }]
      );
    } finally {
      handleCancelSOS();
    }
  };

  const handleCancelSOS = () => {
    if (sosTimer) {
      clearInterval(sosTimer);
      setSosTimer(null);
    }
    
    // Animate modal disappearance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSOSModal(false);
      setSosCountdown(5);
    });
  };

  const handleSOSSettingsPress = () => {
    setNewSOSNumber(sosNumber);
    setShowSOSSettings(true);
  };

  const handleSaveSOSNumber = async () => {
    if (isSavingSOS) return; // Prevent multiple taps
    
    setIsSavingSOS(true);
    
    try {
      const trimmedNumber = newSOSNumber.trim();
      
      console.log('Saving SOS number:', trimmedNumber); // Debug log
      
      // More comprehensive validation
      if (trimmedNumber.length < 10) {
        Alert.alert("Invalid Number", "Please enter a valid phone number (at least 10 digits).");
        return;
      }
      
      // Check if number contains only digits and common phone characters
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(trimmedNumber)) {
        Alert.alert("Invalid Number", "Please enter a valid phone number with only digits, spaces, dashes, parentheses, or plus sign.");
        return;
      }
      
      // Update the SOS number
      setSosNumber(trimmedNumber);
      
      // Small delay to ensure state update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setShowSOSSettings(false);
      setNewSOSNumber("");
      
      console.log('SOS number updated successfully:', trimmedNumber); // Debug log
      
      // Show success message
      Alert.alert("Success", `SOS number updated to ${trimmedNumber}!`, [
        { text: "OK", style: "default" }
      ]);
    } catch (error) {
      console.error('Error saving SOS number:', error);
      Alert.alert("Error", "Failed to save SOS number. Please try again.");
    } finally {
      setIsSavingSOS(false);
    }
  };

  const handleCancelSOSSettings = () => {
    setShowSOSSettings(false);
    setNewSOSNumber("");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assistive Tools</Text>
        <Text style={styles.headerSubtitle}>
          Communication and accessibility support
        </Text>
      </View>

      {/* Text-to-Speech Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Text-to-Speech</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowFavorites(true)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Open favorites"
              accessibilityHint="View and select from saved favorite texts"
            >
              <Ionicons name="heart" size={20} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                // Reset filters when opening settings
                setVoiceSearchQuery("");
                setSelectedLanguageFilter("all");
                setSelectedRegionFilter("all");
                setShowSettings(true);
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Open speech settings"
              accessibilityHint="Adjust voice, rate, and pitch settings"
            >
              <Ionicons name="settings" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Initialization Status */}
        {!isInitialized && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.statusText}>Initializing text-to-speech...</Text>
          </View>
        )}



        {/* Error Display */}
        {error && (
          <View
            style={styles.errorContainer}
            accessible={true}
            accessibilityRole="alert"
            accessibilityLabel={`Error: ${error}`}
          >
            <Ionicons name="warning" size={20} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={clearError}
              style={styles.errorCloseButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Dismiss error"
              accessibilityHint="Close this error message"
            >
              <Ionicons name="close" size={16} color="#F44336" />
            </TouchableOpacity>
          </View>
        )}

        {/* Debug Info - Remove after testing */}
        {isInitialized && (
          <View style={[styles.statusContainer, { backgroundColor: "#E8F5E8" }]}>
            <Text style={[styles.statusText, { color: "#2E7D32" }]}>
              Voice: {currentVoice?.name || "Default"} | Rate: {speechRate.toFixed(1)}x | Pitch: {speechPitch.toFixed(1)}
            </Text>
          </View>
        )}

        <View style={styles.speechContainer}>
          <TextInput
            ref={textInputRef}
            style={[
              styles.speechInput,
              !isInitialized && styles.disabledInput
            ]}
            placeholder="Enter text to convert to speech..."
            value={textToSpeech}
            onChangeText={setTextToSpeech}
            multiline
            placeholderTextColor="#8E8E93"
            editable={isInitialized}
            accessible={true}
            accessibilityLabel="Text to speech input"
            accessibilityHint="Enter the text you want to convert to speech. Maximum 4000 characters."
            accessibilityValue={{ text: textToSpeech.length > 0 ? `${textToSpeech.length} characters entered` : "No text entered" }}
            maxLength={4000}
            returnKeyType="done"
            blurOnSubmit={true}
          />

          {/* Character Count */}
          <View style={styles.characterCountContainer}>
            <Text style={[
              styles.characterCount,
              textToSpeech.length > 3500 && styles.characterCountWarning,
              textToSpeech.length >= 4000 && styles.characterCountError
            ]}>
              {textToSpeech.length}/4000 characters
              {textToSpeech.length > 1000 && " (Long text mode)"}
              {textToSpeech.length > 3500 && textToSpeech.length < 4000 && " - Approaching limit"}
              {textToSpeech.length >= 4000 && " - Maximum reached"}
            </Text>
            {textToSpeech.length >= 4000 && (
              <Ionicons name="warning" size={16} color="#F44336" />
            )}
          </View>

          {/* Control Buttons */}
          <View style={styles.controlsContainer}>
            {!isSpeaking ? (
              <TouchableOpacity
                style={[
                  styles.speechButton,
                  (!isInitialized || !textToSpeech.trim() || isLoading) && styles.disabledButton
                ]}
                onPress={handleSpeak}
                disabled={!isInitialized || !textToSpeech.trim() || isLoading}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={isLoading ? "Loading speech synthesis" : "Speak text"}
                accessibilityHint={
                  !isInitialized ? "Text-to-speech is initializing" :
                    !textToSpeech.trim() ? "Enter text first to enable speech" :
                      isLoading ? "Please wait while speech is being prepared" :
                        "Convert the entered text to speech"
                }
                accessibilityState={{
                  disabled: !isInitialized || !textToSpeech.trim() || isLoading,
                  busy: isLoading
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="play" size={20} color="#FFFFFF" />
                )}
                <Text style={styles.speechButtonText}>
                  {isLoading ? "Loading..." : "Speak"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.playbackControls}>
                {capabilities.supportsPause && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handlePauseResume}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={isPaused ? "Resume speech" : "Pause speech"}
                    accessibilityHint={isPaused ? "Continue speaking the text" : "Temporarily stop speaking"}
                    accessibilityState={{ selected: isPaused }}
                  >
                    <Ionicons
                      name={isPaused ? "play" : "pause"}
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.controlButtonText}>
                      {isPaused ? "Resume" : "Pause"}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.controlButton, styles.stopButton]}
                  onPress={handleStop}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Stop speech"
                  accessibilityHint="Stop speaking and return to the beginning"
                >
                  <Ionicons name="stop" size={20} color="#FFFFFF" />
                  <Text style={styles.controlButtonText}>Stop</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Save to Favorites */}
            {textToSpeech.trim() && (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => setShowSaveFavorite(true)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Save to favorites"
                accessibilityHint="Save this text to your favorites for quick access later"
              >
                <Ionicons name="heart-outline" size={16} color="#007AFF" />
                <Text style={styles.favoriteButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>


        </View>
      </View>


      {/* AI Chatbot Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Support Chatbot</Text>
          <Text style={styles.chatSubtitle}>Powered by Google AI</Text>
        </View>
        <View style={styles.chatContainer}>
          <ScrollView style={styles.chatHistory} showsVerticalScrollIndicator={false}>
            {chatHistory.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.type === "user" ? styles.userMessage : styles.botMessage,
                ]}
              >
                {message.type === "bot" ? (
                  <MarkdownText baseTextStyle={styles.messageText}>{message.message}</MarkdownText>
                ) : (
                  <Text style={styles.messageText}>{message.message}</Text>
                )}
                <Text style={styles.messageTime}>{message.timestamp}</Text>
              </View>
            ))}
            {isChatLoading && (
              <View style={[styles.messageContainer, styles.botMessage]}>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color="#007AFF" />
                  <Text style={styles.typingText}>AI is thinking...</Text>
                </View>
                <Text style={styles.messageTime}>{new Date().toLocaleTimeString()}</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.chatInputContainer}>
            <View style={styles.chatInputWrapper}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask about disabilities or mental health..."
                value={chatbotMessage}
                onChangeText={setChatbotMessage}
                placeholderTextColor="#8E8E93"
                multiline
                maxLength={500}
                editable={!isChatLoading}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
                blurOnSubmit={false}
              />
              {chatbotMessage.length > 0 && (
                <Text style={styles.chatCharacterCount}>
                  {chatbotMessage.length}/500
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.sendButton,
                (isChatLoading || !chatbotMessage.trim()) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={isChatLoading || !chatbotMessage.trim()}
            >
              {isChatLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Accessibility Tips</Text>
        {quickTips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb" size={20} color="#FFD700" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipText}>{tip.tip}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Emergency Resources */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Resources</Text>
          <TouchableOpacity 
            style={styles.sosSettingsButton}
            onPress={handleSOSSettingsPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Edit SOS number"
            accessibilityHint="Opens settings to change your emergency contact number"
          >
            <Ionicons name="settings-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="call" size={24} color="#F44336" />
            <Text style={styles.emergencyTitle}>Crisis Support</Text>
          </View>
          <Text style={styles.emergencyDescription}>
            If you or someone you know is in crisis, please reach out to these resources:
          </Text>
          <View style={styles.emergencyNumbers}>
            <TouchableOpacity 
              style={styles.emergencyButton}
              onPress={handleNationalHelplinePress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`SOS Emergency - Tap to call ${sosNumber} with countdown`}
              accessibilityHint="Opens SOS popup with 5-second countdown before calling your emergency contact"
            >
              <Text style={styles.emergencyButtonText}>SOS Emergency: {sosNumber}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emergencyButton}>
              <Text style={styles.emergencyButtonText}>Mental Health: 1800-233-3330</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSettings(false)}
        accessible={true}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Speech Settings</Text>
            <TouchableOpacity
              onPress={() => setShowSettings(false)}
              style={styles.modalCloseButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close settings"
              accessibilityHint="Close the speech settings panel"
            >
              <Ionicons name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Voice Selection */}
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Voice Selection</Text>
              <Text style={styles.settingDescription}>
                Current: {currentVoice?.name || "Default"} ({filteredVoices.length} of {voices.length} voices)
              </Text>

              {/* Search Field */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#8E8E93" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search voices by name or language..."
                  value={voiceSearchQuery}
                  onChangeText={setVoiceSearchQuery}
                  placeholderTextColor="#8E8E93"
                  accessible={true}
                  accessibilityLabel="Search voices"
                  accessibilityHint="Type to search for voices by name or language"
                />
                {voiceSearchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setVoiceSearchQuery("")}
                    style={styles.clearSearchButton}
                    accessible={true}
                    accessibilityLabel="Clear search"
                  >
                    <Ionicons name="close-circle" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Language Filter */}
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Language:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      selectedLanguageFilter === "all" && styles.filterChipSelected
                    ]}
                    onPress={() => setSelectedLanguageFilter("all")}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedLanguageFilter === "all" && styles.filterChipTextSelected
                    ]}>
                      All Languages
                    </Text>
                  </TouchableOpacity>
                  {getUniqueLanguages().map((langCode) => (
                    <TouchableOpacity
                      key={langCode}
                      style={[
                        styles.filterChip,
                        selectedLanguageFilter === langCode && styles.filterChipSelected
                      ]}
                      onPress={() => setSelectedLanguageFilter(langCode)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedLanguageFilter === langCode && styles.filterChipTextSelected
                      ]}>
                        {getLanguageName(langCode)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Region Filter */}
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Region:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      selectedRegionFilter === "all" && styles.filterChipSelected
                    ]}
                    onPress={() => setSelectedRegionFilter("all")}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedRegionFilter === "all" && styles.filterChipTextSelected
                    ]}>
                      All Regions
                    </Text>
                  </TouchableOpacity>
                  {getUniqueRegions().map((regionCode) => (
                    <TouchableOpacity
                      key={regionCode}
                      style={[
                        styles.filterChip,
                        selectedRegionFilter === regionCode && styles.filterChipSelected
                      ]}
                      onPress={() => setSelectedRegionFilter(regionCode)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedRegionFilter === regionCode && styles.filterChipTextSelected
                      ]}>
                        {getRegionName(regionCode)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Clear Filters Button */}
              {(voiceSearchQuery || selectedLanguageFilter !== "all" || selectedRegionFilter !== "all") && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setVoiceSearchQuery("");
                    setSelectedLanguageFilter("all");
                    setSelectedRegionFilter("all");
                  }}
                  accessible={true}
                  accessibilityLabel="Clear all filters"
                >
                  <Ionicons name="refresh" size={16} color="#007AFF" />
                  <Text style={styles.clearFiltersText}>Clear All Filters</Text>
                </TouchableOpacity>
              )}

              {/* Voice List */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.voiceListContainer}>
                <View style={styles.voiceList}>
                  {filteredVoices.length > 0 ? (
                    filteredVoices.map((voice) => (
                      <TouchableOpacity
                        key={voice.identifier}
                        style={[
                          styles.voiceItem,
                          currentVoice?.identifier === voice.identifier && styles.selectedVoice
                        ]}
                        onPress={() => setVoice(voice)}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${voice.name} voice`}
                        accessibilityHint={`${getLanguageName(voice.language.split('-')[0])} voice from ${getRegionName(voice.language.split('-')[1] || '')}`}
                        accessibilityState={{ selected: currentVoice?.identifier === voice.identifier }}
                      >
                        <Text style={[
                          styles.voiceName,
                          currentVoice?.identifier === voice.identifier && styles.selectedVoiceText
                        ]}>
                          {voice.name}
                        </Text>
                        <Text style={styles.voiceLanguage}>
                          {getLanguageName(voice.language.split('-')[0])}
                        </Text>
                        <Text style={styles.voiceRegion}>
                          {getRegionName(voice.language.split('-')[1] || '')}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.noVoicesContainer}>
                      <Ionicons name="search" size={32} color="#8E8E93" />
                      <Text style={styles.noVoicesText}>No voices found</Text>
                      <Text style={styles.noVoicesSubtext}>Try adjusting your search or filters</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>

            {/* Speech Rate */}
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Speech Rate: {speechRate.toFixed(1)}x</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Slow</Text>
                <View style={styles.sliderTrack}>
                  <View
                    style={[
                      styles.sliderFill,
                      { width: `${((speechRate - 0.1) / 1.9) * 100}%` }
                    ]}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sliderThumb,
                      { left: `${((speechRate - 0.1) / 1.9) * 100}%` }
                    ]}
                    onPressIn={() => {
                      // Simple slider implementation - in production, use a proper slider library
                    }}
                  />
                </View>
                <Text style={styles.sliderLabel}>Fast</Text>
              </View>
              <View style={styles.rateButtons}>
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() => setSpeechRate(Math.max(0.1, speechRate - 0.1))}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease speech rate"
                  accessibilityHint={`Current rate is ${speechRate.toFixed(1)}x. Tap to make speech slower.`}
                >
                  <Text style={styles.rateButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() => setSpeechRate(Math.min(2.0, speechRate + 0.1))}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Increase speech rate"
                  accessibilityHint={`Current rate is ${speechRate.toFixed(1)}x. Tap to make speech faster.`}
                >
                  <Text style={styles.rateButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Speech Pitch */}
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Speech Pitch: {speechPitch.toFixed(1)}</Text>
              <View style={styles.rateButtons}>
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() => setSpeechPitch(Math.max(0.5, speechPitch - 0.1))}
                >
                  <Text style={styles.rateButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() => setSpeechPitch(Math.min(2.0, speechPitch + 0.1))}
                >
                  <Text style={styles.rateButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Auto-save Settings */}
            <View style={styles.settingSection}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => updateSettings({ autoSave: !settings.autoSave })}
              >
                <Ionicons
                  name={settings.autoSave ? "checkbox" : "square-outline"}
                  size={24}
                  color="#007AFF"
                />
                <View style={styles.checkboxContent}>
                  <Text style={styles.checkboxTitle}>Auto-save Settings</Text>
                  <Text style={styles.checkboxDescription}>
                    Automatically save voice and speech preferences
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Favorites Modal */}
      <Modal
        visible={showFavorites}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFavorites(false)}
        accessible={true}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Favorite Texts</Text>
            <TouchableOpacity
              onPress={() => setShowFavorites(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {favorites.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="heart-outline" size={48} color="#8E8E93" />
                <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
                <Text style={styles.emptyStateDescription}>
                  Save frequently used text snippets for quick access
                </Text>
              </View>
            ) : (
              favorites.map((favorite) => (
                <View key={favorite.id} style={styles.favoriteItem}>
                  <TouchableOpacity
                    style={styles.favoriteContent}
                    onPress={() => handleSelectFavorite(favorite)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Select favorite: ${favorite.title}`}
                    accessibilityHint={`Insert this text: ${favorite.text.substring(0, 100)}${favorite.text.length > 100 ? '...' : ''}`}
                  >
                    <Text style={styles.favoriteTitle}>{favorite.title}</Text>
                    <Text style={styles.favoriteText} numberOfLines={2}>
                      {favorite.text}
                    </Text>
                    <Text style={styles.favoriteDate}>
                      {new Date(favorite.createdAt).toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.favoriteDeleteButton}
                    onPress={() => handleDeleteFavorite(favorite.id)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete favorite: ${favorite.title}`}
                    accessibilityHint="Remove this favorite from your saved texts"
                  >
                    <Ionicons name="trash" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Save Favorite Modal */}
      <Modal
        visible={showSaveFavorite}
        animationType="fade"
        transparent
        onRequestClose={() => setShowSaveFavorite(false)}
      >
        <View style={styles.overlayContainer}>
          <View style={styles.saveModal}>
            <Text style={styles.saveModalTitle}>Save to Favorites</Text>
            <TextInput
              style={styles.saveModalInput}
              placeholder="Enter a title (optional)"
              value={favoriteTitle}
              onChangeText={setFavoriteTitle}
              placeholderTextColor="#8E8E93"
            />
            <View style={styles.saveModalButtons}>
              <TouchableOpacity
                style={styles.saveModalCancelButton}
                onPress={() => {
                  setShowSaveFavorite(false);
                  setFavoriteTitle("");
                }}
              >
                <Text style={styles.saveModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveModalSaveButton}
                onPress={handleSaveFavorite}
              >
                <Text style={styles.saveModalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SOS Emergency Modal */}
      <Modal
        visible={showSOSModal}
        animationType="none"
        transparent
        onRequestClose={handleCancelSOS}
        accessible={true}
        accessibilityViewIsModal={true}
      >
        <Animated.View 
          style={[
            styles.sosOverlay,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.sosModal,
              {
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <View style={styles.sosHeader}>
              <View style={styles.sosIconContainer}>
                <Ionicons name="call" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.sosTitle}>Emergency Call</Text>
              <Text style={styles.sosSubtitle}>
                Connecting to {sosNumber}
              </Text>
            </View>

            <View style={styles.sosCountdownContainer}>
              <Text style={styles.sosCountdownLabel}>Calling in:</Text>
              <Text style={styles.sosCountdownNumber}>{sosCountdown}</Text>
              <Text style={styles.sosCountdownUnit}>seconds</Text>
            </View>

            <View style={styles.sosProgressContainer}>
              <View 
                style={[
                  styles.sosProgressBar,
                  { width: `${((5 - sosCountdown) / 5) * 100}%` }
                ]} 
              />
            </View>

            <View style={styles.sosButtonsContainer}>
              <TouchableOpacity 
                style={styles.sosCancelButton}
                onPress={handleCancelSOS}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Cancel emergency call"
                accessibilityHint="Cancels the emergency call and closes this popup"
              >
                <Ionicons name="close" size={20} color="#666666" />
                <Text style={styles.sosCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sosCallNowButton}
                onPress={handleSOSCall}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Call now"
                accessibilityHint="Immediately calls the National Helpline"
              >
                <Ionicons name="call" size={20} color="#FFFFFF" />
                <Text style={styles.sosCallNowButtonText}>Call Now</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sosHelpText}>
              If you need immediate help, you can also dial {sosNumber} directly.
            </Text>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* SOS Settings Modal */}
      <Modal
        visible={showSOSSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelSOSSettings}
        accessible={true}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>SOS Emergency Settings</Text>
            <TouchableOpacity
              onPress={handleCancelSOSSettings}
              style={styles.modalCloseButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close SOS settings"
              accessibilityHint="Close the SOS settings panel"
            >
              <Ionicons name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.sosSettingsSection}>
              <Text style={styles.sosSettingsTitle}>Emergency Contact Number</Text>
              <Text style={styles.sosSettingsDescription}>
                Set your emergency contact number for SOS calls. This number will be called when you use the emergency feature.
              </Text>
              
              <View style={styles.sosInputContainer}>
                <Text style={styles.sosInputLabel}>Phone Number:</Text>
                <TextInput
                  style={styles.sosInput}
                  placeholder="Enter emergency contact number"
                  value={newSOSNumber}
                  onChangeText={setNewSOSNumber}
                  keyboardType="phone-pad"
                  maxLength={15}
                  placeholderTextColor="#8E8E93"
                  accessible={true}
                  accessibilityLabel="Emergency contact number input"
                  accessibilityHint="Enter the phone number for emergency calls"
                />
                <Text style={styles.sosInputHint}>
                  Current: {sosNumber}
                </Text>
              </View>

              <View style={styles.sosSettingsButtons}>
                <TouchableOpacity
                  style={styles.sosCancelSettingsButton}
                  onPress={handleCancelSOSSettings}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel changes"
                >
                  <Text style={styles.sosCancelSettingsText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.sosSaveSettingsButton,
                    isSavingSOS && styles.sosSaveSettingsButtonDisabled
                  ]}
                  onPress={handleSaveSOSNumber}
                  disabled={isSavingSOS}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={isSavingSOS ? "Saving SOS number" : "Save SOS number"}
                  accessibilityState={{ disabled: isSavingSOS }}
                >
                  {isSavingSOS ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.sosSaveSettingsText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  chatSubtitle: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
    marginTop: -12,
    marginBottom: 16,
  },
  speechContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speechInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1A1A1A",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#007AFF",
    flex: 1,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#F44336",
    flex: 1,
  },
  errorCloseButton: {
    padding: 4,
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: "#8E8E93",
  },
  characterCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 12,
    gap: 4,
  },
  characterCount: {
    fontSize: 12,
    color: "#8E8E93",
  },
  characterCountWarning: {
    color: "#FF9800",
    fontWeight: "500",
  },
  characterCountError: {
    color: "#F44336",
    fontWeight: "600",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  speechButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  speechButtonText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  playbackControls: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  stopButton: {
    backgroundColor: "#F44336",
  },
  controlButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  favoriteButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  chatContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    height: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatHistory: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 12,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 12,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: "#1A1A1A",
    lineHeight: 18,
  },
  messageTime: {
    fontSize: 10,
    color: "#8E8E93",
    marginTop: 4,
  },
  chatInputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  chatInputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  chatInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1A1A1A",
    backgroundColor: "#F8F9FA",
    minHeight: 40,
    maxHeight: 100,
  },
  chatCharacterCount: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "right",
    marginTop: 4,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#8E8E93",
    opacity: 0.6,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
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
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF9C4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: "#666666",
    lineHeight: 16,
  },
  emergencyCard: {
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  emergencyTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#D32F2F",
  },
  emergencyDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 12,
  },
  emergencyNumbers: {
    gap: 8,
  },
  emergencyButton: {
    backgroundColor: "#F44336",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    marginLeft: 8,
    paddingVertical: 4,
  },
  clearSearchButton: {
    padding: 4,
  },
  filterContainer: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  filterScroll: {
    maxHeight: 50,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  filterChipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterChipText: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
  filterChipTextSelected: {
    color: "#FFFFFF",
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F0F8FF",
    marginBottom: 16,
  },
  clearFiltersText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  voiceListContainer: {
    maxHeight: 200,
  },
  voiceList: {
    flexDirection: "row",
    gap: 12,
  },
  voiceItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
    minWidth: 140,
  },
  selectedVoice: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  voiceName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  selectedVoiceText: {
    color: "#007AFF",
  },
  voiceLanguage: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 2,
  },
  voiceRegion: {
    fontSize: 11,
    color: "#B0B0B0",
    fontStyle: "italic",
  },
  noVoicesContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    minWidth: 200,
  },
  noVoicesText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8E8E93",
    marginTop: 12,
    marginBottom: 4,
  },
  noVoicesSubtext: {
    fontSize: 14,
    color: "#B0B0B0",
    textAlign: "center",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    position: "relative",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  sliderThumb: {
    position: "absolute",
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginLeft: -8,
  },
  rateButtons: {
    flexDirection: "row",
    gap: 12,
  },
  rateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  rateButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 14,
    color: "#666666",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  favoriteItem: {
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
  favoriteContent: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  favoriteText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  favoriteDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  favoriteDeleteButton: {
    padding: 8,
    marginLeft: 12,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  saveModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  saveModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
    textAlign: "center",
  },
  saveModalInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 20,
  },
  saveModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  saveModalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    alignItems: "center",
  },
  saveModalCancelText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  saveModalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  saveModalSaveText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  // SOS Modal Styles
  sosOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sosModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  sosHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  sosIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  sosSubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },
  sosCountdownContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  sosCountdownLabel: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 8,
  },
  sosCountdownNumber: {
    fontSize: 48,
    fontWeight: "800",
    color: "#4CAF50",
    marginBottom: 4,
  },
  sosCountdownUnit: {
    fontSize: 14,
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sosProgressContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#E5E5EA",
    borderRadius: 3,
    marginBottom: 32,
    overflow: "hidden",
  },
  sosProgressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  sosButtonsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  sosCancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  sosCancelButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666666",
    fontWeight: "600",
  },
  sosCallNowButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sosCallNowButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  sosHelpText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
  },
  // SOS Settings Styles
  sosSettingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  sosSettingsSection: {
    marginBottom: 24,
  },
  sosSettingsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  sosSettingsDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 20,
  },
  sosInputContainer: {
    marginBottom: 24,
  },
  sosInputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  sosInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
  },
  sosInputHint: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
    fontStyle: "italic",
  },
  sosSettingsButtons: {
    flexDirection: "row",
    gap: 12,
  },
  sosCancelSettingsButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  sosCancelSettingsText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  sosSaveSettingsButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  sosSaveSettingsButtonDisabled: {
    backgroundColor: "#8E8E93",
    opacity: 0.6,
  },
  sosSaveSettingsText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
