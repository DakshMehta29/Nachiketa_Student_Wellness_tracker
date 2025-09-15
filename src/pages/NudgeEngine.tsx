import React, { useState } from 'react';
import { ArrowLeft, Bell, Settings, TrendingUp, Target, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const NudgeEngine = () => {
  const [activeTab, setActiveTab] = useState('insights');

  const tabs = [
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'nudges', label: 'Active Nudges', icon: Bell },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const insights = [
    {
      id: 1,
      type: 'correlation',
      title: 'Sleep & Mood Correlation',
      description: 'Your mood scores are 23% higher on days when you get 7+ hours of sleep.',
      impact: 'high',
      recommendation: 'Try to maintain consistent sleep schedule'
    },
    {
      id: 2,
      type: 'pattern',
      title: 'Exercise Pattern Detected',
      description: 'You exercise more consistently on weekdays. Weekends show 40% less activity.',
      impact: 'medium',
      recommendation: 'Consider weekend workout reminders'
    },
    {
      id: 3,
      type: 'trend',
      title: 'Stress Level Trend',
      description: 'Stress levels peak during exam periods. Nutrition intake drops by 15%.',
      impact: 'high',
      recommendation: 'Increase meal prep during exam periods'
    }
  ];

  const activeNudges = [
    {
      id: 1,
      title: 'Hydration Reminder',
      description: 'Drink water every 2 hours',
      frequency: 'Every 2 hours',
      status: 'active',
      effectiveness: 85,
      nextTrigger: '2:30 PM'
    },
    {
      id: 2,
      title: 'Study Break Exercise',
      description: 'Take a 5-minute walk after 1 hour of studying',
      frequency: 'During study sessions',
      status: 'active',
      effectiveness: 72,
      nextTrigger: 'Next study session'
    },
    {
      id: 3,
      title: 'Bedtime Reminder',
      description: 'Prepare for sleep 30 minutes before target bedtime',
      frequency: 'Daily at 10:30 PM',
      status: 'active',
      effectiveness: 91,
      nextTrigger: '10:30 PM today'
    }
  ];

  const goals = [
    {
      id: 1,
      title: 'Sleep Consistency',
      description: 'Maintain 7-8 hours of sleep for 30 days',
      progress: 23,
      target: 30,
      status: 'on-track'
    },
    {
      id: 2,
      title: 'Exercise Streak',
      description: 'Exercise for 30 minutes daily',
      progress: 12,
      target: 21,
      status: 'on-track'
    },
    {
      id: 3,
      title: 'Mood Improvement',
      description: 'Average mood score above 7.5',
      progress: 7.2,
      target: 7.5,
      status: 'needs-attention'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Correlation & Nudge Engine
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Smart, personalized habit reminders and insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.map((insight) => (
                <div key={insight.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.impact === 'high' ? 'bg-red-100 dark:bg-red-900/20' :
                      insight.impact === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      'bg-green-100 dark:bg-green-900/20'
                    }`}>
                      <TrendingUp className={`w-5 h-5 ${
                        insight.impact === 'high' ? 'text-red-600 dark:text-red-400' :
                        insight.impact === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{insight.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{insight.description}</p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Recommendation:</strong> {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'nudges' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Active Nudges</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Add New Nudge
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeNudges.map((nudge) => (
                <div key={nudge.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{nudge.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{nudge.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                      {nudge.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Frequency:</span>
                      <span className="text-gray-800 dark:text-gray-100">{nudge.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Effectiveness:</span>
                      <span className="text-gray-800 dark:text-gray-100">{nudge.effectiveness}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Next trigger:</span>
                      <span className="text-gray-800 dark:text-gray-100">{nudge.nextTrigger}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Disable
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Your Goals</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Set New Goal
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        goal.status === 'on-track' ? 'bg-green-100 dark:bg-green-900/20' :
                        goal.status === 'needs-attention' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                        'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        <Target className={`w-5 h-5 ${
                          goal.status === 'on-track' ? 'text-green-600 dark:text-green-400' :
                          goal.status === 'needs-attention' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{goal.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{goal.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      goal.status === 'on-track' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' :
                      goal.status === 'needs-attention' ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' :
                      'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                    }`}>
                      {goal.status === 'on-track' ? 'On Track' :
                       goal.status === 'needs-attention' ? 'Needs Attention' : 'Behind'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Progress:</span>
                      <span className="text-gray-800 dark:text-gray-100">
                        {typeof goal.progress === 'number' && goal.progress < 10 ? 
                          `${goal.progress}/${goal.target}` : 
                          `${goal.progress}${typeof goal.progress === 'number' ? '' : '/10'}`
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          goal.status === 'on-track' ? 'bg-green-500' :
                          goal.status === 'needs-attention' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ 
                          width: `${typeof goal.progress === 'number' && goal.progress < 10 ? 
                            (goal.progress / goal.target) * 100 : 
                            goal.progress * 10
                          }%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Nudge Settings</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">Push Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Receive nudges via push notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">Email Reminders</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Get weekly summary emails</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">Smart Timing</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">AI-optimized notification timing</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NudgeEngine;
