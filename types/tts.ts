// Core TTS Types
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

// Storage Types
export interface FavoriteText {
  id: string;
  text: string;
  title: string;
  createdAt: Date;
}

export interface TTSSettings {
  defaultVoice?: string;
  defaultRate: number;
  defaultPitch: number;
  autoSave: boolean;
}

export interface TTSConfiguration {
  voice: {
    identifier: string;
    name: string;
    language: string;
  };
  rate: number; // 0.1 to 2.0
  pitch: number; // 0.5 to 2.0
  volume: number; // 0.0 to 1.0
}

// Error Types
export enum TTSErrorType {
  NOT_SUPPORTED = 'not_supported',
  VOICE_UNAVAILABLE = 'voice_unavailable',
  SYNTHESIS_FAILED = 'synthesis_failed',
  AUDIO_INTERRUPTED = 'audio_interrupted',
  STORAGE_ERROR = 'storage_error',
  VALIDATION_ERROR = 'validation_error'
}

export interface TTSError {
  type: TTSErrorType;
  message: string;
  originalError?: Error;
}

// Service Interfaces
export interface TTSService {
  speak(text: string, options?: SpeechOptions): Promise<void>;
  stop(): void;
  pause(): void;
  resume(): void;
  getAvailableVoices(): Promise<Voice[]>;
  isSpeaking(): boolean;
  isPaused(): boolean;
  setDefaultOptions(options: SpeechOptions): void;
  getDefaultOptions(): SpeechOptions;
}

export interface StorageService {
  saveFavorite(text: string, title?: string): Promise<void>;
  getFavorites(): Promise<FavoriteText[]>;
  deleteFavorite(id: string): Promise<void>;
  saveSettings(settings: Partial<TTSSettings>): Promise<void>;
  getSettings(): Promise<TTSSettings>;
  clearAllData(): Promise<void>;
}

// Hook Types
export interface UseTTSReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isLoading: boolean;
  error: string | null;
  voices: Voice[];
  currentVoice: Voice | null;
  setVoice: (voice: Voice) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;
  settings: TTSSettings;
  updateSettings: (settings: Partial<TTSSettings>) => Promise<void>;
}

// Component Props Types
export interface TTSControlsProps {
  text: string;
  onTextChange: (text: string) => void;
  disabled?: boolean;
}

export interface VoiceSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export interface FavoritesListProps {
  onSelectFavorite: (text: string) => void;
}

export interface FavoriteItemProps {
  favorite: FavoriteText;
  onSelect: (text: string) => void;
  onDelete: (id: string) => void;
}