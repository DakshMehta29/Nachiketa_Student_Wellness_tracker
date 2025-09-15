import React, { useState, useEffect } from 'react';
import { Heart, Bot, Sparkles, Zap, Droplets, Leaf, Star } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabaseService } from '../services/supabaseService';

interface CompanionSelection {
  type: 'pet' | 'companion';
  character?: string;
  companion_type?: string;
}

const PetDisplay = () => {
  const { user } = useUser();
  const [companionSelection, setCompanionSelection] = useState<CompanionSelection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const petOptions = [
    {
      id: 'agni',
      name: 'Agni',
      image: '/pets/Agni.png',
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
      icon: Zap,
      personality: 'Fiery & Courageous'
    },
    {
      id: 'tara',
      name: 'Tara',
      image: '/pets/Tara.png',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      icon: Star,
      personality: 'Cosmic & Creative'
    },
    {
      id: 'neer',
      name: 'Neer',
      image: '/pets/Neer.png',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      icon: Droplets,
      personality: 'Adaptable & Kind'
    },
    {
      id: 'vruksha',
      name: 'Vruksha',
      image: '/pets/Vruksha.png',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      icon: Leaf,
      personality: 'Gentle & Grounded'
    },
    {
      id: 'maya',
      name: 'Maya',
      image: '/pets/Maya.png',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
      icon: Sparkles,
      personality: 'Mysterious & Wise'
    }
  ];

  const companionOptions = [
    {
      id: 'mentor',
      name: 'Mentor',
      emoji: '🎓',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      description: 'Academic & Career Guidance'
    },
    {
      id: 'buddy',
      name: 'Buddy',
      emoji: '🤝',
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20',
      description: 'Friendly Chat Companion'
    },
    {
      id: 'fitness_trainer',
      name: 'Fitness Trainer',
      emoji: '💪',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      description: 'Physical Wellness Support'
    },
    {
      id: 'smart_router',
      name: 'Smart Router',
      emoji: '🧠',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      description: 'Intelligent Query Routing'
    }
  ];

  useEffect(() => {
    const loadCompanionSelection = async () => {
      if (!user) return;
      
      try {
        const selection = await supabaseService.getUserCompanionSelection(user.id);
        console.log('Loaded companion selection:', selection); // Debug log
        setCompanionSelection(selection);
      } catch (error) {
        console.error('Error loading companion selection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadCompanionSelection();
    }
  }, [user, refreshKey]);

  // Expose refresh method to parent components
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    refresh: () => setRefreshKey(prev => prev + 1)
  }));

  if (isLoading) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!companionSelection) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          Your Companion
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">No companion selected yet</p>
          <a 
            href="/companion-selection" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm"
          >
            Choose Your Companion
          </a>
        </div>
      </div>
    );
  }

  // Hide pet display if companion mode is selected
  if (companionSelection.type === 'companion') {
    return null;
  }

  const selectedPet = companionSelection.type === 'pet' 
    ? petOptions.find(pet => pet.id === companionSelection.character)
    : null;
  
  const selectedCompanion = companionSelection.type === 'companion'
    ? companionOptions.find(comp => comp.id === companionSelection.companion_type)
    : null;

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        {companionSelection.type === 'pet' ? (
          <Heart className="w-5 h-5 text-pink-500" />
        ) : (
          <Bot className="w-5 h-5 text-blue-500" />
        )}
        Your {companionSelection.type === 'pet' ? 'Pet' : 'Companion'}
      </h3>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className={`w-16 h-16 bg-gradient-to-r ${
            selectedPet?.color || selectedCompanion?.color || 'from-gray-400 to-gray-500'
          } rounded-full flex items-center justify-center shadow-lg overflow-hidden`}>
            {selectedPet ? (
              <img 
                src={selectedPet.image} 
                alt={selectedPet.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : selectedCompanion ? (
              <span className="text-2xl">{selectedCompanion.emoji}</span>
            ) : (
              <Heart className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {selectedPet?.name || selectedCompanion?.name || 'Unknown'}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            {selectedPet?.personality || selectedCompanion?.description || 'Your AI companion'}
          </p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              companionSelection.type === 'pet' ? 'bg-pink-400' : 'bg-blue-400'
            }`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {companionSelection.type === 'pet' ? 'Pet Mode' : 'Companion Mode'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDisplay;
