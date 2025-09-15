import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft, ArrowRight, Check, Moon, Activity, Utensils, Heart, Brain, Users, Target, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import { supabaseService } from '../services/supabaseService';

interface WellnessProfile {
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
}

const WellnessOnboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['sleep']));
  
  const [formData, setFormData] = useState<WellnessProfile>({});
  
  const totalSteps = 6;

  // Redirect if not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/sign-in');
    }
  }, [isLoaded, user, navigate]);

  // Check if user already has a wellness profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (user) {
        try {
          const existingProfile = await supabaseService.getUserWellnessProfile(user.id);
          if (existingProfile && existingProfile.is_completed) {
            navigate('/wellness-tracker');
          }
        } catch (error) {
          console.error('Error checking existing profile:', error);
        }
      }
    };
    
    checkExistingProfile();
  }, [user, navigate]);

  const handleInputChange = (field: keyof WellnessProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof WellnessProfile, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(value => 
      value !== undefined && value !== null && 
      (Array.isArray(value) ? value.length > 0 : value !== '')
    ).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const completionPercentage = calculateProgress();
      const profileData = {
        ...formData,
        is_completed: completionPercentage >= 70, // Consider complete if 70% filled
        completion_percentage: completionPercentage
      };
      
      await supabaseService.saveUserWellnessProfile(user.id, profileData);
      navigate('/wellness-tracker');
    } catch (error) {
      console.error('Error saving wellness profile:', error);
      alert('There was an error saving your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipSetup = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Create a minimal profile to mark as completed
      const profileData = {
        is_completed: true,
        completion_percentage: 100
      };
      
      await supabaseService.saveUserWellnessProfile(user.id, profileData);
      navigate('/wellness-tracker');
    } catch (error) {
      console.error('Error saving wellness profile:', error);
      alert('There was an error saving your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
      
      {/* Progress Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          
          <div className="mt-2 text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Let's Get to Know You Better
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Help us personalize your wellness journey
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          
          {/* Step 1: Sleep Patterns */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg inline-block mb-4">
                  <Moon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sleep Patterns</h2>
                <p className="text-gray-600 dark:text-gray-300">Tell us about your sleep habits</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sleep Schedule Type
                  </label>
                  <select
                    value={formData.sleep_schedule || ''}
                    onChange={(e) => handleInputChange('sleep_schedule', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your sleep pattern</option>
                    <option value="early_bird">Early Bird (sleep early, wake early)</option>
                    <option value="night_owl">Night Owl (sleep late, wake late)</option>
                    <option value="flexible">Flexible (can adapt to different schedules)</option>
                    <option value="irregular">Irregular (inconsistent sleep times)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sleep Duration (hours)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="12"
                    step="0.5"
                    value={formData.sleep_duration_hours || ''}
                    onChange={(e) => handleInputChange('sleep_duration_hours', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 7.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bedtime Preference
                  </label>
                  <input
                    type="time"
                    value={formData.bedtime_preference || ''}
                    onChange={(e) => handleInputChange('bedtime_preference', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Wake Time Preference
                  </label>
                  <input
                    type="time"
                    value={formData.wake_time_preference || ''}
                    onChange={(e) => handleInputChange('wake_time_preference', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sleep Quality Rating (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.sleep_quality_rating || 5}
                  onChange={(e) => handleInputChange('sleep_quality_rating', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>Poor (1)</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {formData.sleep_quality_rating || 5}/10
                  </span>
                  <span>Excellent (10)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sleep Issues (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Difficulty falling asleep',
                    'Frequent waking',
                    'Early morning awakening',
                    'Snoring',
                    'Sleep apnea',
                    'Restless legs',
                    'Nightmares',
                    'Insomnia',
                    'None of the above'
                  ].map((issue) => (
                    <label key={issue} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.sleep_issues || []).includes(issue)}
                        onChange={(e) => handleArrayChange('sleep_issues', issue, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{issue}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Exercise Habits */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg inline-block mb-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Exercise & Fitness</h2>
                <p className="text-gray-600 dark:text-gray-300">Tell us about your physical activity</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exercise Frequency
                  </label>
                  <select
                    value={formData.exercise_frequency || ''}
                    onChange={(e) => handleInputChange('exercise_frequency', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="3-4_times_week">3-4 times per week</option>
                    <option value="1-2_times_week">1-2 times per week</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fitness Level
                  </label>
                  <select
                    value={formData.fitness_level || ''}
                    onChange={(e) => handleInputChange('fitness_level', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your fitness level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="athlete">Athlete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Typical Exercise Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={formData.exercise_duration_minutes || ''}
                    onChange={(e) => handleInputChange('exercise_duration_minutes', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Preferred Exercise Types (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Running/Jogging',
                    'Weight Training',
                    'Yoga',
                    'Swimming',
                    'Cycling',
                    'Dancing',
                    'Team Sports',
                    'Martial Arts',
                    'Pilates',
                    'Hiking',
                    'Walking',
                    'Other'
                  ].map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.preferred_exercise_types || []).includes(type)}
                        onChange={(e) => handleArrayChange('preferred_exercise_types', type, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Nutrition Habits */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg inline-block mb-4">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Nutrition & Diet</h2>
                <p className="text-gray-600 dark:text-gray-300">Tell us about your eating habits</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meals per Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.meal_frequency || ''}
                    onChange={(e) => handleInputChange('meal_frequency', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Water Intake (glasses per day)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.water_intake_glasses || ''}
                    onChange={(e) => handleInputChange('water_intake_glasses', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Dietary Preferences (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Vegetarian',
                    'Vegan',
                    'Pescatarian',
                    'Gluten-free',
                    'Dairy-free',
                    'Keto',
                    'Paleo',
                    'Mediterranean',
                    'Low-carb',
                    'Intermittent Fasting',
                    'No restrictions',
                    'Other'
                  ].map((preference) => (
                    <label key={preference} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.dietary_preferences || []).includes(preference)}
                        onChange={(e) => handleArrayChange('dietary_preferences', preference, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{preference}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Nutrition Concerns (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Weight management',
                    'Energy levels',
                    'Digestive issues',
                    'Food allergies',
                    'Blood sugar control',
                    'Heart health',
                    'Bone health',
                    'Mental clarity',
                    'None of the above'
                  ].map((concern) => (
                    <label key={concern} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.nutrition_concerns || []).includes(concern)}
                        onChange={(e) => handleArrayChange('nutrition_concerns', concern, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{concern}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Mental Health & Stress */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg inline-block mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Mental Health & Stress</h2>
                <p className="text-gray-600 dark:text-gray-300">Tell us about your mental wellness</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Stress Level (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.stress_level || 5}
                    onChange={(e) => handleInputChange('stress_level', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>Low (1)</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {formData.stress_level || 5}/10
                    </span>
                    <span>High (10)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mood Patterns
                  </label>
                  <select
                    value={formData.mood_patterns || ''}
                    onChange={(e) => handleInputChange('mood_patterns', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your mood pattern</option>
                    <option value="stable">Generally stable</option>
                    <option value="variable">Variable throughout the day</option>
                    <option value="seasonal">Changes with seasons</option>
                    <option value="stress_related">Related to stress levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Main Stress Sources (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Academic pressure',
                    'Work deadlines',
                    'Financial concerns',
                    'Relationships',
                    'Health issues',
                    'Future uncertainty',
                    'Social media',
                    'Family expectations',
                    'Time management',
                    'Other'
                  ].map((source) => (
                    <label key={source} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.stress_sources || []).includes(source)}
                        onChange={(e) => handleArrayChange('stress_sources', source, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{source}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Coping Strategies (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Exercise',
                    'Meditation',
                    'Talking to friends',
                    'Music',
                    'Reading',
                    'Gaming',
                    'Art/Creative activities',
                    'Nature walks',
                    'Professional counseling',
                    'Other'
                  ].map((strategy) => (
                    <label key={strategy} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.coping_strategies || []).includes(strategy)}
                        onChange={(e) => handleArrayChange('coping_strategies', strategy, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{strategy}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Academic/Work Life */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg inline-block mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Academic & Work Life</h2>
                <p className="text-gray-600 dark:text-gray-300">Tell us about your study and work patterns</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Study/Work Hours per Day
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="16"
                    step="0.5"
                    value={formData.study_work_hours || ''}
                    onChange={(e) => handleInputChange('study_work_hours', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 8.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Academic/Work Load
                  </label>
                  <select
                    value={formData.academic_workload || ''}
                    onChange={(e) => handleInputChange('academic_workload', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your workload</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="heavy">Heavy</option>
                    <option value="overwhelming">Overwhelming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Most Productive Time
                  </label>
                  <select
                    value={formData.productivity_peak_time || ''}
                    onChange={(e) => handleInputChange('productivity_peak_time', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your peak time</option>
                    <option value="morning">Morning (6 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                    <option value="evening">Evening (6 PM - 12 AM)</option>
                    <option value="night">Night (12 AM - 6 AM)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Goals & Social Life */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg inline-block mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Goals & Social Life</h2>
                <p className="text-gray-600 dark:text-gray-300">Tell us about your wellness goals and social connections</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Social Activity Level
                  </label>
                  <select
                    value={formData.social_activity_level || ''}
                    onChange={(e) => handleInputChange('social_activity_level', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your social activity level</option>
                    <option value="very_active">Very Active</option>
                    <option value="moderately_active">Moderately Active</option>
                    <option value="somewhat_active">Somewhat Active</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Social Support Quality (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.social_support_quality || 5}
                    onChange={(e) => handleInputChange('social_support_quality', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>Poor (1)</span>
                    <span className="font-medium text-pink-600 dark:text-pink-400">
                      {formData.social_support_quality || 5}/10
                    </span>
                    <span>Excellent (10)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Motivation Level (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.motivation_level || 5}
                    onChange={(e) => handleInputChange('motivation_level', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>Low (1)</span>
                    <span className="font-medium text-pink-600 dark:text-pink-400">
                      {formData.motivation_level || 5}/10
                    </span>
                    <span>High (10)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Primary Wellness Goals (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Better sleep quality',
                    'Increase physical activity',
                    'Improve nutrition',
                    'Reduce stress',
                    'Better mood management',
                    'Academic performance',
                    'Work-life balance',
                    'Social connections',
                    'Mental health',
                    'Weight management',
                    'Energy levels',
                    'Overall wellness'
                  ].map((goal) => (
                    <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.primary_wellness_goals || []).includes(goal)}
                        onChange={(e) => handleArrayChange('primary_wellness_goals', goal, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Previous Wellness Experience
                </label>
                <textarea
                  value={formData.previous_wellness_experience || ''}
                  onChange={(e) => handleInputChange('previous_wellness_experience', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about any previous wellness programs, apps, or experiences you've had..."
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentStep === 1
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              
              <button
                onClick={handleSkipSetup}
                disabled={isLoading}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline transition-colors"
              >
                Skip Setup
              </button>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Progress: {calculateProgress()}%
              </div>
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessOnboarding;
