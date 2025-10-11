const IMGBB_API_KEY = '24196888d24258ecac028845c0b9aeea';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

class ImgBBService {
  private static instance: ImgBBService;

  private constructor() {}

  public static getInstance(): ImgBBService {
    if (!ImgBBService.instance) {
      ImgBBService.instance = new ImgBBService();
    }
    return ImgBBService.instance;
  }

  public async uploadImage(imageData: string, filename?: string): Promise<string> {
    try {
      // Convert base64 data if it includes data URL prefix
      const base64Data = imageData.includes(',') 
        ? imageData.split(',')[1] 
        : imageData;

      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', base64Data);
      
      if (filename) {
        formData.append('name', filename);
      }

      const response = await fetch(IMGBB_API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ImgBBResponse = await response.json();

      if (!result.success) {
        throw new Error('Image upload failed');
      }

      console.log('Image uploaded successfully:', result.data.url);
      return result.data.url;
    } catch (error) {
      console.error('ImgBB upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  public async uploadImageFromUri(imageUri: string, filename?: string): Promise<string> {
    try {
      // For React Native, we need to convert the image to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64 = reader.result as string;
            const imageUrl = await this.uploadImage(base64, filename);
            resolve(imageUrl);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to process image');
    }
  }

  public async deleteImage(deleteUrl: string): Promise<boolean> {
    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  public validateImageFile(imageUri: string): boolean {
    // Basic validation for image file types
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const extension = imageUri.toLowerCase().split('.').pop();
    
    if (!extension) {
      return false;
    }

    return validExtensions.includes(`.${extension}`);
  }

  public getImageSizeLimit(): number {
    // ImgBB free tier limit is 32MB
    return 32 * 1024 * 1024; // 32MB in bytes
  }
}

export const imgBBService = ImgBBService.getInstance();
