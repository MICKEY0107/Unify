import { useCallback, useEffect, useState, useRef } from 'react';
import { textToSpeechService, TextToSpeechService, Voice, SpeechOptions, SpeechState, TTSError } from '../services/textToSpeechService';
import { storageService, TTSSettings, FavoriteText } from '../services/storageService';

export interface UseTTSReturn {
  // Core TTS functionality
  speak: (text: string) => Promise<void>;
  speakLongText: (text: string) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  
  // State
  isSpeaking: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  currentText: string;
  
  // Voice management
  voices: Voice[];
  currentVoice: Voice | null;
  setVoice: (voice: Voice) => void;
  refreshVoices: () => Promise<void>;
  
  // Speech settings
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;
  
  // Favorites management
  favorites: FavoriteText[];
  saveFavorite: (text: string, title?: string) => Promise<void>;
  deleteFavorite: (id: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  
  // Settings
  settings: TTSSettings;
  updateSettings: (settings: Partial<TTSSettings>) => Promise<void>;
  
  // Utilities
  clearError: () => void;
  runDiagnostics: () => Promise<void>;
  getPlatformCapabilities: () => ReturnType<typeof textToSpeechService.getPlatformCapabilities>;
}

export function useTextToSpeech(): UseTTSReturn {
  // Core state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState('');
  
  // Voice state
  const [voices, setVoices] = useState<Voice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<Voice | null>(null);
  
  // Settings state
  const [speechRate, setSpeechRateState] = useState(1.0);
  const [speechPitch, setSpeechPitchState] = useState(1.0);
  const [settings, setSettings] = useState<TTSSettings>({
    defaultRate: 1.0,
    defaultPitch: 1.0,
    autoSave: false,
  });
  
  // Favorites state
  const [favorites, setFavorites] = useState<FavoriteText[]>([]);
  
  // Refs for cleanup
  const mountedRef = useRef(true);
  const statusCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize TTS service and load data
  useEffect(() => {
    const initialize = async () => {
      if (!mountedRef.current) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Initialize TTS service
        await textToSpeechService.initialize();
        if (!mountedRef.current) return;
        
        setIsInitialized(true);

        // Load settings
        const savedSettings = await storageService.getSettings();
        if (!mountedRef.current) return;
        
        setSettings(savedSettings);
        setSpeechRateState(savedSettings.defaultRate);
        setSpeechPitchState(savedSettings.defaultPitch);

        // Apply settings to service
        textToSpeechService.setDefaultOptions({
          rate: savedSettings.defaultRate,
          pitch: savedSettings.defaultPitch,
          voice: savedSettings.defaultVoice,
        });

        // Load voices
        const availableVoices = await textToSpeechService.getAvailableVoices();
        if (!mountedRef.current) return;
        
        setVoices(availableVoices);
        console.log('Loaded voices:', availableVoices.length, 'voices');
        
        // Set default voice if available
        if (availableVoices.length > 0) {
          let voiceToSet = null;
          
          if (savedSettings.defaultVoice) {
            // Try to find the saved voice
            voiceToSet = availableVoices.find(v => v.identifier === savedSettings.defaultVoice);
            console.log('Looking for saved voice:', savedSettings.defaultVoice, 'found:', !!voiceToSet);
          }
          
          // If no saved voice found, use the first available voice
          if (!voiceToSet && availableVoices.length > 0) {
            voiceToSet = availableVoices[0];
            console.log('Using first available voice:', voiceToSet.name);
          }
          
          if (voiceToSet) {
            setCurrentVoice(voiceToSet);
            // Ensure the service also has the correct voice set
            textToSpeechService.setDefaultOptions({ 
              voice: voiceToSet.identifier,
              rate: savedSettings.defaultRate,
              pitch: savedSettings.defaultPitch,
            });
            console.log('Voice set to:', voiceToSet.name, voiceToSet.identifier);
          }
        }

        // Load favorites
        const savedFavorites = await storageService.getFavorites();
        if (!mountedRef.current) return;
        
        setFavorites(savedFavorites);

      } catch (err) {
        if (!mountedRef.current) return;
        
        console.error("TTS initialization failed:", err);
        const error = err instanceof TTSError ? err : new Error('Failed to initialize TTS');
        setError(TextToSpeechService.getUserFriendlyErrorMessage(error as TTSError));
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    initialize();
  }, []);

  // Update speaking state based on service state
  useEffect(() => {
    const checkSpeakingState = () => {
      if (!mountedRef.current) return;
      
      const speaking = textToSpeechService.isSpeaking();
      const paused = textToSpeechService.isPaused();
      const text = textToSpeechService.getCurrentText();
      
      setIsSpeaking(speaking);
      setIsPaused(paused);
      setCurrentText(text);
    };

    // Check immediately
    checkSpeakingState();
    
    // Set up interval for periodic checks
    statusCheckIntervalRef.current = setInterval(checkSpeakingState, 100);
    
    return () => {
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
        statusCheckIntervalRef.current = null;
      }
    };
  }, [isInitialized]);

  const speak = useCallback(async (text: string) => {
    if (!isInitialized) {
      setError('TTS service is not initialized');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const options: SpeechOptions = {
        rate: speechRate,
        pitch: speechPitch,
        voice: currentVoice?.identifier,
      };

      console.log('Speaking with options:', {
        voice: currentVoice?.name,
        voiceId: currentVoice?.identifier,
        rate: speechRate,
        pitch: speechPitch
      });

      await textToSpeechService.speak(text, options);
    } catch (err) {
      console.error("TTS speak failed:", err);
      const error = err instanceof TTSError ? err : TextToSpeechService.handleError(err);
      setError(TextToSpeechService.getUserFriendlyErrorMessage(error));
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [speechRate, speechPitch, currentVoice, isInitialized]);

  const speakLongText = useCallback(async (text: string) => {
    if (!isInitialized) {
      setError('TTS service is not initialized');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const options: SpeechOptions = {
        rate: speechRate,
        pitch: speechPitch,
        voice: currentVoice?.identifier,
      };

      await textToSpeechService.speakLongText(text, options);
    } catch (err) {
      const error = err instanceof TTSError ? err : TextToSpeechService.handleError(err);
      setError(TextToSpeechService.getUserFriendlyErrorMessage(error));
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [speechRate, speechPitch, currentVoice, isInitialized]);

  const stop = useCallback(() => {
    textToSpeechService.stop();
    setError(null);
  }, []);

  const pause = useCallback(() => {
    textToSpeechService.pause();
  }, []);

  const resume = useCallback(() => {
    textToSpeechService.resume();
  }, []);

  const setVoice = useCallback(async (voice: Voice) => {
    console.log('Setting voice to:', voice.name, voice.identifier);
    setCurrentVoice(voice);
    textToSpeechService.setDefaultOptions({ voice: voice.identifier });
    
    // Always save to settings (not just when auto-save is enabled)
    try {
      await storageService.saveSettings({ defaultVoice: voice.identifier });
      setSettings(prev => ({ ...prev, defaultVoice: voice.identifier }));
      console.log('Voice setting saved successfully');
    } catch (err) {
      console.warn('Failed to save voice setting:', err);
    }
  }, []);

  const refreshVoices = useCallback(async () => {
    if (!isInitialized) return;
    
    try {
      const availableVoices = await textToSpeechService.refreshVoices();
      setVoices(availableVoices);
    } catch (err) {
      console.warn('Failed to refresh voices:', err);
    }
  }, [isInitialized]);

  const setSpeechRate = useCallback(async (rate: number) => {
    const clampedRate = Math.max(0.1, Math.min(2.0, rate));
    console.log('Setting speech rate to:', clampedRate);
    setSpeechRateState(clampedRate);
    textToSpeechService.setDefaultOptions({ rate: clampedRate });
    
    // Always save to settings
    try {
      await storageService.saveSettings({ defaultRate: clampedRate });
      setSettings(prev => ({ ...prev, defaultRate: clampedRate }));
    } catch (err) {
      console.warn('Failed to save rate setting:', err);
    }
  }, []);

  const setSpeechPitch = useCallback(async (pitch: number) => {
    const clampedPitch = Math.max(0.5, Math.min(2.0, pitch));
    console.log('Setting speech pitch to:', clampedPitch);
    setSpeechPitchState(clampedPitch);
    textToSpeechService.setDefaultOptions({ pitch: clampedPitch });
    
    // Always save to settings
    try {
      await storageService.saveSettings({ defaultPitch: clampedPitch });
      setSettings(prev => ({ ...prev, defaultPitch: clampedPitch }));
    } catch (err) {
      console.warn('Failed to save pitch setting:', err);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<TTSSettings>) => {
    try {
      await storageService.saveSettings(newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
      
      // Apply rate and pitch changes immediately
      if (newSettings.defaultRate !== undefined) {
        setSpeechRateState(newSettings.defaultRate);
        textToSpeechService.setDefaultOptions({ rate: newSettings.defaultRate });
      }
      if (newSettings.defaultPitch !== undefined) {
        setSpeechPitchState(newSettings.defaultPitch);
        textToSpeechService.setDefaultOptions({ pitch: newSettings.defaultPitch });
      }
    } catch (err) {
      throw new Error(`Failed to update settings: ${err}`);
    }
  }, []);

  // Favorites management
  const saveFavorite = useCallback(async (text: string, title?: string) => {
    try {
      await storageService.saveFavorite(text, title);
      const updatedFavorites = await storageService.getFavorites();
      setFavorites(updatedFavorites);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save favorite';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteFavorite = useCallback(async (id: string) => {
    try {
      await storageService.deleteFavorite(id);
      const updatedFavorites = await storageService.getFavorites();
      setFavorites(updatedFavorites);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete favorite';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const savedFavorites = await storageService.getFavorites();
      setFavorites(savedFavorites);
    } catch (err) {
      console.warn('Failed to load favorites:', err);
    }
  }, []);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const runDiagnostics = useCallback(async () => {
    if (!isInitialized) {
      setError('TTS service is not initialized');
      return;
    }

    try {
      const diagnostics = await textToSpeechService.runDiagnostics();
      
      if (!diagnostics.isHealthy) {
        const errorMessages = diagnostics.issues
          .filter(issue => issue.severity === 'error')
          .map(issue => issue.message)
          .join('; ');
        
        if (errorMessages) {
          setError(`TTS Issues: ${errorMessages}`);
        }
      }
      
      // Log all issues for debugging
      console.log('TTS Diagnostics:', diagnostics);
    } catch (err) {
      setError('Failed to run diagnostics');
      console.error('Diagnostics failed:', err);
    }
  }, [isInitialized]);

  const getPlatformCapabilities = useCallback(() => {
    return textToSpeechService.getPlatformCapabilities();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      textToSpeechService.stop();
      
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
    };
  }, []);

  return {
    // Core TTS functionality
    speak,
    speakLongText,
    stop,
    pause,
    resume,
    
    // State
    isSpeaking,
    isPaused,
    isLoading,
    isInitialized,
    error,
    currentText,
    
    // Voice management
    voices,
    currentVoice,
    setVoice,
    refreshVoices,
    
    // Speech settings
    speechRate,
    setSpeechRate,
    speechPitch,
    setSpeechPitch,
    
    // Favorites management
    favorites,
    saveFavorite,
    deleteFavorite,
    loadFavorites,
    
    // Settings
    settings,
    updateSettings,
    
    // Utilities
    clearError,
    runDiagnostics,
    getPlatformCapabilities,
  };
}