import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import AgentPage from './pages/AgentPage.tsx';
import SignInPage from './pages/SignInPage.tsx';
import Onboarding from './pages/Onboarding.tsx';
import CompanionSelection from './pages/CompanionSelection.tsx';
import CompanionManagement from './pages/CompanionManagement.tsx';
import Profile from './pages/Profile.tsx';
import Settings from './pages/Settings.tsx';
import WellnessOnboarding from './pages/WellnessOnboarding.tsx';
import WellnessSetup from './pages/WellnessSetup.tsx';
import WellnessTracker from './pages/WellnessTracker.tsx';
import VisualizationDashboard from './pages/VisualizationDashboard.tsx';
import ResourceHub from './pages/ResourceHub.tsx';
import NudgeEngine from './pages/NudgeEngine.tsx';
import BuddyMatcher from './pages/BuddyMatcher.tsx';
import ChatPage from './pages/ChatPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

// Get the Clerk publishable key from environment variables
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file');
}

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { 
    path: '/agent', 
    element: (
      <ProtectedRoute>
        <AgentPage />
      </ProtectedRoute>
    ) 
  },
  { path: '/sign-in', element: <SignInPage /> },
  { 
    path: '/onboarding', 
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/companion-selection', 
    element: (
      <ProtectedRoute>
        <CompanionSelection />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/companion-management', 
    element: (
      <ProtectedRoute>
        <CompanionManagement />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/profile', 
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/settings', 
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/wellness-onboarding', 
    element: (
      <ProtectedRoute>
        <WellnessOnboarding />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/wellness-setup', 
    element: (
      <ProtectedRoute>
        <WellnessSetup />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/wellness-tracker', 
    element: (
      <ProtectedRoute>
        <WellnessTracker />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/visualization-dashboard', 
    element: (
      <ProtectedRoute>
        <VisualizationDashboard />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/resource-hub', 
    element: (
      <ProtectedRoute>
        <ResourceHub />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/nudge-engine', 
    element: (
      <ProtectedRoute>
        <NudgeEngine />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/buddy-matcher', 
    element: (
      <ProtectedRoute>
        <BuddyMatcher />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/chat/:buddyId', 
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ) 
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
