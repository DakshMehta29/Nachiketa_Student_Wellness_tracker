import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { User, Calendar, Heart, Activity, Edit3 } from 'lucide-react';

interface UserCardProps {
  onEdit?: () => void;
  showEditButton?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ onEdit, showEditButton = true }) => {
  const { user } = useUser();

  if (!user) return null;

  // Generate a short summary based on user data
  const generateSummary = () => {
    const name = user.firstName || 'User';
    const memberSince = user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();
    const yearsActive = new Date().getFullYear() - memberSince;
    
    return `Welcome to your wellness journey! You've been with us since ${memberSince} and are ready to start your personalized health and wellness experience.`;
  };

  const getInitials = () => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  };

  const getJoinDate = () => {
    if (!user.createdAt) return 'Recently';
    return new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {getInitials()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-blue-100 text-sm">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          
          {showEditButton && onEdit && (
            <button
              onClick={onEdit}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 hover:scale-105"
              title="Edit Profile"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Summary */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Your Wellness Summary
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {generateSummary()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {getJoinDate()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Wellness Level</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Getting Started
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Profile Status</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Basic Setup
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Quick Actions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 text-left">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                  Complete Profile
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Add more details
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200 text-left">
              <div className="p-2 bg-green-500 rounded-lg">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                  Start Wellness Journey
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Begin tracking
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
            <span className="font-semibold">Ready to begin?</span> Your personalized wellness journey starts now. 
            Every small step counts towards a healthier, happier you! 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
