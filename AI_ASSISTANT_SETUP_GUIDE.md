# 🤖 AI Assistant Setup Guide

## 🎯 What's Been Implemented

### ✅ **Complete AI Assistant with Authentication & Storage**
- **Clerk Authentication Integration**: Full user authentication with personalized responses
- **GitHub Storage Integration**: Dynamic chat storage in GitHub repositories
- **Enhanced Chat Service**: Intelligent fallback system with user context
- **Personalized AI Responses**: AI addresses users by name and remembers context
- **Multiple Storage Options**: Local, GitHub, or Backend storage support
- **Settings Panel**: User information and storage status display

## 🚀 Setup Instructions

### Step 1: Environment Variables
Create a `.env` file in your project root with the following variables:

```env
# Clerk Authentication Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
VITE_CLERK_DOMAIN=your-clerk-domain.clerk.accounts.dev
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_AFTER_SIGN_IN_URL=/agent
VITE_CLERK_AFTER_SIGN_UP_URL=/agent

# GitHub Integration (for chat storage)
VITE_GITHUB_TOKEN=ghp_your_github_personal_access_token_here
VITE_GITHUB_REPO_OWNER=your-github-username
VITE_GITHUB_REPO_NAME=nachiketa-chat-storage
VITE_GITHUB_BRANCH=main

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Chat Storage Configuration
VITE_CHAT_STORAGE_TYPE=github
# Options: 'local', 'github', 'backend'

# Supabase Configuration (for existing backend)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 2: Clerk Setup
1. Go to [https://clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
4. Add it to your `.env` file as `VITE_CLERK_PUBLISHABLE_KEY`

### Step 3: GitHub Setup (for Dynamic Storage)
1. Go to GitHub and create a new repository (e.g., `nachiketa-chat-storage`)
2. Go to Settings → Developer settings → Personal access tokens
3. Generate a new token with these permissions:
   - `repo` (Full control of private repositories)
   - `user` (Read user profile data)
4. Add the token to your `.env` file as `VITE_GITHUB_TOKEN`
5. Set your GitHub username as `VITE_GITHUB_REPO_OWNER`
6. Set your repository name as `VITE_GITHUB_REPO_NAME`

### Step 4: Update main.tsx
Make sure your `src/main.tsx` includes the ClerkProvider:

```tsx
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
```

## 🎯 Features Now Available

### 🔐 **Authentication Features**
- **User Registration/Login**: Seamless Clerk integration
- **Personalized Greetings**: AI addresses users by name
- **User Context**: AI remembers user information and preferences
- **Secure Storage**: Conversations tied to authenticated users

### 💾 **Dynamic Storage Options**
- **GitHub Storage**: Conversations saved as JSON files in GitHub repo
- **Local Storage**: Fallback for offline use
- **Backend Storage**: Ready for future API integration
- **Auto-save**: Conversations automatically saved after each message

### 🤖 **Enhanced AI Features**
- **Personalized Responses**: AI uses user's name, timezone, and preferences
- **Context Awareness**: AI remembers conversation history
- **Wellness Focus**: Specialized in mental health, sleep, exercise, nutrition
- **Fallback System**: Works even when backend is offline

### ⚙️ **Settings & Status**
- **User Information Display**: Shows user details and account info
- **Storage Status**: Displays current storage type and connection status
- **Sign Out**: Easy logout functionality
- **Configuration Validation**: Checks for missing environment variables

## 🔧 How It Works

### **Storage Flow:**
1. User sends message → Chat service processes with user context
2. AI responds with personalized message → Conversation saved to chosen storage
3. GitHub storage creates/updates JSON files in user-specific directories
4. Local storage provides fallback when GitHub is unavailable

### **Authentication Flow:**
1. User visits `/agent` → Clerk checks authentication
2. If not authenticated → Redirects to sign-in page
3. If authenticated → Loads user's conversations and personalizes AI
4. AI responses include user's name and context

### **GitHub Integration:**
- Creates directory structure: `chats/{userId}/{conversationId}.json`
- Each conversation is a JSON file with messages and metadata
- Supports CRUD operations (Create, Read, Update, Delete)
- Automatic user directory creation

## 🎨 UI/UX Features

### **Personalized Interface:**
- Welcome message with user's name
- Storage status indicator (GitHub/Backend/Local)
- Settings panel with user information
- Conversation management with user-specific data

### **Enhanced Chat Experience:**
- Typing indicators and loading states
- Message timestamps and copy functionality
- Suggested prompts for wellness topics
- Responsive design for all devices

## 🚨 Important Notes

1. **Environment Variables**: Make sure to add your `.env` file to `.gitignore`
2. **GitHub Token**: Keep your GitHub token secure and don't commit it
3. **Clerk Keys**: Use test keys for development, live keys for production
4. **Storage Type**: Set `VITE_CHAT_STORAGE_TYPE` to control where chats are saved
5. **Backend Integration**: The system gracefully falls back when backend is unavailable

## 🎉 You're All Set!

Your AI assistant now has:
- ✅ **Full Authentication** with Clerk
- ✅ **Dynamic Storage** with GitHub integration
- ✅ **Personalized AI** responses
- ✅ **Multiple Storage** options
- ✅ **Settings Panel** with user info
- ✅ **Fallback System** for reliability

Just add your environment variables and you'll have a fully functional, personalized AI wellness companion!
