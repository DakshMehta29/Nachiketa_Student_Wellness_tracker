import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft, ArrowRight, Heart, Bot, Sparkles, Check } from 'lucide-react';
import Header from '../components/Header';
import { supabaseService } from '../services/supabaseService';

interface CompanionSelection {
  type: 'pet' | 'companion';
  character?: string;
  companion_type?: string;
}

const CompanionSelection = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [selection, setSelection] = useState<CompanionSelection | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (isLoaded && !user) {
      navigate('/sign-in');
    }
  }, [isLoaded, user, navigate]);

  const petOptions = [
    {
      id: 'agni',
      name: 'Agni',
      description: 'A fiery trickster with a glowing mane. Agni\'s spirit burns with passion and courage, always ready for adventure.',
      image: '/pets/Agni.png',
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20'
    },
    {
      id: 'tara',
      name: 'Tara',
      description: 'A sparkling, fluffy creature with gem-like fur and starry eyes. Tara radiates cosmic energy, guiding its companion with clarity, positivity, and creativity, like a star in the night sky.',
      image: '/pets/Tara.png',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    },
    {
      id: 'neer',
      name: 'Neer',
      description: 'A cheerful water guardian. Neer loves to splash around, guiding others with adaptability and kindness like flowing rivers.',
      image: '/pets/Neer.png',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
    },
    {
      id: 'vruksha',
      name: 'Vruksha',
      description: 'A gentle panda with leaves sprouting from its head, symbolizing growth, balance, and connection with nature. Vruksha brings calmness and helps its companion stay grounded and mindful.',
      image: '/pets/Vruksha.png',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
      id: 'maya',
      name: 'Maya',
      description: 'A mysterious feline with sparkling eyes. Maya embodies curiosity and illusion, always playful yet full of hidden wisdom.',
      image: '/pets/Maya.png',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20'
    }
  ];

  const companionOptions = [
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Guides you with studies, career, and personal growth advice.',
      emoji: '🎓',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
    },
    {
      id: 'buddy',
      name: 'Buddy',
      description: 'A friendly companion to chat casually and share thoughts with.',
      emoji: '🤝',
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20'
    },
    {
      id: 'fitness_trainer',
      name: 'Fitness Trainer',
      description: 'Helps you track workouts, diet, and physical wellness.',
      emoji: '💪',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
    },
    {
      id: 'smart_router',
      name: 'Smart Router',
      description: 'Detects query intent (via NLP) and redirects you to Mentor, Buddy, or Fitness Trainer automatically.',
      emoji: '🧠',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    }
  ];

  const handleTypeSelection = (type: 'pet' | 'companion') => {
    setSelection({ type });
  };

  const handleCharacterSelection = (character: string) => {
    if (selection?.type === 'pet') {
      setSelection({ ...selection, character });
    }
  };

  const handleCompanionSelection = (companion_type: string) => {
    if (selection?.type === 'companion') {
      setSelection({ ...selection, companion_type });
    }
  };

  const handleContinue = async () => {
    if (!user || !selection) return;

    setIsLoading(true);
    try {
      // Save companion selection to user profile
      await supabaseService.saveUserCompanionSelection(user.id, selection);
      
      // Navigate to wellness setup
      navigate('/wellness-setup');
    } catch (error) {
      console.error('Error saving companion selection:', error);
      // Still navigate to setup even if save fails
      navigate('/wellness-setup');
    } finally {
      setIsLoading(false);
    }
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
              onClick={() => navigate('/')} 
              className="p-3 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                Choose Your Companion
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
                Select a companion that will guide you on your wellness journey
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          
          {/* Step 1: Choose Type */}
          {!selection && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  What type of companion would you like?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Choose between a lovable pet or a dedicated AI companion
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Pet Mode Card */}
                <div 
                  onClick={() => handleTypeSelection('pet')}
                  className="group cursor-pointer bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-3xl p-8 border-2 border-pink-200 dark:border-pink-700/50 hover:border-pink-300 dark:hover:border-pink-600/50 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                      Pet Mode
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      A lovable character made just for you. Your pet will grow with your lifestyle, chat with you, and give personalized advice.
                    </p>
                    <div className="mt-6">
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Sparkles className="w-5 h-5" />
                        Choose Pet Mode
                      </span>
                    </div>
                  </div>
                </div>

                {/* Companion Mode Card */}
                <div 
                  onClick={() => handleTypeSelection('companion')}
                  className="group cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border-2 border-blue-200 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Bot className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                      Companion Mode
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      A dedicated AI companion tailored to your needs.
                    </p>
                    <div className="mt-6">
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-medium shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Bot className="w-5 h-5" />
                        Choose Companion Mode
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pet Selection */}
          {selection?.type === 'pet' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <button 
                  onClick={() => setSelection(null)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Type Selection
                </button>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Choose Your Pet Companion
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Select a character that resonates with your personality
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {petOptions.map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => handleCharacterSelection(pet.id)}
                    className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      selection.character === pet.id
                        ? `border-${pet.color.split('-')[1]}-500 bg-gradient-to-br ${pet.bgColor} shadow-lg`
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-20 h-20 bg-gradient-to-r ${pet.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden`}>
                        <img 
                          src={pet.image} 
                          alt={pet.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                        {pet.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {pet.description}
                      </p>
                      {selection.character === pet.id && (
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
                          <Check className="w-4 h-4" />
                          Selected
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selection.character && (
                <div className="text-center">
                  <button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Setting up...
                      </>
                    ) : (
                      <>
                        Continue with {petOptions.find(p => p.id === selection.character)?.name}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Companion Selection */}
          {selection?.type === 'companion' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <button 
                  onClick={() => setSelection(null)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Type Selection
                </button>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Choose Your AI Companion
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Select the type of companion that best fits your needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {companionOptions.map((companion) => (
                  <div
                    key={companion.id}
                    onClick={() => handleCompanionSelection(companion.id)}
                    className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      selection.companion_type === companion.id
                        ? `border-${companion.color.split('-')[1]}-500 bg-gradient-to-br ${companion.bgColor} shadow-lg`
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${companion.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl">{companion.emoji}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                        {companion.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {companion.description}
                      </p>
                      {selection.companion_type === companion.id && (
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
                          <Check className="w-4 h-4" />
                          Selected
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selection.companion_type && (
                <div className="text-center">
                  <button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Setting up...
                      </>
                    ) : (
                      <>
                        Continue with {companionOptions.find(c => c.id === selection.companion_type)?.name}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanionSelection;
