import AsyncStorage from '@react-native-async-storage/async-storage';

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

const STORAGE_KEYS = {
  FAVORITES: '@tts_favorites',
  SETTINGS: '@tts_settings',
} as const;

const DEFAULT_SETTINGS: TTSSettings = {
  defaultRate: 1.0,
  defaultPitch: 1.0,
  autoSave: false,
};

const MAX_FAVORITES = 50; // Limit to prevent storage bloat
const MAX_FAVORITE_TEXT_LENGTH = 2000;

export class StorageService {
  private validateFavoriteText(text: string): void {
    if (!text || typeof text !== 'string') {
      throw new Error('Text must be a non-empty string');
    }
    
    const trimmedText = text.trim();
    if (!trimmedText) {
      throw new Error('Text cannot be empty or contain only whitespace');
    }
    
    if (trimmedText.length > MAX_FAVORITE_TEXT_LENGTH) {
      throw new Error(`Text is too long (maximum ${MAX_FAVORITE_TEXT_LENGTH} characters)`);
    }
  }

  private validateTitle(title: string): void {
    if (title && title.length > 100) {
      throw new Error('Title is too long (maximum 100 characters)');
    }
  }

  async saveFavorite(text: string, title?: string): Promise<void> {
    try {
      // Validate inputs
      this.validateFavoriteText(text);
      if (title) {
        this.validateTitle(title);
      }

      const favorites = await this.getFavorites();
      
      // Check for duplicates
      const trimmedText = text.trim();
      const existingFavorite = favorites.find(fav => fav.text === trimmedText);
      if (existingFavorite) {
        throw new Error('This text is already saved as a favorite');
      }
      
      // Check favorites limit
      if (favorites.length >= MAX_FAVORITES) {
        throw new Error(`Maximum ${MAX_FAVORITES} favorites allowed. Please delete some favorites first.`);
      }

      const newFavorite: FavoriteText = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
        text: trimmedText,
        title: title?.trim() || this.generateAutoTitle(trimmedText),
        createdAt: new Date(),
      };

      const updatedFavorites = [newFavorite, ...favorites];
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to save favorite: ${error}`);
    }
  }

  private generateAutoTitle(text: string): string {
    // Generate a smart title from the text
    const words = text.split(/\s+/);
    if (words.length <= 8) {
      return text;
    }
    
    // Take first 8 words and add ellipsis
    return words.slice(0, 8).join(' ') + '...';
  }

  async getFavorites(): Promise<FavoriteText[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!favoritesJson) {
        return [];
      }

      const favorites = JSON.parse(favoritesJson);
      return favorites.map((fav: any) => ({
        ...fav,
        createdAt: new Date(fav.createdAt),
      }));
    } catch (error) {
      console.warn('Failed to load favorites:', error);
      return [];
    }
  }

  async deleteFavorite(id: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    } catch (error) {
      throw new Error(`Failed to delete favorite: ${error}`);
    }
  }

  async saveSettings(settings: Partial<TTSSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
    } catch (error) {
      throw new Error(`Failed to save settings: ${error}`);
    }
  }

  async getSettings(): Promise<TTSSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!settingsJson) {
        return DEFAULT_SETTINGS;
      }

      const settings = JSON.parse(settingsJson);
      return { ...DEFAULT_SETTINGS, ...settings };
    } catch (error) {
      console.warn('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  async updateFavorite(id: string, updates: Partial<Pick<FavoriteText, 'text' | 'title'>>): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const favoriteIndex = favorites.findIndex(fav => fav.id === id);
      
      if (favoriteIndex === -1) {
        throw new Error('Favorite not found');
      }

      // Validate updates
      if (updates.text !== undefined) {
        this.validateFavoriteText(updates.text);
      }
      if (updates.title !== undefined) {
        this.validateTitle(updates.title);
      }

      // Apply updates
      const updatedFavorite = {
        ...favorites[favoriteIndex],
        ...updates,
      };

      favorites[favoriteIndex] = updatedFavorite;
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to update favorite: ${error}`);
    }
  }

  async reorderFavorites(favoriteIds: string[]): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const reorderedFavorites: FavoriteText[] = [];

      // Reorder based on provided IDs
      for (const id of favoriteIds) {
        const favorite = favorites.find(fav => fav.id === id);
        if (favorite) {
          reorderedFavorites.push(favorite);
        }
      }

      // Add any favorites not in the reorder list
      for (const favorite of favorites) {
        if (!favoriteIds.includes(favorite.id)) {
          reorderedFavorites.push(favorite);
        }
      }

      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(reorderedFavorites));
    } catch (error) {
      throw new Error(`Failed to reorder favorites: ${error}`);
    }
  }

  async exportFavorites(): Promise<string> {
    try {
      const favorites = await this.getFavorites();
      return JSON.stringify(favorites, null, 2);
    } catch (error) {
      throw new Error(`Failed to export favorites: ${error}`);
    }
  }

  async importFavorites(favoritesJson: string, merge = false): Promise<void> {
    try {
      const importedFavorites = JSON.parse(favoritesJson) as FavoriteText[];
      
      // Validate imported data
      if (!Array.isArray(importedFavorites)) {
        throw new Error('Invalid favorites data format');
      }

      // Validate each favorite
      for (const favorite of importedFavorites) {
        if (!favorite.id || !favorite.text || !favorite.title || !favorite.createdAt) {
          throw new Error('Invalid favorite data structure');
        }
        this.validateFavoriteText(favorite.text);
        this.validateTitle(favorite.title);
      }

      let finalFavorites = importedFavorites;

      if (merge) {
        const existingFavorites = await this.getFavorites();
        const existingTexts = new Set(existingFavorites.map(fav => fav.text));
        
        // Only add non-duplicate favorites
        const newFavorites = importedFavorites.filter(fav => !existingTexts.has(fav.text));
        finalFavorites = [...existingFavorites, ...newFavorites];
      }

      // Respect favorites limit
      if (finalFavorites.length > MAX_FAVORITES) {
        finalFavorites = finalFavorites.slice(0, MAX_FAVORITES);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(finalFavorites));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to import favorites: ${error}`);
    }
  }

  async getStorageInfo(): Promise<{
    favoritesCount: number;
    maxFavorites: number;
    storageUsed: number; // Approximate bytes
  }> {
    try {
      const favorites = await this.getFavorites();
      const settings = await this.getSettings();
      
      const favoritesSize = JSON.stringify(favorites).length;
      const settingsSize = JSON.stringify(settings).length;
      
      return {
        favoritesCount: favorites.length,
        maxFavorites: MAX_FAVORITES,
        storageUsed: favoritesSize + settingsSize,
      };
    } catch (error) {
      throw new Error(`Failed to get storage info: ${error}`);
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.FAVORITES, STORAGE_KEYS.SETTINGS]);
    } catch (error) {
      throw new Error(`Failed to clear data: ${error}`);
    }
  }

  async clearFavorites(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
    } catch (error) {
      throw new Error(`Failed to clear favorites: ${error}`);
    }
  }

  async resetSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      throw new Error(`Failed to reset settings: ${error}`);
    }
  }
}

// Singleton instance
export const storageService = new StorageService();