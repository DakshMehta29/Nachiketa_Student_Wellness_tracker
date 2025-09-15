import { geminiService } from './geminiService';
import { supabaseService, ChatSession, ChatMessage, ChatMessageDB } from './supabaseService';
import { authConfig, getUserContext } from '../config/auth';

export interface ChatContext {
  user: { id: string; firstName?: string; lastName?: string; primaryEmailAddress?: { emailAddress: string }; createdAt?: Date };
  conversationId: string;
  previousMessages: ChatMessage[];
  userPreferences?: { wellnessFocus?: string; timezone?: string; language?: string; companionMode?: string };
}

export interface ChatResponse {
  success: boolean;
  message: ChatMessage;
  session?: ChatSession;
  error?: string;
}

class ChatService {
  private storageType: string;
  private autoSaveInterval: number;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.storageType = authConfig.chat.storageType;
    this.autoSaveInterval = authConfig.chat.autoSaveInterval;
  }

  // Send message to AI with enhanced context
  async sendMessage(
    content: string,
    context: ChatContext
  ): Promise<ChatResponse> {
    try {
      console.log('ChatService: Starting message processing...');
      
      // Prepare user context
      const userContext = getUserContext(context.user);
      console.log('ChatService: User context prepared:', { 
        userName: userContext.firstName, 
        companionMode: context.userPreferences?.companionMode 
      });
      
      // Prepare conversation history for Gemini
      const conversationHistory = context.previousMessages.map(msg => ({
        role: msg.role as 'user' | 'model',
        parts: [{ text: msg.content }]
      }));

      console.log('ChatService: Calling Gemini API...');
      
      // Generate response using Gemini
      const aiResponse = await geminiService.generateWellnessResponse(content, {
        userName: userContext.firstName,
        userEmail: userContext.email,
        timezone: userContext.preferences?.timezone,
        language: userContext.preferences?.language,
        companionMode: context.userPreferences?.companionMode,
        conversationHistory
      });
      
      console.log('ChatService: Gemini response received:', aiResponse?.substring(0, 100) + '...');

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
        metadata: {
          userId: context.user?.id,
          conversationId: context.conversationId,
          context: userContext
        }
      };

      // Auto-save conversation
      this.scheduleAutoSave(context);

      return {
        success: true,
        message: assistantMessage
      };
    } catch (error) {
      console.error('ChatService: Error sending message:', error);
      
      // Check if it's a network error or API error
      let errorMessage = 'I apologize, but I\'m having trouble connecting right now. ';
      
      if (error instanceof Error) {
        console.error('ChatService: Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        if (error.message.includes('API key')) {
          errorMessage += 'There seems to be an issue with the AI service configuration. ';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage += 'There seems to be a network connectivity issue. ';
        } else if (error.message.includes('timeout')) {
          errorMessage += 'The request is taking longer than expected. ';
        }
      }
      
      errorMessage += 'Please try again in a moment, or contact support if the issue persists.';
      
      // Fallback to local response
      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: errorMessage,
        timestamp: Date.now(),
        metadata: {
          userId: context.user?.id,
          conversationId: context.conversationId,
          context: {
            isFallback: true,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      };

      return {
        success: true,
        message: fallbackMessage
      };
    }
  }


  // Save chat session and message to appropriate storage
  async saveChatSession(session: ChatSession, message: ChatMessageDB): Promise<boolean> {
    try {
      switch (this.storageType) {
        case 'supabase':
          if (supabaseService.isAvailable()) {
            // Save session first
            const sessionSaved = await supabaseService.saveChatSession(session);
            if (!sessionSaved) return false;
            
            // Then save message
            return await supabaseService.saveChatMessage(message);
          }
          // Fallback to local storage
          return this.saveToLocalStorage(session, message);
          
        case 'backend':
          // TODO: Implement backend storage
          return this.saveToLocalStorage(session, message);
          
        case 'local':
        default:
          return this.saveToLocalStorage(session, message);
      }
    } catch (error) {
      console.error('Error saving chat session:', error);
      return false;
    }
  }

  // Load chat session from appropriate storage
  async loadChatSession(sessionId: string, user: { id: string }): Promise<{ session: ChatSession; messages: ChatMessage[] } | null> {
    try {
      switch (this.storageType) {
        case 'supabase':
          if (supabaseService.isAvailable()) {
            return await supabaseService.loadChatSession(sessionId, user.id);
          }
          // Fallback to local storage
          return this.loadFromLocalStorage(sessionId);
          
        case 'backend':
          // TODO: Implement backend storage
          return this.loadFromLocalStorage(sessionId);
          
        case 'local':
        default:
          return this.loadFromLocalStorage(sessionId);
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
      return null;
    }
  }

  // Get all chat sessions for user
  async getUserChatSessions(user: { id: string }): Promise<ChatSession[]> {
    try {
      switch (this.storageType) {
        case 'supabase':
          if (supabaseService.isAvailable()) {
            return await supabaseService.getUserChatSessions(user.id);
          }
          // Fallback to local storage
          return this.getLocalChatSessions();
          
        case 'backend':
          // TODO: Implement backend storage
          return this.getLocalChatSessions();
          
        case 'local':
        default:
          return this.getLocalChatSessions();
      }
    } catch (error) {
      console.error('Error getting user chat sessions:', error);
      return [];
    }
  }

  // Delete chat session
  async deleteChatSession(sessionId: string, user: { id: string }): Promise<boolean> {
    try {
      switch (this.storageType) {
        case 'supabase':
          if (supabaseService.isAvailable()) {
            return await supabaseService.deleteChatSession(sessionId, user.id);
          }
          // Fallback to local storage
          return this.deleteFromLocalStorage(sessionId);
          
        case 'backend':
          // TODO: Implement backend storage
          return this.deleteFromLocalStorage(sessionId);
          
        case 'local':
        default:
          return this.deleteFromLocalStorage(sessionId);
      }
    } catch (error) {
      console.error('Error deleting chat session:', error);
      return false;
    }
  }

  // Schedule auto-save
  private scheduleAutoSave(context: ChatContext) {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      // Auto-save logic will be implemented when we have the full conversation
      console.log('Auto-save triggered for conversation:', context.conversationId);
    }, this.autoSaveInterval);
  }

  // Local storage methods (fallback)
  private saveToLocalStorage(session: ChatSession, message: ChatMessageDB): boolean {
    try {
      const sessionKey = `nachiketa-session-${session.id}`;
      const messageKey = `nachiketa-message-${message.id}`;
      
      localStorage.setItem(sessionKey, JSON.stringify(session));
      localStorage.setItem(messageKey, JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  private loadFromLocalStorage(sessionId: string): { session: ChatSession; messages: ChatMessage[] } | null {
    try {
      const sessionKey = `nachiketa-session-${sessionId}`;
      const sessionData = localStorage.getItem(sessionKey);
      
      if (!sessionData) return null;
      
      const session = JSON.parse(sessionData) as ChatSession;
      
      // Get all messages for this session
      const messages: ChatMessage[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`nachiketa-message-`) && key.includes(sessionId)) {
          const messageData = localStorage.getItem(key);
          if (messageData) {
            try {
              const messageDB = JSON.parse(messageData) as ChatMessageDB;
              messages.push({
                id: messageDB.id,
                role: messageDB.message_type as 'user' | 'assistant' | 'system',
                content: messageDB.content,
                timestamp: new Date(messageDB.created_at).getTime(),
                metadata: {
                  userId: messageDB.user_id,
                  conversationId: messageDB.session_id,
                  context: messageDB.metadata
                }
              });
            } catch (parseError) {
              console.error('Error parsing message:', parseError);
            }
          }
        }
      }
      
      return { session, messages: messages.sort((a, b) => a.timestamp - b.timestamp) };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  private getLocalChatSessions(): ChatSession[] {
    try {
      const sessions: ChatSession[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nachiketa-session-')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              sessions.push(JSON.parse(data));
            } catch (parseError) {
              console.error('Error parsing session:', parseError);
            }
          }
        }
      }
      return sessions.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } catch (error) {
      console.error('Error getting local chat sessions:', error);
      return [];
    }
  }

  private deleteFromLocalStorage(sessionId: string): boolean {
    try {
      // Delete session
      const sessionKey = `nachiketa-session-${sessionId}`;
      localStorage.removeItem(sessionKey);
      
      // Delete all messages for this session
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`nachiketa-message-`) && key.includes(sessionId)) {
          localStorage.removeItem(key);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      return false;
    }
  }

  // Enhanced fallback response with user context
  private getFallbackResponse(userMessage: string, user?: { firstName?: string }): string {
    const userName = user?.firstName || 'there';
    const message = userMessage.toLowerCase();
    
    if (message.includes('sleep') || message.includes('tired') || message.includes('insomnia')) {
      return `Hi ${userName}! I understand you're having sleep concerns. Here are some gentle suggestions:

🌙 **Sleep Hygiene Tips:**
• Try to go to bed and wake up at the same time daily
• Create a relaxing bedtime routine (reading, gentle music, meditation)
• Keep your bedroom cool, dark, and quiet
• Avoid screens 1 hour before bed
• Limit caffeine after 2 PM

💤 **Quick Relaxation:**
Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8. Repeat 4 times.

Remember, good sleep is essential for your mental and physical health. If sleep issues persist, consider speaking with a healthcare provider.`;
    }
    
    if (message.includes('stress') || message.includes('anxious') || message.includes('worried')) {
      return `Hi ${userName}! I hear that you're feeling stressed, and that's completely valid. Here are some gentle ways to help:

🧘 **Immediate Relief:**
• Take 5 deep breaths, counting to 4 on each inhale and exhale
• Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste

💪 **Stress Management:**
• Break large tasks into smaller, manageable steps
• Practice mindfulness or meditation for just 5 minutes daily
• Regular physical activity, even a short walk, can help
• Talk to someone you trust about what's on your mind

Remember, it's okay to feel stressed sometimes. You're doing your best, and that's enough.`;
    }
    
    // Default empathetic response
    return `Hi ${userName}! Thank you for sharing that with me. I'm here to listen and support you on your wellness journey.

💙 **General Wellness Reminders:**
• Take things one day at a time
• Practice self-compassion - you're doing your best
• Small, consistent actions lead to big changes
• It's okay to ask for help when you need it
• Celebrate your progress, no matter how small

Is there a specific area of wellness you'd like to explore together? I'm here to help with sleep, stress management, exercise, nutrition, or just to listen.`;
  }

  // Get storage status
  getStorageStatus(): { type: string; available: boolean; details: string } {
    switch (this.storageType) {
      case 'supabase':
        return {
          type: 'Supabase',
          available: supabaseService.isAvailable(),
          details: supabaseService.isAvailable() 
            ? `Connected to Supabase database`
            : 'Supabase configuration missing'
        };
      case 'backend':
        return {
          type: 'Backend API',
          available: true,
          details: 'Connected to backend API'
        };
      case 'local':
      default:
        return {
          type: 'Local Storage',
          available: true,
          details: 'Using browser local storage'
        };
    }
  }
}

// Create and export singleton instance
export const chatService = new ChatService();
export default chatService;
