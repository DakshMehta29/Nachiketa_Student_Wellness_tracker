import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ActivityForm from '../components/ActivityForm';
import UserCard from '../components/UserCard';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

type SetupStep = 'form' | 'card' | 'complete';

const WellnessSetup = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SetupStep>('form');
  const [formData, setFormData] = useState<any>(null);

  // Redirect if not logged in
  React.useEffect(() => {
    if (isLoaded && !user) {
      navigate('/sign-in');
    }
  }, [isLoaded, user, navigate]);

  const handleFormComplete = (data: any) => {
    setFormData(data);
    setCurrentStep('complete');
  };

  const handleSkipSetup = () => {
    setCurrentStep('card');
  };

  const handleContinue = () => {
    // Navigate to the main app
    navigate('/agent');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/companion-selection')} 
              className="p-3 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                Wellness Setup
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
                Let's personalize your wellness journey
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'form' && (
          <ActivityForm 
            onComplete={handleFormComplete}
            onSkip={handleSkipSetup}
          />
        )}

        {currentStep === 'card' && (
          <div className="max-w-2xl mx-auto">
            <UserCard 
              onEdit={() => setCurrentStep('form')}
              showEditButton={true}
            />
            
            <div className="mt-8 text-center">
              <button
                onClick={handleContinue}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Continue to AI Companion
              </button>
            </div>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
              <div className="p-4 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Setup Complete! 🎉
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                Great! We've saved your wellness preferences. Your AI companion is now ready to provide personalized guidance based on your goals and lifestyle.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  What's Next?
                </h3>
                <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Start chatting with your AI companion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Track your wellness progress
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Get personalized recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Switch between different AI modes
                  </li>
                </ul>
              </div>

              <button
                onClick={handleContinue}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Start Your Wellness Journey
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessSetup;
