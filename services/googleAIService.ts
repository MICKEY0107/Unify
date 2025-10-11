import { GoogleGenerativeAI } from '@google/generative-ai';

// Google AI configuration
const API_KEY = 'AIzaSyBS8MOynnTtKaFsItciTAyqcX4mCw_vGgE';

export interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
}

export class GoogleAIService {
  private static instance: GoogleAIService;
  private genAI: GoogleGenerativeAI;
  private model: any;

  private constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  public static getInstance(): GoogleAIService {
    if (!GoogleAIService.instance) {
      GoogleAIService.instance = new GoogleAIService();
    }
    return GoogleAIService.instance;
  }

  public async generateResponse(userMessage: string): Promise<string> {
    try {
      // Create a context-aware prompt for disability and mental health support
      const contextPrompt = `You are an AI assistant for "Unify", an accessibility and disability inclusion app. Your role is to provide helpful, empathetic, and accurate information about:

1. Disability awareness and inclusion
2. Mental health support and resources
3. Accessibility best practices
4. Communication etiquette with people with disabilities
5. Assistive technologies and tools
6. Support resources and organizations

Guidelines:
- Be empathetic, respectful, and inclusive in your responses
- Provide practical, actionable advice when possible
- For medical questions, always recommend consulting healthcare professionals
- Focus on empowerment and independence
- Use person-first language (e.g., "person with a disability" not "disabled person")
- If you don't know something, admit it and suggest reliable resources

User question: ${userMessage}

Please provide a helpful, supportive response:`;

      const result = await this.model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();
      
      return text || "I'm sorry, I couldn't generate a response at the moment. Please try again.";
    } catch (error) {
      console.error('Google AI Service Error:', error);
      
      // Provide fallback responses based on common topics
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Disability awareness
    if (message.includes('disability') || message.includes('disabled')) {
      return "Disability is a natural part of human diversity. People with disabilities have the same rights to participate fully in society. The key is focusing on the person first, not their disability, and ensuring equal access and opportunities for everyone.";
    }
    
    // Mental health
    if (message.includes('mental health') || message.includes('depression') || message.includes('anxiety')) {
      return "Mental health is just as important as physical health. If you're struggling, please know that help is available. Consider reaching out to a mental health professional, trusted friend, or crisis helpline. You're not alone, and seeking help is a sign of strength.";
    }
    
    // Accessibility
    if (message.includes('accessibility') || message.includes('accessible')) {
      return "Accessibility means designing products, services, and environments that can be used by people with disabilities. This includes things like ramps, screen readers, captions, and clear signage. Good accessibility benefits everyone, not just people with disabilities.";
    }
    
    // Communication
    if (message.includes('communication') || message.includes('talk') || message.includes('speak')) {
      return "When communicating with people with disabilities, treat them with the same respect you would anyone else. Speak directly to them, not their companion or interpreter. Ask before providing assistance, and don't make assumptions about their abilities.";
    }
    
    // Sign language
    if (message.includes('sign language') || message.includes('deaf') || message.includes('hearing')) {
      return "Sign language is a complete, natural language with its own grammar and syntax. In India, Indian Sign Language (ISL) is used by the deaf community. Learning basic signs can help you communicate more effectively with deaf and hard-of-hearing individuals.";
    }
    
    // Default response
    return "Thank you for your question about disabilities and accessibility. I'm here to provide information and support. For specific medical advice or crisis situations, please consult with healthcare professionals or contact appropriate emergency services. How else can I help you today?";
  }

  public async generateWelcomeMessage(): Promise<string> {
    return "Hello! I'm your AI assistant for disability awareness and mental health support. I'm here to help you learn about accessibility, inclusion, and provide guidance on various topics related to disabilities. How can I assist you today?";
  }

  // Method to validate if the service is working
  public async testConnection(): Promise<boolean> {
    try {
      const testResponse = await this.generateResponse("Hello");
      return testResponse.length > 0;
    } catch (error) {
      console.error('Google AI Service test failed:', error);
      return false;
    }
  }
}

export const googleAIService = GoogleAIService.getInstance();