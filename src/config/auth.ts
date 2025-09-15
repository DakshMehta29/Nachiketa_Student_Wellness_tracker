// Authentication and API configuration
export const authConfig = {
  // Clerk Configuration
  clerk: {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    domain: import.meta.env.VITE_CLERK_DOMAIN,
    signInUrl: import.meta.env.VITE_CLERK_SIGN_IN_URL || '/sign-in',
    signUpUrl: import.meta.env.VITE_CLERK_SIGN_UP_URL || '/sign-up',
    afterSignInUrl: import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || '/agent',
    afterSignUpUrl: import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL || '/agent',
  },
  
  // Gemini Integration
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash',
  },
  
  // Backend API
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  },
  
  // Chat Storage
  chat: {
    storageType: import.meta.env.VITE_CHAT_STORAGE_TYPE || 'supabase', // 'local', 'supabase', 'backend'
    maxMessagesPerConversation: 100,
    autoSaveInterval: 30000, // 30 seconds
  },

  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
};

// Validate required environment variables
export function validateAuthConfig() {
  const errors: string[] = [];
  
  if (!authConfig.clerk.publishableKey) {
    errors.push('VITE_CLERK_PUBLISHABLE_KEY is required');
  }
  
  if (authConfig.chat.storageType === 'supabase' && (!authConfig.supabase.url || !authConfig.supabase.anonKey)) {
    errors.push('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required for Supabase storage');
  }
  
  if (!authConfig.gemini.apiKey) {
    errors.push('VITE_GEMINI_API_KEY is required for AI responses');
  }
  
  if (errors.length > 0) {
    console.warn('Auth configuration warnings:', errors);
  }
  
  return errors;
}

// Get user context for AI responses
export function getUserContext(user: any) {
  return {
    userId: user?.id,
    email: user?.primaryEmailAddress?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
    createdAt: user?.createdAt,
    lastSignInAt: user?.lastSignInAt,
    // Add any custom user metadata
    preferences: {
      wellnessFocus: 'general', // Could be 'mental-health', 'fitness', 'nutrition', etc.
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    }
  };
}
