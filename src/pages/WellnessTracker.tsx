import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, TrendingUp, Activity, Moon, Utensils, Heart, X, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from '../components/Header';
import PetDisplay from '../components/PetDisplay';
import { supabaseService } from '../services/supabaseService';

const WellnessTracker = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [wellnessData, setWellnessData] = useState({
    sleep: { hours: 0, quality: 5, trend: '+0h' },
    exercise: { minutes: 0, type: 'None', streak: 0 },
    nutrition: { calories: 0, water: 0, meals: 0 },
    mood: { score: 5, note: '' }
  });
  const [recentEntries, setRecentEntries] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [petDisplayKey, setPetDisplayKey] = useState(0);
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const loadWellnessData = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const entries = await supabaseService.getWellnessEntries(user.id, 7);
      setRecentEntries(entries);
      
      // Calculate summary data from recent entries
      if (entries.length > 0) {
        const latestEntry = entries[entries.length - 1] as {
          sleep_hours?: number;
          sleep_quality?: number;
          exercise_minutes?: number;
          exercise_type?: string;
          water_intake_glasses?: number;
          meals_consumed?: number;
          mood_score?: number;
          notes?: string;
        };
        setWellnessData({
          sleep: { 
            hours: latestEntry.sleep_hours || 0, 
            quality: latestEntry.sleep_quality || 5, 
            trend: '+0h' 
          },
          exercise: { 
            minutes: latestEntry.exercise_minutes || 0, 
            type: latestEntry.exercise_type || 'None', 
            streak: 0 
          },
          nutrition: { 
            calories: 0, 
            water: latestEntry.water_intake_glasses || 0, 
            meals: latestEntry.meals_consumed || 0 
          },
          mood: { 
            score: latestEntry.mood_score || 5, 
            note: latestEntry.notes || '' 
          }
        });
      }
    } catch (error) {
      console.error('Error loading wellness data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Check if user has completed wellness onboarding
  useEffect(() => {
    const checkWellnessProfile = async () => {
      if (user && isLoaded) {
        try {
          const hasCompleted = await supabaseService.hasCompletedWellnessProfile(user.id);
          if (!hasCompleted) {
            // Check if we have any wellness entries in local storage
            const entries = await supabaseService.getWellnessEntries(user.id, 7);
            if (entries.length === 0) {
              // No profile and no entries, redirect to onboarding
              navigate('/wellness-onboarding');
            } else {
              // No profile but we have entries, continue to tracker
              await loadWellnessData();
            }
          } else {
            await loadWellnessData();
          }
        } catch (error) {
          console.error('Error checking wellness profile:', error);
          // Continue with local data even if there's an error
          await loadWellnessData();
        }
      }
    };
    
    checkWellnessProfile();
  }, [user, isLoaded, navigate, loadWellnessData]);

  // Refresh pet display when component mounts or when returning from companion management
  useEffect(() => {
    setPetDisplayKey(prev => prev + 1);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'exercise', label: 'Exercise', icon: Activity },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'mood', label: 'Mood', icon: Heart }
  ];

  const handleAddEntry = async (entryData: Record<string, unknown>) => {
    if (!user) return;
    
    try {
      const success = await supabaseService.saveWellnessEntry(user.id, {
        ...entryData,
        entry_date: new Date().toISOString().split('T')[0] // Today's date
      });
      
      if (success) {
        await loadWellnessData();
        setShowAddEntry(false);
      }
    } catch (error) {
      console.error('Error saving wellness entry:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your wellness data...</p>
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
            <Link 
              to="/" 
              className="p-3 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                Unified Wellness Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
                Track sleep, exercise, nutrition, and mood in one place
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:shadow-md hover:transform hover:scale-105'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-1">Sleep</p>
                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">{wellnessData.sleep.hours}h</p>
                    <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">Quality: {wellnessData.sleep.quality}/10</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                    <Moon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 dark:text-green-400 text-sm font-semibold mb-1">Exercise</p>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-200">{wellnessData.exercise.minutes}m</p>
                    <p className="text-green-600 dark:text-green-400 text-xs mt-1">{wellnessData.exercise.type}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 dark:text-orange-400 text-sm font-semibold mb-1">Nutrition</p>
                    <p className="text-3xl font-bold text-orange-800 dark:text-orange-200">{wellnessData.nutrition.water}</p>
                    <p className="text-orange-600 dark:text-orange-400 text-xs mt-1">glasses water</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                    <Utensils className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-600 dark:text-pink-400 text-sm font-semibold mb-1">Mood</p>
                    <p className="text-3xl font-bold text-pink-800 dark:text-pink-200">{wellnessData.mood.score}/10</p>
                    <p className="text-pink-600 dark:text-pink-400 text-xs mt-1">
                      {wellnessData.mood.score >= 8 ? 'Great!' : wellnessData.mood.score >= 6 ? 'Good' : 'Okay'}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pet/Companion Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <PetDisplay key={petDisplayKey} />
              </div>
              <div className="lg:col-span-2">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentEntries.length > 0 ? (
                  recentEntries.slice(-3).reverse().map((entry, index) => {
                    const entryData = entry as {
                      exercise_minutes?: number;
                      water_intake_glasses?: number;
                      sleep_hours?: number;
                      mood_score?: number;
                      entry_date: string;
                    };
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex gap-2">
                          {(entryData.exercise_minutes || 0) > 0 && <Activity className="w-5 h-5 text-green-500" />}
                          {(entryData.water_intake_glasses || 0) > 0 && <Utensils className="w-5 h-5 text-orange-500" />}
                          {(entryData.sleep_hours || 0) > 0 && <Moon className="w-5 h-5 text-blue-500" />}
                          {(entryData.mood_score || 0) > 0 && <Heart className="w-5 h-5 text-pink-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            Wellness Entry - {new Date(entryData.entry_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {(entryData.exercise_minutes || 0) > 0 && `${entryData.exercise_minutes}m exercise • `}
                            {(entryData.water_intake_glasses || 0) > 0 && `${entryData.water_intake_glasses} glasses water • `}
                            {(entryData.sleep_hours || 0) > 0 && `${entryData.sleep_hours}h sleep • `}
                            {(entryData.mood_score || 0) > 0 && `Mood: ${entryData.mood_score}/10`}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No entries yet</p>
                    <button
                      onClick={() => setShowAddEntry(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Add Your First Entry
                    </button>
                  </div>
                )}
              </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Entry Button */}
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={() => setShowAddEntry(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors hover:scale-110"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Add Entry Modal */}
        {showAddEntry && (
          <AddEntryModal 
            onClose={() => setShowAddEntry(false)}
            onSave={handleAddEntry}
          />
        )}
      </div>
    </div>
  );
};

// Add Entry Modal Component
const AddEntryModal = ({ onClose, onSave }: { onClose: () => void; onSave: (data: Record<string, unknown>) => void }) => {
  const [formData, setFormData] = useState({
    sleep_hours: '',
    sleep_quality: 5,
    exercise_minutes: '',
    exercise_type: '',
    water_intake_glasses: '',
    meals_consumed: '',
    mood_score: 5,
    stress_level: 5,
    energy_level: 5,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entryData = {
      ...formData,
      sleep_hours: parseFloat(formData.sleep_hours) || 0,
      exercise_minutes: parseInt(formData.exercise_minutes) || 0,
      water_intake_glasses: parseInt(formData.water_intake_glasses) || 0,
      meals_consumed: parseInt(formData.meals_consumed) || 0,
    };
    onSave(entryData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Add Wellness Entry</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sleep */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sleep Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="12"
                value={formData.sleep_hours}
                onChange={(e) => setFormData({...formData, sleep_hours: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="7.5"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sleep Quality (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.sleep_quality}
                onChange={(e) => setFormData({...formData, sleep_quality: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {formData.sleep_quality}/10
              </div>
            </div>

            {/* Exercise */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Exercise Minutes
              </label>
              <input
                type="number"
                min="0"
                max="300"
                value={formData.exercise_minutes}
                onChange={(e) => setFormData({...formData, exercise_minutes: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Exercise Type
              </label>
              <select
                value={formData.exercise_type}
                onChange={(e) => setFormData({...formData, exercise_type: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select type</option>
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength Training</option>
                <option value="Yoga">Yoga</option>
                <option value="Walking">Walking</option>
                <option value="Running">Running</option>
                <option value="Swimming">Swimming</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Nutrition */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Water Intake (glasses)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.water_intake_glasses}
                onChange={(e) => setFormData({...formData, water_intake_glasses: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="8"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Meals Consumed
              </label>
              <input
                type="number"
                min="0"
                max="6"
                value={formData.meals_consumed}
                onChange={(e) => setFormData({...formData, meals_consumed: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="3"
              />
            </div>

            {/* Mood & Energy */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mood Score (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.mood_score}
                onChange={(e) => setFormData({...formData, mood_score: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {formData.mood_score}/10
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Energy Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.energy_level}
                onChange={(e) => setFormData({...formData, energy_level: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {formData.energy_level}/10
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="How are you feeling today? Any observations..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WellnessTracker;
