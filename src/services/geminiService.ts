import { authConfig } from '../config/auth';
import { getRandomTrainingQuestions } from '../data/aiTrainingData';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
    finishReason: string;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

class GeminiService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    this.apiKey = authConfig.gemini.apiKey;
    this.apiUrl = authConfig.gemini.apiUrl;
    this.model = authConfig.gemini.model;

    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured');
    }
    
    console.log('GeminiService: Initialized with config:', {
      apiUrl: this.apiUrl,
      model: this.model,
      hasApiKey: !!this.apiKey
    });
  }

  // Send message to Gemini API
  async sendMessage(messages: GeminiMessage[]): Promise<string> {
    try {
      console.log('GeminiService: Sending request to API...', {
        apiUrl: this.apiUrl,
        model: this.model,
        messageCount: messages.length
      });
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${this.apiUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      console.log('GeminiService: Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('GeminiService: API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('GeminiService: Response data received:', {
        candidatesCount: data.candidates?.length || 0,
        usageMetadata: data.usageMetadata
      });

      if (!data.candidates || data.candidates.length === 0) {
        console.error('GeminiService: No candidates in response:', data);
        throw new Error('No response from Gemini');
      }

      clearTimeout(timeoutId);
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('GeminiService: Error calling API:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - The AI service is taking too long to respond. Please try again.');
      }
      
      throw error;
    }
  }

  // Generate a wellness-focused response
  async generateWellnessResponse(
    userMessage: string,
    context: {
      userName?: string;
      userEmail?: string;
      timezone?: string;
      language?: string;
      companionMode?: string;
      conversationHistory?: GeminiMessage[];
    }
  ): Promise<string> {
    // Get companion-specific instructions
    const companionInstructions = this.getCompanionInstructions(context.companionMode || 'mentor');
    
    // Get training examples for this companion mode
    const trainingExamples = getRandomTrainingQuestions(context.companionMode || 'mentor', 5);
    const exampleQuestions = trainingExamples.length > 0 ? 
      `\n**Example questions I can help with:**\n${trainingExamples.map(q => `- ${q}`).join('\n')}` : '';
    
    const systemPrompt = `You are Nachiketa, an empathetic AI wellness companion. You are having a conversation with ${context.userName || 'there'} (${context.userEmail || 'user'}).

**User Context:**
- Name: ${context.userName || 'there'}
- Timezone: ${context.timezone || 'UTC'}
- Language: ${context.language || 'en'}
- Companion Mode: ${context.companionMode || 'mentor'}

**Your Role:**
${companionInstructions.role}

**Specialized Focus:**
${companionInstructions.focus}

**Training Context:**
You have been trained on hundreds of questions related to your specialty. Use this knowledge to provide expert, personalized responses.${exampleQuestions}

**Response Guidelines:**
- Always address the user by name when appropriate
- Be empathetic, supportive, and encouraging
- Provide practical, actionable advice
- Consider their timezone for time-sensitive suggestions
- Keep responses conversational and warm
- Remember previous context in the conversation
- Suggest personalized strategies based on their needs
- ${companionInstructions.guidelines}
- Draw from your training to provide comprehensive, expert-level responses

**Current Time:** ${new Date().toLocaleString('en-US', { timeZone: context.timezone || 'UTC' })}

Always respond with empathy, provide practical advice, and encourage positive changes. Keep responses conversational, supportive, and actionable.`;

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      ...(context.conversationHistory || []),
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    return this.sendMessage(messages);
  }

  // Get companion-specific instructions
  private getCompanionInstructions(companionMode: string): { role: string; focus: string; guidelines: string } {
    switch (companionMode) {
      case 'mentor':
        return {
          role: 'You are a wise and experienced mentor AI, specializing in academic guidance, career advice, and personal development.',
          focus: 'Academic success, career planning, study strategies, time management, goal setting, and personal growth.',
          guidelines: 'Provide structured advice, suggest learning resources, help with academic planning, and guide career decisions.'
        };
      
      case 'buddy':
        return {
          role: 'You are a friendly and supportive buddy AI, like a close friend who listens and provides casual, empathetic support.',
          focus: 'Casual conversation, emotional support, friendship, daily life discussions, and general companionship.',
          guidelines: 'Be conversational and friendly, share relatable experiences, provide emotional support, and maintain a warm, approachable tone.'
        };
      
      case 'fitness_trainer':
        return {
          role: 'You are a knowledgeable fitness trainer AI, specializing in physical wellness, exercise, and nutrition.',
          focus: 'Exercise routines, fitness goals, nutrition advice, workout planning, physical health, and wellness tracking.',
          guidelines: 'Provide specific exercise recommendations, nutrition tips, fitness tracking advice, and motivation for physical wellness goals.'
        };
      
      case 'smart_router':
        return {
          role: 'You are an intelligent routing AI that analyzes user queries and provides the most appropriate response or guidance.',
          focus: 'Query analysis, intent detection, routing to appropriate specialists, and providing comprehensive initial responses.',
          guidelines: 'Analyze the user\'s query to determine the best approach, provide initial guidance, and suggest when to switch to specialized companions.'
        };
      
      default:
        return {
          role: 'You are a general wellness companion AI, providing balanced support across all areas of wellness.',
          focus: 'General wellness, mental health, lifestyle balance, and holistic health support.',
          guidelines: 'Provide well-rounded advice covering multiple wellness aspects, suggest when specialized help might be beneficial.'
        };
    }
  }

  // Check if Gemini is available
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.sendMessage([
        {
          role: 'user',
          parts: [{ text: 'Hello, this is a test message.' }]
        }
      ]);
      return true;
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }
}

// Create and export singleton instance
export const geminiService = new GeminiService();
export default geminiService;
