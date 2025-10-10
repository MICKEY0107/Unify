import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { TTSErrorHandler, DeviceCompatibilityChecker } from '../utils/ttsErrorHandler';

export interface SpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  language?: string;
}

export interface Voice {
  identifier: string;
  name: string;
  language: string;
  quality: 'default' | 'enhanced';
}

export enum SpeechState {
  IDLE = 'idle',
  LOADING = 'loading',
  SPEAKING = 'speaking',
  PAUSED = 'paused',
  ERROR = 'error'
}

export interface SpeechStatus {
  state: SpeechState;
  currentText?: string;
  progress?: number;
  error?: string;
}

export enum TTSErrorType {
  NOT_SUPPORTED = 'not_supported',
  VOICE_UNAVAILABLE = 'voice_unavailable',
  SYNTHESIS_FAILED = 'synthesis_failed',
  AUDIO_INTERRUPTED = 'audio_interrupted',
  VALIDATION_ERROR = 'validation_error'
}

export class TTSError extends Error {
  constructor(
    public type: TTSErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'TTSError';
  }
}

export class TextToSpeechService {
  private currentOptions: SpeechOptions = {
    rate: 1.0,
    pitch: 1.0,
  };
  
  private _isSpeaking = false;
  private _isPaused = false;
  private _currentText = '';
  private _availableVoices: Voice[] = [];
  private _voicesLoaded = false;
  private _isInitialized = false;

  async initialize(): Promise<void> {
    if (this._isInitialized) return;

    try {
      // Comprehensive device compatibility check
      const compatibility = await DeviceCompatibilityChecker.checkTTSSupport();
      
      if (!compatibility.isSupported) {
        const error = new TTSError(
          TTSErrorType.NOT_SUPPORTED,
          'Text-to-speech is not supported on this device'
        );
        TTSErrorHandler.logError(error, 'initialization');
        throw error;
      }

      // Log any limitations for debugging
      if (compatibility.limitations.length > 0) {
        console.warn('TTS Limitations detected:', compatibility.limitations);
      }

      // Apply optimal settings for this platform
      const optimalSettings = DeviceCompatibilityChecker.getOptimalSettings();
      this.currentOptions = {
        ...this.currentOptions,
        rate: optimalSettings.rate,
        pitch: optimalSettings.pitch,
      };

      // Load available voices
      await this.loadVoices();
      this._isInitialized = true;
      
      console.log('TTS Service initialized successfully');
    } catch (error) {
      if (error instanceof TTSError) {
        throw error;
      }
      
      const ttsError = new TTSError(
        TTSErrorType.SYNTHESIS_FAILED,
        'Failed to initialize text-to-speech service',
        error as Error
      );
      TTSErrorHandler.logError(ttsError, 'initialization');
      throw ttsError;
    }
  }

  private validateText(text: string): void {
    if (!text || typeof text !== 'string') {
      throw new TTSError(
        TTSErrorType.VALIDATION_ERROR,
        'Text must be a non-empty string'
      );
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      throw new TTSError(
        TTSErrorType.VALIDATION_ERROR,
        'Text cannot be empty or contain only whitespace'
      );
    }

    if (trimmedText.length > 4000) {
      throw new TTSError(
        TTSErrorType.VALIDATION_ERROR,
        'Text is too long (maximum 4000 characters)'
      );
    }
  }

  private validateSpeechOptions(options: SpeechOptions): SpeechOptions {
    const validatedOptions = { ...options };

    // Validate rate (0.1 to 2.0)
    if (validatedOptions.rate !== undefined) {
      validatedOptions.rate = Math.max(0.1, Math.min(2.0, validatedOptions.rate));
    }

    // Validate pitch (0.5 to 2.0)
    if (validatedOptions.pitch !== undefined) {
      validatedOptions.pitch = Math.max(0.5, Math.min(2.0, validatedOptions.pitch));
    }

    // Validate voice exists
    if (validatedOptions.voice) {
      if (this._voicesLoaded) {
        const voiceExists = this._availableVoices.some(v => v.identifier === validatedOptions.voice);
        if (!voiceExists) {
          console.warn(`Voice "${validatedOptions.voice}" not available in loaded voices, using default`);
          console.log('Available voices:', this._availableVoices.map(v => v.identifier));
          delete validatedOptions.voice;
        } else {
          console.log(`Voice "${validatedOptions.voice}" validated successfully`);
        }
      } else {
        console.log(`Voices not loaded yet, keeping voice "${validatedOptions.voice}"`);
        // Keep the voice even if voices aren't loaded yet - expo-speech might handle it
      }
    }

    return validatedOptions;
  }

  async speak(text: string, options?: SpeechOptions): Promise<void> {
    // Ensure service is initialized
    await this.initialize();

    // Validate input
    this.validateText(text);
    const trimmedText = text.trim();

    // Stop any current speech
    if (this._isSpeaking) {
      this.stop();
    }

    const speechOptions = this.validateSpeechOptions({
      ...this.currentOptions,
      ...options
    });
    
    console.log('TTS Service: Final speech options:', speechOptions);
    
    try {
      this._isSpeaking = true;
      this._isPaused = false;
      this._currentText = trimmedText;
      
      await Speech.speak(trimmedText, {
        voice: speechOptions.voice,
        rate: speechOptions.rate,
        pitch: speechOptions.pitch,
        language: speechOptions.language,
        onStart: () => {
          this._isSpeaking = true;
          this._isPaused = false;
        },
        onDone: () => {
          this._isSpeaking = false;
          this._isPaused = false;
          this._currentText = '';
        },
        onStopped: () => {
          this._isSpeaking = false;
          this._isPaused = false;
          this._currentText = '';
        },
        onError: (error) => {
          this._isSpeaking = false;
          this._isPaused = false;
          this._currentText = '';
          
          const ttsError = new TTSError(
            TTSErrorType.SYNTHESIS_FAILED,
            `Speech synthesis failed: ${error}`,
            error as Error
          );
          TTSErrorHandler.logError(ttsError, 'speech synthesis');
          throw ttsError;
        },
      });
    } catch (error) {
      this._isSpeaking = false;
      this._isPaused = false;
      this._currentText = '';
      
      if (error instanceof TTSError) {
        throw error;
      }
      
      throw new TTSError(
        TTSErrorType.SYNTHESIS_FAILED,
        'Failed to synthesize speech',
        error as Error
      );
    }
  }

  stop(): void {
    Speech.stop();
    this._isSpeaking = false;
    this._isPaused = false;
  }

  pause(): void {
    if (this._isSpeaking && !this._isPaused) {
      Speech.pause();
      this._isPaused = true;
    }
  }

  resume(): void {
    if (this._isPaused) {
      Speech.resume();
      this._isPaused = false;
    }
  }

  private async loadVoices(): Promise<void> {
    if (this._voicesLoaded) return;

    try {
      const voices = await Speech.getAvailableVoicesAsync();
      this._availableVoices = voices.map(voice => ({
        identifier: voice.identifier,
        name: voice.name,
        language: voice.language,
        quality: 'default' as 'default' | 'enhanced', // Simplified for now, can be enhanced later
      }));
      this._voicesLoaded = true;
    } catch (error) {
      console.warn('Failed to load available voices:', error);
      this._availableVoices = [];
      this._voicesLoaded = true; // Mark as loaded even if failed to prevent repeated attempts
    }
  }

  async getAvailableVoices(): Promise<Voice[]> {
    await this.initialize();
    return [...this._availableVoices];
  }

  async refreshVoices(): Promise<Voice[]> {
    this._voicesLoaded = false;
    await this.loadVoices();
    return this.getAvailableVoices();
  }

  isSpeaking(): boolean {
    return this._isSpeaking;
  }

  isPaused(): boolean {
    return this._isPaused;
  }

  setDefaultOptions(options: SpeechOptions): void {
    console.log('TTS Service: Setting default options:', options);
    const validatedOptions = this.validateSpeechOptions(options);
    console.log('TTS Service: Validated options:', validatedOptions);
    this.currentOptions = { ...this.currentOptions, ...validatedOptions };
    console.log('TTS Service: Current options after update:', this.currentOptions);
  }

  getDefaultOptions(): SpeechOptions {
    return { ...this.currentOptions };
  }

  getCurrentText(): string {
    return this._currentText;
  }

  getStatus(): SpeechStatus {
    let state = SpeechState.IDLE;
    
    if (this._isSpeaking && this._isPaused) {
      state = SpeechState.PAUSED;
    } else if (this._isSpeaking) {
      state = SpeechState.SPEAKING;
    }

    return {
      state,
      currentText: this._currentText || undefined,
    };
  }

  // Platform-specific optimizations
  getPlatformCapabilities(): {
    supportsPause: boolean;
    supportsVoiceSelection: boolean;
    supportsRateControl: boolean;
    supportsPitchControl: boolean;
  } {
    return {
      supportsPause: Platform.OS === 'ios' || Platform.OS === 'android',
      supportsVoiceSelection: true,
      supportsRateControl: true,
      supportsPitchControl: true,
    };
  }

  // Utility method for chunking long text
  private chunkText(text: string, maxChunkSize = 1000): string[] {
    if (text.length <= maxChunkSize) {
      return [text];
    }

    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      const sentenceWithPunctuation = trimmedSentence + '.';
      
      if (currentChunk.length + sentenceWithPunctuation.length <= maxChunkSize) {
        currentChunk += (currentChunk ? ' ' : '') + sentenceWithPunctuation;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        currentChunk = sentenceWithPunctuation;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks.length > 0 ? chunks : [text];
  }

  async speakLongText(text: string, options?: SpeechOptions): Promise<void> {
    this.validateText(text);
    
    const chunks = this.chunkText(text.trim());
    
    for (let i = 0; i < chunks.length; i++) {
      if (!this._isSpeaking && i > 0) {
        // User stopped playback
        break;
      }
      
      try {
        await this.speak(chunks[i], options);
      } catch (error) {
        // Log error but continue with next chunk if possible
        if (error instanceof TTSError) {
          TTSErrorHandler.logError(error, `long text chunk ${i + 1}`);
          
          // If it's a critical error, stop processing
          if (error.type === TTSErrorType.NOT_SUPPORTED) {
            throw error;
          }
        }
        
        // Continue with next chunk for non-critical errors
        continue;
      }
      
      // Small pause between chunks
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }

  // Error handling utilities
  static handleError(error: unknown): TTSError {
    if (error instanceof TTSError) {
      return error;
    }
    
    return new TTSError(
      TTSErrorType.SYNTHESIS_FAILED,
      'An unexpected error occurred',
      error as Error
    );
  }

  static getUserFriendlyErrorMessage(error: TTSError): string {
    return TTSErrorHandler.getUserFriendlyMessage(error);
  }

  static getErrorRecoveryAction(error: TTSError) {
    return TTSErrorHandler.getRecoveryAction(error);
  }

  // Diagnostic methods
  async runDiagnostics(): Promise<{
    isHealthy: boolean;
    issues: Array<{
      severity: 'error' | 'warning' | 'info';
      message: string;
      solution?: string;
    }>;
  }> {
    const diagnostics = await DeviceCompatibilityChecker.diagnoseIssues();
    
    // Add service-specific checks
    const serviceIssues = [];
    
    if (!this._isInitialized) {
      serviceIssues.push({
        severity: 'warning' as const,
        message: 'TTS service not initialized',
        solution: 'Call initialize() before using TTS features',
      });
    }
    
    if (this._availableVoices.length === 0 && this._voicesLoaded) {
      serviceIssues.push({
        severity: 'warning' as const,
        message: 'No voices available',
        solution: 'Check device TTS settings',
      });
    }

    const allIssues = [...diagnostics.issues, ...serviceIssues];
    const hasErrors = allIssues.some(issue => issue.severity === 'error');
    
    return {
      isHealthy: !hasErrors,
      issues: allIssues,
    };
  }
}

// Singleton instance
export const textToSpeechService = new TextToSpeechService();