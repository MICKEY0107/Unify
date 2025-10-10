import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { TTSError, TTSErrorType } from '../services/textToSpeechService';

export interface ErrorRecoveryAction {
  type: 'retry' | 'fallback' | 'user_action' | 'none';
  message: string;
  action?: () => Promise<void>;
}

export class TTSErrorHandler {
  static getUserFriendlyMessage(error: TTSError): string {
    switch (error.type) {
      case TTSErrorType.NOT_SUPPORTED:
        return 'Text-to-speech is not available on this device. Please check your device settings or try updating your system.';
      
      case TTSErrorType.VOICE_UNAVAILABLE:
        return 'The selected voice is not available. The default voice will be used instead.';
      
      case TTSErrorType.SYNTHESIS_FAILED:
        return 'Unable to convert text to speech. Please try again or check your device\'s audio settings.';
      
      case TTSErrorType.AUDIO_INTERRUPTED:
        return 'Speech playback was interrupted. This may happen during phone calls or when other apps use audio.';
      
      case TTSErrorType.VALIDATION_ERROR:
        return error.message; // Validation errors already have user-friendly messages
      
      default:
        return 'An unexpected error occurred with text-to-speech. Please try again.';
    }
  }

  static getRecoveryAction(error: TTSError): ErrorRecoveryAction {
    switch (error.type) {
      case TTSErrorType.NOT_SUPPORTED:
        return {
          type: 'user_action',
          message: 'Check device settings',
        };
      
      case TTSErrorType.VOICE_UNAVAILABLE:
        return {
          type: 'fallback',
          message: 'Use default voice',
        };
      
      case TTSErrorType.SYNTHESIS_FAILED:
        return {
          type: 'retry',
          message: 'Try again',
        };
      
      case TTSErrorType.AUDIO_INTERRUPTED:
        return {
          type: 'retry',
          message: 'Retry when audio is available',
        };
      
      case TTSErrorType.VALIDATION_ERROR:
        return {
          type: 'user_action',
          message: 'Fix input and try again',
        };
      
      default:
        return {
          type: 'retry',
          message: 'Try again',
        };
    }
  }

  static shouldShowToUser(error: TTSError): boolean {
    // Don't show validation errors as alerts since they're handled in UI
    return error.type !== TTSErrorType.VALIDATION_ERROR;
  }

  static logError(error: TTSError, context?: string): void {
    const logMessage = `TTS Error [${error.type}]${context ? ` in ${context}` : ''}: ${error.message}`;
    
    if (error.originalError) {
      console.error(logMessage, error.originalError);
    } else {
      console.error(logMessage);
    }

    // In production, you might want to send this to a crash reporting service
    // Example: Crashlytics.recordError(error);
  }
}

export class DeviceCompatibilityChecker {
  static async checkTTSSupport(): Promise<{
    isSupported: boolean;
    limitations: string[];
    recommendations: string[];
  }> {
    const limitations: string[] = [];
    const recommendations: string[] = [];
    let isSupported = true;

    try {
      // Check basic TTS availability
      if (typeof Speech === 'undefined' || !Speech.speak) {
        isSupported = false;
        limitations.push('Text-to-speech API not available');
        recommendations.push('Update your device operating system');
      }

      // Platform-specific checks
      if (Platform.OS === 'web') {
        if (!('speechSynthesis' in window)) {
          isSupported = false;
          limitations.push('Web Speech API not supported in this browser');
          recommendations.push('Use a modern browser like Chrome, Firefox, or Safari');
        } else if (window.speechSynthesis.getVoices().length === 0) {
          limitations.push('No voices available in browser');
          recommendations.push('Check browser speech settings');
        }
      }

      // Check for common issues
      if (Platform.OS === 'android') {
        // Android-specific checks could go here
        recommendations.push('Ensure Google Text-to-Speech is installed and enabled');
      }

      if (Platform.OS === 'ios') {
        // iOS-specific checks could go here
        recommendations.push('Check Settings > Accessibility > Spoken Content');
      }

    } catch (error) {
      isSupported = false;
      limitations.push('Unable to verify TTS support');
      recommendations.push('Restart the app and try again');
    }

    return {
      isSupported,
      limitations,
      recommendations,
    };
  }

  static getOptimalSettings(): {
    rate: number;
    pitch: number;
    recommendedVoiceLanguage: string;
  } {
    // Platform-optimized default settings
    const baseSettings = {
      rate: 1.0,
      pitch: 1.0,
      recommendedVoiceLanguage: 'en-US',
    };

    if (Platform.OS === 'android') {
      // Android users often prefer slightly slower speech
      baseSettings.rate = 0.9;
    }

    if (Platform.OS === 'web') {
      // Web speech synthesis can be faster
      baseSettings.rate = 1.1;
    }

    return baseSettings;
  }

  static async diagnoseIssues(): Promise<{
    issues: Array<{
      severity: 'error' | 'warning' | 'info';
      message: string;
      solution?: string;
    }>;
  }> {
    const issues: Array<{
      severity: 'error' | 'warning' | 'info';
      message: string;
      solution?: string;
    }> = [];

    try {
      const compatibility = await this.checkTTSSupport();
      
      if (!compatibility.isSupported) {
        issues.push({
          severity: 'error',
          message: 'Text-to-speech is not supported on this device',
          solution: 'Update your device or use a compatible browser',
        });
      }

      compatibility.limitations.forEach(limitation => {
        issues.push({
          severity: 'warning',
          message: limitation,
        });
      });

      // Check for potential performance issues
      if (Platform.OS === 'web' && navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) {
        issues.push({
          severity: 'info',
          message: 'Device may have limited processing power',
          solution: 'Use shorter text snippets for better performance',
        });
      }

    } catch (error) {
      issues.push({
        severity: 'error',
        message: 'Unable to diagnose TTS capabilities',
        solution: 'Restart the app and try again',
      });
    }

    return { issues };
  }
}