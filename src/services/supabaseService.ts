import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { authConfig } from '../config/auth';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    userId?: string;
    conversationId?: string;
    context?: Record<string, unknown>;
  };
}

export interface ChatSession {
  id: string;
  user_id: string;
  session_name: string;
  session_type: 'general' | 'wellness' | 'academic' | 'crisis' | 'goal_setting';
  context_data: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageDB {
  id: string;
  session_id: string;
  user_id: string;
  message_type: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, unknown>;
  tokens_used: number;
  response_time_ms: number;
  sentiment_score: number;
  topics: string[];
  created_at: string;
}

export interface UserWellnessProfile {
  id: string;
  user_id: string;
  
  // Sleep patterns
  sleep_schedule?: string;
  bedtime_preference?: string;
  wake_time_preference?: string;
  sleep_duration_hours?: number;
  sleep_quality_rating?: number;
  sleep_issues?: string[];
  
  // Exercise habits
  exercise_frequency?: string;
  preferred_exercise_types?: string[];
  exercise_duration_minutes?: number;
  fitness_level?: string;
  
  // Nutrition habits
  meal_frequency?: number;
  dietary_preferences?: string[];
  water_intake_glasses?: number;
  nutrition_concerns?: string[];
  
  // Mental health & stress
  stress_level?: number;
  stress_sources?: string[];
  coping_strategies?: string[];
  mood_patterns?: string;
  
  // Academic/Work life
  study_work_hours?: number;
  academic_workload?: string;
  productivity_peak_time?: string;
  
  // Social life
  social_activity_level?: string;
  social_support_quality?: number;
  
  // Goals and motivations
  primary_wellness_goals?: string[];
  motivation_level?: number;
  previous_wellness_experience?: string;
  
  // Additional information
  health_conditions?: string[];
  medications?: string[];
  lifestyle_factors?: string[];
  
  // Metadata
  is_completed: boolean;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Check if Supabase is configured, but don't throw error immediately
    if (!authConfig.supabase.url || !authConfig.supabase.anonKey) {
      console.warn('Supabase configuration is missing. Using local fallback mode.');
      // Create a mock client for local development
      this.supabase = null as unknown as SupabaseClient;
    } else {
      this.supabase = createClient(
        authConfig.supabase.url,
        authConfig.supabase.anonKey
      );
    }
  }

  // Save chat session to Supabase
  async saveChatSession(session: ChatSession): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('chat_sessions')
        .upsert({
          id: session.id,
          user_id: session.user_id,
          session_name: session.session_name,
          session_type: session.session_type,
          context_data: session.context_data,
          is_active: session.is_active,
          created_at: session.created_at,
          updated_at: session.updated_at,
        });

      if (error) {
        console.error('Error saving chat session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving chat session:', error);
      return false;
    }
  }

  // Save chat message to Supabase
  async saveChatMessage(message: ChatMessageDB): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('chat_messages')
        .insert({
          id: message.id,
          session_id: message.session_id,
          user_id: message.user_id,
          message_type: message.message_type,
          content: message.content,
          metadata: message.metadata,
          tokens_used: message.tokens_used,
          response_time_ms: message.response_time_ms,
          sentiment_score: message.sentiment_score,
          topics: message.topics,
          created_at: message.created_at,
        });

      if (error) {
        console.error('Error saving chat message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving chat message:', error);
      return false;
    }
  }

  // Load chat session and messages from Supabase
  async loadChatSession(sessionId: string, userId: string): Promise<{ session: ChatSession; messages: ChatMessage[] } | null> {
    try {
      // Get chat session
      const { data: sessionData, error: sessionError } = await this.supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (sessionError) {
        console.error('Error loading chat session:', sessionError);
        return null;
      }

      // Get chat messages for this session
      const { data: messagesData, error: messagesError } = await this.supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error loading chat messages:', messagesError);
        return null;
      }

      if (!sessionData) {
        return null;
      }

      // Convert database messages to our format
      const messages: ChatMessage[] = (messagesData || []).map(msg => ({
        id: msg.id,
        role: msg.message_type as 'user' | 'assistant' | 'system',
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
        metadata: {
          userId: msg.user_id,
          conversationId: msg.session_id,
          context: msg.metadata
        }
      }));

      return {
        session: sessionData as ChatSession,
        messages
      };
    } catch (error) {
      console.error('Error loading chat session:', error);
      return null;
    }
  }

  // Get all chat sessions for a user
  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      const { data, error } = await this.supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error getting user chat sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting user chat sessions:', error);
      return [];
    }
  }

  // Delete chat session from Supabase
  async deleteChatSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      // First delete all messages in the session
      const { error: messagesError } = await this.supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', userId);

      if (messagesError) {
        console.error('Error deleting chat messages:', messagesError);
        return false;
      }

      // Then delete the session
      const { error: sessionError } = await this.supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (sessionError) {
        console.error('Error deleting chat session:', sessionError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting chat session:', error);
      return false;
    }
  }

  // Update chat session name
  async updateChatSessionName(sessionId: string, userId: string, sessionName: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('chat_sessions')
        .update({ 
          session_name: sessionName,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating chat session name:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating chat session name:', error);
      return false;
    }
  }

  // Check if Supabase is available
  isAvailable(): boolean {
    return !!(authConfig.supabase.url && authConfig.supabase.anonKey && this.supabase);
  }

  // Local storage fallback methods
  private getLocalStorageKey(userId: string, type: string): string {
    return `manasfit_${type}_${userId}`;
  }

  private saveToLocalStorage(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getFromLocalStorage(key: string): unknown {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('conversations')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  // ========================================
  // WELLNESS PROFILE METHODS
  // ========================================

  // Save user wellness profile
  async saveUserWellnessProfile(userId: string, profileData: Partial<UserWellnessProfile>): Promise<boolean> {
    try {
      if (!this.isAvailable()) {
        // Use local storage fallback
        const key = this.getLocalStorageKey(userId, 'wellness_profile');
        const existingData = this.getFromLocalStorage(key) || {};
        const updatedData = {
          ...existingData,
          ...profileData,
          user_id: userId,
          updated_at: new Date().toISOString()
        };
        this.saveToLocalStorage(key, updatedData);
        return true;
      }

      const { error } = await this.supabase
        .from('user_wellness_profile')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving user wellness profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving user wellness profile:', error);
      return false;
    }
  }

  // Get user wellness profile
  async getUserWellnessProfile(userId: string): Promise<UserWellnessProfile | null> {
    try {
      if (!this.isAvailable()) {
        // Use local storage fallback
        const key = this.getLocalStorageKey(userId, 'wellness_profile');
        return this.getFromLocalStorage(key) as UserWellnessProfile | null;
      }

      const { data, error } = await this.supabase
        .from('user_wellness_profile')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found - user doesn't have a profile yet
          return null;
        }
        console.error('Error getting user wellness profile:', error);
        return null;
      }

      return data as UserWellnessProfile;
    } catch (error) {
      console.error('Error getting user wellness profile:', error);
      return null;
    }
  }

  // Update user wellness profile
  async updateUserWellnessProfile(userId: string, updates: Partial<UserWellnessProfile>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_wellness_profile')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating user wellness profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating user wellness profile:', error);
      return false;
    }
  }

  // Delete user wellness profile
  async deleteUserWellnessProfile(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_wellness_profile')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting user wellness profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting user wellness profile:', error);
      return false;
    }
  }

  // Check if user has completed wellness profile
  async hasCompletedWellnessProfile(userId: string): Promise<boolean> {
    try {
      if (!this.isAvailable()) {
        // For local storage, check if we have any wellness entries
        const entries = await this.getWellnessEntries(userId, 1);
        return entries.length > 0;
      }
      
      const profile = await this.getUserWellnessProfile(userId);
      return profile ? profile.is_completed : false;
    } catch (error) {
      console.error('Error checking wellness profile completion:', error);
      return false;
    }
  }

  // Get wellness entries for local storage fallback
  async getWellnessEntries(userId: string, days: number = 30): Promise<unknown[]> {
    if (!this.isAvailable()) {
      const key = this.getLocalStorageKey(userId, 'wellness_entries');
      const entries = this.getFromLocalStorage(key) || [];
      // Return entries from the last N days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return (entries as Array<{entry_date: string}>).filter((entry) => new Date(entry.entry_date) >= cutoffDate);
    }
    // Supabase implementation would go here
    return [];
  }

  // Save wellness entry for local storage fallback
  async saveWellnessEntry(userId: string, entryData: Record<string, unknown>): Promise<boolean> {
    if (!this.isAvailable()) {
      const key = this.getLocalStorageKey(userId, 'wellness_entries');
      const entries = (this.getFromLocalStorage(key) as Array<Record<string, unknown>>) || [];
      
      // Update or add entry
      const existingIndex = entries.findIndex((entry) => entry.entry_date === entryData.entry_date);
      if (existingIndex >= 0) {
        entries[existingIndex] = { ...entries[existingIndex], ...entryData };
      } else {
        entries.push({
          id: `local_${Date.now()}`,
          user_id: userId,
          ...entryData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      this.saveToLocalStorage(key, entries);
      return true;
    }
    // Supabase implementation would go here
    return false;
  }

  // Ensure user profile exists
  async ensureUserProfile(userId: string): Promise<boolean> {
    try {
      if (!this.isAvailable()) {
        console.log('Supabase not available, skipping profile check');
        return true; // Skip if Supabase not available
      }

      console.log('Checking if user profile exists for:', userId);

      // Check if user profile exists
      const { data: existingProfile, error: checkError } = await this.supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          console.log('User profile does not exist, will create one');
        } else {
          console.error('Error checking user profile:', {
            code: checkError.code,
            message: checkError.message,
            details: checkError.details,
            hint: checkError.hint
          });
          // If there's an auth/RLS issue, return true to continue with local storage
          if (checkError.code === 'PGRST301' || checkError.message?.includes('JWT')) {
            console.log('Authentication issue detected, will use local storage fallback');
            return true;
          }
          return false;
        }
      }

      if (existingProfile) {
        console.log('User profile already exists');
        return true; // Profile already exists
      }

      console.log('Creating user profile for:', userId);
      // Create user profile if it doesn't exist
      const { error: createError } = await this.supabase
        .from('user_profiles')
        .insert({
          id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (createError) {
        console.error('Error creating user profile:', {
          code: createError.code,
          message: createError.message,
          details: createError.details,
          hint: createError.hint
        });
        // If there's an auth/RLS issue, return true to continue with local storage
        if (createError.code === 'PGRST301' || createError.message?.includes('JWT')) {
          console.log('Authentication issue detected, will use local storage fallback');
          return true;
        }
        return false;
      }

      console.log('Successfully created user profile for:', userId);
      return true;
    } catch (error) {
      console.error('Unexpected error ensuring user profile:', error);
      // Return true to allow fallback to local storage
      return true;
    }
  }

  // Save user companion selection
  async saveUserCompanionSelection(userId: string, selection: { type: 'pet' | 'companion'; character?: string; companion_type?: string }): Promise<boolean> {
    try {
      console.log('Attempting to save companion selection:', { userId, selection });
      
      // Always save to local storage first as a fallback
      const key = this.getLocalStorageKey(userId, 'companion_selection');
      this.saveToLocalStorage(key, {
        ...selection,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      console.log('Saved to local storage successfully');
      
      if (!this.isAvailable()) {
        console.log('Supabase not available, using local storage only');
        return true;
      }

      // Try to ensure user profile exists first
      const profileExists = await this.ensureUserProfile(userId);
      if (!profileExists) {
        console.log('Profile check failed, but local storage saved successfully');
        return true; // Still return true since local storage worked
      }

      console.log('Supabase available, attempting to save to database');
      const { data, error } = await this.supabase
        .from('user_companion_selection')
        .upsert({
          user_id: userId,
          companion_type: selection.type,
          character: selection.character,
          companion_subtype: selection.companion_type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Database error saving companion selection:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // If it's an auth/RLS issue, still return true since local storage worked
        if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.code === 'PGRST301') {
          console.log('Authentication/RLS issue detected, but local storage saved successfully');
          return true;
        }
        
        console.log('Database save failed, but local storage saved successfully');
        return true; // Still return true since local storage worked
      }

      console.log('Successfully saved companion selection to database:', data);
      return true;
    } catch (error) {
      console.error('Unexpected error saving companion selection:', error);
      console.log('Error occurred, but local storage was saved successfully');
      return true; // Still return true since local storage worked
    }
  }

  // Get user companion selection
  async getUserCompanionSelection(userId: string): Promise<{ type: 'pet' | 'companion'; character?: string; companion_type?: string } | null> {
    try {
      console.log('Getting companion selection for user:', userId);
      
      // Always try local storage first
      const key = this.getLocalStorageKey(userId, 'companion_selection');
      const localData = this.getFromLocalStorage(key) as any;
      if (localData) {
        console.log('Found companion selection in local storage:', localData);
        return {
          type: localData.companion_type,
          character: localData.character,
          companion_type: localData.companion_subtype
        };
      }

      if (!this.isAvailable()) {
        console.log('Supabase not available, using local storage only');
        return null;
      }

      console.log('Attempting to get companion selection from database');
      const { data, error } = await this.supabase
        .from('user_companion_selection')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No companion selection found in database');
          return null;
        }
        console.error('Error getting companion selection from database:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // If it's an auth/RLS issue, return null but don't throw
        if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
          console.log('Authentication issue detected, returning null');
          return null;
        }
        
        return null;
      }

      console.log('Successfully retrieved companion selection from database:', data);
      return {
        type: data.companion_type,
        character: data.character,
        companion_type: data.companion_subtype
      };
    } catch (error) {
      console.error('Unexpected error getting companion selection:', error);
      return null;
    }
  }
}

// Create and export singleton instance
export const supabaseService = new SupabaseService();
export default supabaseService;
