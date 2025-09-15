import React, { useState } from 'react';
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Download, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const VisualizationDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  const metrics = [
    { id: 'all', label: 'All Metrics' },
    { id: 'sleep', label: 'Sleep Quality' },
    { id: 'exercise', label: 'Exercise' },
    { id: 'mood', label: 'Mood' },
    { id: 'nutrition', label: 'Nutrition' }
  ];

  // Mock data for charts
  const mockChartData = {
    sleep: [7.5, 8.0, 7.2, 8.5, 7.8, 8.2, 7.9],
    exercise: [30, 45, 0, 60, 30, 45, 30],
    mood: [8, 7, 6, 9, 8, 8, 9],
    nutrition: [1800, 2000, 1500, 2200, 1900, 2100, 2000]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Personalized Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Beautiful data visualization of your wellness progress
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4">
            {/* Period Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                {periods.map(period => (
                  <option key={period.id} value={period.id}>{period.label}</option>
                ))}
              </select>
            </div>

            {/* Metric Selector */}
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                {metrics.map(metric => (
                  <option key={metric.id} value={metric.id}>{metric.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sleep Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Sleep Quality</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockChartData.sleep.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div 
                    className="bg-blue-500 rounded-t w-8 transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${(value / 10) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {value}h
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Exercise Minutes</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockChartData.exercise.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div 
                    className="bg-green-500 rounded-t w-8 transition-all duration-500 hover:bg-green-600"
                    style={{ height: `${(value / 60) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {value}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Mood Score</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockChartData.mood.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div 
                    className="bg-pink-500 rounded-t w-8 transition-all duration-500 hover:bg-pink-600"
                    style={{ height: `${(value / 10) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {value}/10
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Daily Calories</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockChartData.nutrition.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div 
                    className="bg-orange-500 rounded-t w-8 transition-all duration-500 hover:bg-orange-600"
                    style={{ height: `${(value / 2500) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">AI Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Sleep Pattern</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your sleep quality has improved by 12% this week. Try maintaining consistent bedtime for better results.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Exercise Correlation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Days with 30+ minutes of exercise show 15% higher mood scores. Keep up the great work!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationDashboard;
