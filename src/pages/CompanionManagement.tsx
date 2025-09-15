import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft, Heart, Bot, Settings, Save, Check } from 'lucide-react';
import Header from '../components/Header';
import { supabaseService } from '../services/supabaseService';

interface CompanionSelection {
  type: 'pet' | 'companion';
  character?: string;
  companion_type?: string;
}

const CompanionManagement = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [currentSelection, setCurrentSelection] = useState<CompanionSelection | null>(null);
  const [newSelection, setNewSelection] = useState<CompanionSelection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/sign-in');
    }
  }, [isLoaded, user, navigate]);

  // Load current companion selection
  useEffect(() => {
    const loadCurrentSelection = async () => {
      if (!user) return;
      
      try {
        const selection = await supabaseService.getUserCompanionSelection(user.id);
        setCurrentSelection(selection);
        setNewSelection(selection);
      } catch (error) {
        console.error('Error loading companion selection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadCurrentSelection();
    }
  }, [user]);

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
      bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-indigo-900/20'
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

  const handleTypeChange = (type: 'pet' | 'companion') => {
    console.log('Type changed to:', type);
    setNewSelection({ type });
  };

  const handleCharacterChange = (character: string) => {
    if (newSelection?.type === 'pet') {
      console.log('Character changed to:', character);
      setNewSelection({ ...newSelection, character });
    }
  };

  const handleCompanionChange = (companion_type: string) => {
    if (newSelection?.type === 'companion') {
      console.log('Companion type changed to:', companion_type);
      setNewSelection({ ...newSelection, companion_type });
    }
  };

  const handleSave = async () => {
    if (!user || !newSelection) {
      console.log('Cannot save: missing user or selection', { user: !!user, newSelection });
      alert('Missing user or selection data. Please refresh the page and try again.');
      return;
    }

    console.log('Saving companion selection:', newSelection);
    setIsSaving(true);
    
    try {
      const success = await supabaseService.saveUserCompanionSelection(user.id, newSelection);
      console.log('Save result:', success);
      
      if (success) {
        setCurrentSelection(newSelection);
        // Show success message
        alert('Companion selection saved successfully!');
        // Redirect to dashboard
        navigate('/wellness-tracker');
      } else {
        alert('Failed to save companion selection. Please check the console for error details and try again.');
      }
    } catch (error) {
      console.error('Error saving companion selection:', error);
      alert(`An error occurred while saving: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for details.`);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (!currentSelection || !newSelection) {
      console.log('hasChanges: Missing selections', { currentSelection, newSelection });
      return false;
    }
    
    const hasChangesResult = JSON.stringify(currentSelection) !== JSON.stringify(newSelection);
    console.log('hasChanges check:', {
      currentSelection,
      newSelection,
      hasChanges: hasChangesResult
    });
    
    return hasChangesResult;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your companion...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/wellness-tracker')} 
              className="p-3 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                Companion Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
                Manage your AI companion or pet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          
          {/* Current Selection Display */}
          {currentSelection && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Current Companion</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    {currentSelection.type === 'pet' ? (
                      <Heart className="w-8 h-8 text-white" />
                    ) : (
                      <Bot className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {currentSelection.type === 'pet' 
                        ? petOptions.find(p => p.id === currentSelection.character)?.name || 'Pet'
                        : companionOptions.find(c => c.id === currentSelection.companion_type)?.name || 'Companion'
                      }
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {currentSelection.type === 'pet' ? 'Pet Mode' : 'Companion Mode'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Type Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Choose Mode</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pet Mode Card */}
              <div 
                onClick={() => handleTypeChange('pet')}
                className={`group cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  newSelection?.type === 'pet'
                    ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 shadow-lg'
                    : 'border-pink-200 dark:border-pink-700/50 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 hover:border-pink-300 dark:hover:border-pink-600/50'
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Pet Mode
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    A lovable character that grows with your lifestyle
                  </p>
                </div>
              </div>

              {/* Companion Mode Card */}
              <div 
                onClick={() => handleTypeChange('companion')}
                className={`group cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  newSelection?.type === 'companion'
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg'
                    : 'border-blue-200 dark:border-blue-700/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:border-blue-300 dark:hover:border-blue-600/50'
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Companion Mode
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    A dedicated AI companion tailored to your needs
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pet Selection */}
          {newSelection?.type === 'pet' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Choose Your Pet</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {petOptions.map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => handleCharacterChange(pet.id)}
                    className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      newSelection.character === pet.id
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
                      {newSelection.character === pet.id && (
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
                          <Check className="w-4 h-4" />
                          Selected
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Companion Selection */}
          {newSelection?.type === 'companion' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Choose Your Companion</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {companionOptions.map((companion) => (
                  <div
                    key={companion.id}
                    onClick={() => handleCompanionChange(companion.id)}
                    className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      newSelection.companion_type === companion.id
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
                      {newSelection.companion_type === companion.id && (
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
                          <Check className="w-4 h-4" />
                          Selected
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          {newSelection && (
            <div className="text-center">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg transform hover:scale-105 ${
                  !isSaving
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-xl'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {hasChanges() ? 'Save Changes' : 'Save Selection'}
                  </>
                )}
              </button>
              {hasChanges() && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  You have unsaved changes
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanionManagement;
