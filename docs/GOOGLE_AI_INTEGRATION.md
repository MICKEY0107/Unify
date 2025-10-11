# Google AI Chatbot Integration

## Overview
The Unify app now includes a live AI chatbot powered by Google's Gemini AI model. The chatbot is specifically designed to provide helpful, empathetic support for disability awareness and mental health topics.

## Features
- **Context-Aware Responses**: The AI is trained to provide relevant information about disabilities, accessibility, and mental health
- **Real-time Interaction**: Live responses from Google's Gemini 1.5 Flash model
- **Fallback Support**: If the AI service is unavailable, the chatbot provides helpful fallback responses
- **User-Friendly Interface**: 
  - Loading indicators while AI is thinking
  - Character counter (500 character limit)
  - Disabled send button when loading
  - Typing indicator
  - **Markdown Support**: Rich text formatting for AI responses

## Technical Implementation

### Service Architecture
- **GoogleAIService**: Singleton service that manages AI interactions
- **API Key**: Configured with the provided Google AI Studio key
- **Model**: Uses Gemini 1.5 Flash for fast, accurate responses
- **Error Handling**: Comprehensive error handling with fallback responses

### Key Components
1. **Context Prompting**: Each user message is enhanced with context about the app's purpose
2. **Markdown Rendering**: Custom React Native component that renders markdown formatting
3. **Response Validation**: Ensures responses are appropriate and helpful
4. **Fallback Logic**: Provides relevant responses even when AI service is unavailable

### Usage in App
The chatbot is integrated into the Assistive Tools screen (`/assistive`) and provides:
- Disability awareness information
- Mental health support guidance
- Accessibility best practices
- Communication etiquette tips
- Resource recommendations

## Markdown Support
The chatbot now supports rich text formatting through a custom `MarkdownText` component:

### Supported Formatting
- **Bold text**: `**text**` renders as bold
- **Italic text**: `*text*` renders as italic
- **Headers**: `# Header` with multiple levels (H1-H6)
- **Bullet points**: `* item` or `- item` with nesting support
- **Numbered lists**: `1. item` converted to bullet points
- **Inline code**: `` `code` `` with monospace font and background
- **Code blocks**: ``` code ``` with syntax highlighting background

### Features
- Nested bullet points with proper indentation
- Mixed formatting within text (bold + italic)
- Proper spacing and line breaks
- Mobile-optimized styling
- Accessibility-friendly rendering

## API Configuration
- **API Key**: `AIzaSyBS8MOynnTtKaFsItciTAyqcX4mCw_vGgE`
- **Model**: `gemini-1.5-flash`
- **Character Limit**: 500 characters per message
- **Response Guidelines**: Empathetic, inclusive, person-first language

## Safety Features
- Always recommends consulting healthcare professionals for medical advice
- Provides crisis support resources when appropriate
- Uses person-first language and inclusive terminology
- Focuses on empowerment and independence

## Testing
To test the integration:
1. Navigate to the Assistive Tools screen
2. Scroll to the "AI Support Chatbot" section
3. Type a question about disabilities or mental health
4. Observe the AI response and interaction flow

## Future Enhancements
- Voice input integration
- Multi-language support
- Conversation history persistence
- Advanced context awareness
- Integration with app's learning modules