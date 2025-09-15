import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LazyImage from '../components/LazyImage';
import { BuddyUser, FriendRequest } from '../types';
import { getRandomBuddies } from '../data/buddyData';
import { 
  Users, 
  MapPin, 
  Clock, 
  Activity, 
  Brain, 
  Target,
  MessageCircle,
  UserPlus,
  X,
  Filter
} from 'lucide-react';

const BuddyMatcher: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [buddies, setBuddies] = useState<BuddyUser[]>([]);
  const [selectedBuddy, setSelectedBuddy] = useState<BuddyUser | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load random buddies
    setBuddies(getRandomBuddies(8));
  }, []);

  const handleBuddyClick = (buddy: BuddyUser) => {
    setSelectedBuddy(buddy);
    setShowProfileModal(true);
  };

  const handleSendFriendRequest = async (buddyId: string) => {
    if (!user) return;

    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      fromUserId: user.id,
      toUserId: buddyId,
      status: 'pending',
      createdAt: new Date()
    };

    setFriendRequests(prev => [...prev, newRequest]);

    // Auto-accept after 3 seconds
    setTimeout(() => {
      setFriendRequests(prev => 
        prev.map(req => 
          req.id === newRequest.id 
            ? { ...req, status: 'accepted' as const }
            : req
        )
      );
    }, 3000);
  };

  const handleChatWithFriend = (buddyId: string) => {
    navigate(`/chat/${buddyId}`);
  };

  const getFriendRequestStatus = (buddyId: string) => {
    const request = friendRequests.find(req => req.toUserId === buddyId);
    return request?.status || null;
  };

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buddy.activityTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buddy.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'high-match') return matchesSearch && buddy.activityMatchPercentage >= 90;
    if (filter === 'online') return matchesSearch && buddy.lastActive.includes('hour');
    if (filter === 'expert') return matchesSearch && buddy.fitnessLevel === 'Expert';
    
    return matchesSearch;
  });

  const getFitnessLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              Buddy Matcher
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find your perfect wellness buddy! Connect with like-minded people who share your fitness goals and interests.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, activity, or interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Buddies</option>
                <option value="high-match">High Match (90%+)</option>
                <option value="online">Online Now</option>
                <option value="expert">Expert Level</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Buddies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBuddies.map((buddy) => {
            const requestStatus = getFriendRequestStatus(buddy.id);
            
            return (
              <div
                key={buddy.id}
                onClick={() => handleBuddyClick(buddy)}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:border-blue-300 dark:hover:border-blue-500"
              >
                {/* Profile Picture and Basic Info */}
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <LazyImage
                      src={buddy.profilePicture}
                      alt={buddy.name}
                      className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-700 shadow-lg mx-auto"
                      fallbackSrc={`https://api.dicebear.com/7.x/avataaars/svg?seed=${buddy.name}&backgroundColor=b6e3f4&size=150`}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-3">
                    {buddy.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {buddy.age} years old
                  </p>
                </div>

                {/* Summary */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                  {buddy.summary}
                </p>

                {/* Activity Tag and Fitness Level */}
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium">
                    {buddy.activityTag}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFitnessLevelColor(buddy.fitnessLevel)}`}>
                    {buddy.fitnessLevel}
                  </span>
                </div>

                {/* Match Percentage */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {buddy.activityMatchPercentage}% Match
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${buddy.activityMatchPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Location and Last Active */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{buddy.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{buddy.lastActive}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center">
                  {requestStatus === null && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendFriendRequest(buddy.id);
                      }}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <UserPlus className="w-4 h-4" />
                      Send Friend Request
                    </button>
                  )}
                  
                  {requestStatus === 'pending' && (
                    <div className="w-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-medium">
                      <Clock className="w-4 h-4" />
                      Request Pending...
                    </div>
                  )}
                  
                  {requestStatus === 'accepted' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatWithFriend(buddy.id);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat with {buddy.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredBuddies.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No buddies found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedBuddy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {selectedBuddy.name}'s Profile
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Profile Content */}
              <div className="space-y-6">
                {/* Profile Picture and Basic Info */}
              <div className="text-center">
                <LazyImage
                  src={selectedBuddy.profilePicture}
                  alt={selectedBuddy.name}
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg mx-auto mb-4"
                  fallbackSrc={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedBuddy.name}&backgroundColor=b6e3f4&size=150`}
                />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {selectedBuddy.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedBuddy.age} years old • {selectedBuddy.location}
                  </p>
                </div>

                {/* Health Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">Health Score</span>
                    </div>
                    <div className={`text-2xl font-bold ${getHealthScoreColor(selectedBuddy.healthScore)}`}>
                      {selectedBuddy.healthScore}/100
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">Stress Score</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedBuddy.stressScore}/100
                    </div>
                  </div>
                </div>

                {/* Activity Match */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">Activity Match</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {selectedBuddy.activityMatchPercentage}%
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBuddy.activityTag}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${selectedBuddy.activityMatchPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Summary and Interests */}
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">About</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedBuddy.summary}
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBuddy.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {getFriendRequestStatus(selectedBuddy.id) === null && (
                    <button
                      onClick={() => {
                        handleSendFriendRequest(selectedBuddy.id);
                        setShowProfileModal(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <UserPlus className="w-5 h-5" />
                      Send Friend Request
                    </button>
                  )}
                  
                  {getFriendRequestStatus(selectedBuddy.id) === 'accepted' && (
                    <button
                      onClick={() => {
                        handleChatWithFriend(selectedBuddy.id);
                        setShowProfileModal(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Start Chat
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuddyMatcher;
