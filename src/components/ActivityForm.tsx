import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabaseService } from '../services/supabaseService';
import { 
  Moon, 
  Dumbbell, 
  Apple, 
  Brain, 
  Heart, 
  Check,
  SkipForward,
  Activity
} from 'lucide-react';

interface ActivityFormData {
  // Sleep patterns
  sleepSchedule: string;
  bedtimePreference: string;
  wakeTimePreference: string;
  sleepDurationHours: number;
  sleepQualityRating: number;
  sleepIssues: string[];
  
  // Exercise habits
  exerciseFrequency: string;
  preferredExerciseTypes: string[];
  exerciseDurationMinutes: number;
  fitnessLevel: string;
  
  // Nutrition habits
  mealFrequency: number;
  dietaryPreferences: string[];
  waterIntakeGlasses: number;
  nutritionConcerns: string[];
  
  // Mental health & stress
  stressLevel: number;
  stressSources: string[];
  copingStrategies: string[];
  moodPatterns: string;
  
  // Academic/Work life
  studyWorkHours: number;
  academicWorkload: string;
  productivityPeakTime: string;
  
  // Social life
  socialActivityLevel: string;
  socialSupportQuality: number;
  
  // Goals and motivations
  primaryWellnessGoals: string[];
  motivationLevel: number;
  previousWellnessExperience: string;
  
  // Additional information
  healthConditions: string[];
  medications: string[];
  lifestyleFactors: string[];
}

const ActivityForm = ({ onComplete, onSkip }: { onComplete: (data: ActivityFormData) => void; onSkip: () => void }) => {
  const { user } = useUser();
  
  // Default values that are pre-filled
  const [formData, setFormData] = useState<ActivityFormData>({
    // Sleep patterns - defaults for healthy young adult
    sleepSchedule: 'regular',
    bedtimePreference: '10:00 PM',
    wakeTimePreference: '7:00 AM',
    sleepDurationHours: 8,
    sleepQualityRating: 7,
    sleepIssues: [],
    
    // Exercise habits - defaults for beginner
    exerciseFrequency: '2-3 times per week',
    preferredExerciseTypes: ['walking', 'yoga'],
    exerciseDurationMinutes: 30,
    fitnessLevel: 'beginner',
    
    // Nutrition habits - defaults for balanced diet
    mealFrequency: 3,
    dietaryPreferences: ['balanced'],
    waterIntakeGlasses: 8,
    nutritionConcerns: [],
    
    // Mental health & stress - defaults for moderate stress
    stressLevel: 5,
    stressSources: ['academic/work'],
    copingStrategies: ['exercise', 'music'],
    moodPatterns: 'generally positive',
    
    // Academic/Work life - defaults for student
    studyWorkHours: 8,
    academicWorkload: 'moderate',
    productivityPeakTime: 'morning',
    
    // Social life - defaults for moderate social activity
    socialActivityLevel: 'moderate',
    socialSupportQuality: 7,
    
    // Goals and motivations - defaults for general wellness
    primaryWellnessGoals: ['improve sleep', 'reduce stress', 'stay active'],
    motivationLevel: 7,
    previousWellnessExperience: 'some experience',
    
    // Additional information - defaults for healthy individual
    healthConditions: [],
    medications: [],
    lifestyleFactors: ['student', 'urban living']
  });

  const handleInputChange = (field: keyof ActivityFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof ActivityFormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async () => {
    if (user) {
      try {
        await supabaseService.saveUserWellnessProfile(user.id, formData);
        onComplete(formData);
      } catch (error) {
        console.error('Error saving wellness profile:', error);
        onComplete(formData); // Still complete even if save fails
      }
    } else {
      onComplete(formData);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <div className="p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Activity className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Wellness Activity Setup
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Help us personalize your experience with some quick questions. Default values are already filled based on typical preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Sleep Section */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Sleep Patterns</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sleep Schedule
              </label>
              <select
                value={formData.sleepSchedule}
                onChange={(e) => handleInputChange('sleepSchedule', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              >
                <option value="regular">Regular schedule</option>
                <option value="irregular">Irregular schedule</option>
                <option value="night-owl">Night owl</option>
                <option value="early-bird">Early bird</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sleep Duration (hours)
              </label>
              <input
                type="number"
                min="4"
                max="12"
                value={formData.sleepDurationHours}
                onChange={(e) => handleInputChange('sleepDurationHours', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sleep Quality (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.sleepQualityRating}
                onChange={(e) => handleInputChange('sleepQualityRating', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                {formData.sleepQualityRating}/10
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Section */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Exercise Habits</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exercise Frequency
              </label>
              <select
                value={formData.exerciseFrequency}
                onChange={(e) => handleInputChange('exerciseFrequency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              >
                <option value="daily">Daily</option>
                <option value="4-5 times per week">4-5 times per week</option>
                <option value="2-3 times per week">2-3 times per week</option>
                <option value="once per week">Once per week</option>
                <option value="rarely">Rarely</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fitness Level
              </label>
              <select
                value={formData.fitnessLevel}
                onChange={(e) => handleInputChange('fitnessLevel', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="athlete">Athlete</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preferred Exercise Types
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['walking', 'running', 'yoga', 'weightlifting', 'swimming', 'cycling', 'dancing', 'sports'].map(type => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.preferredExerciseTypes.includes(type)}
                    onChange={(e) => handleArrayChange('preferredExerciseTypes', type, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Nutrition Section */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Apple className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Nutrition Habits</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meals per Day
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.mealFrequency}
                onChange={(e) => handleInputChange('mealFrequency', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
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
                value={formData.waterIntakeGlasses}
                onChange={(e) => handleInputChange('waterIntakeGlasses', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Mental Health Section */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Mental Health & Stress</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stress Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.stressLevel}
                onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                {formData.stressLevel}/10
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
                value={formData.motivationLevel}
                onChange={(e) => handleInputChange('motivationLevel', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                {formData.motivationLevel}/10
              </div>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Wellness Goals</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Wellness Goals
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {['improve sleep', 'reduce stress', 'stay active', 'eat healthier', 'lose weight', 'build muscle', 'mental health', 'work-life balance'].map(goal => (
                <label key={goal} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.primaryWellnessGoals.includes(goal)}
                    onChange={(e) => handleArrayChange('primaryWellnessGoals', goal, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{goal}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={handleSubmit}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
        >
          <Check className="w-5 h-5" />
          Complete Setup
        </button>
        
        <button
          onClick={handleSkip}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 font-medium"
        >
          <SkipForward className="w-5 h-5" />
          Skip Setup
        </button>
      </div>
      
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        You can always update these preferences later in your profile settings.
      </p>
    </div>
  );
};

export default ActivityForm;
