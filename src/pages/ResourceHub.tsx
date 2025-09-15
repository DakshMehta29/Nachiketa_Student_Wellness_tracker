import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Play, BookOpen, Download, Star, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const ResourceHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'guides', label: 'Guides' },
    { id: 'videos', label: 'Videos' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'articles', label: 'Articles' }
  ];

  const resources = [
    {
      id: 1,
      title: 'Complete Guide to Student Wellness',
      type: 'guide',
      category: 'guides',
      description: 'A comprehensive guide covering nutrition, sleep, exercise, and mental health for students.',
      duration: '15 min read',
      rating: 4.8,
      downloads: 1250,
      thumbnail: '📚',
      featured: true
    },
    {
      id: 2,
      title: '5-Minute Morning Meditation',
      type: 'video',
      category: 'videos',
      description: 'Start your day with this calming meditation routine designed for busy students.',
      duration: '5 min',
      rating: 4.9,
      downloads: 890,
      thumbnail: '🧘‍♀️',
      featured: true
    },
    {
      id: 3,
      title: 'Stress Management Techniques',
      type: 'article',
      category: 'articles',
      description: 'Learn evidence-based techniques to manage academic stress and anxiety.',
      duration: '8 min read',
      rating: 4.7,
      downloads: 2100,
      thumbnail: '💆‍♂️',
      featured: false
    },
    {
      id: 4,
      title: 'Quick Study Break Exercises',
      type: 'video',
      category: 'exercises',
      description: 'Simple exercises you can do during study breaks to boost energy and focus.',
      duration: '3 min',
      rating: 4.6,
      downloads: 750,
      thumbnail: '🏃‍♀️',
      featured: false
    },
    {
      id: 5,
      title: 'Healthy Meal Prep for Students',
      type: 'guide',
      category: 'guides',
      description: 'Budget-friendly meal prep ideas that are nutritious and easy to make.',
      duration: '12 min read',
      rating: 4.8,
      downloads: 980,
      thumbnail: '🥗',
      featured: true
    },
    {
      id: 6,
      title: 'Sleep Optimization Workshop',
      type: 'video',
      category: 'videos',
      description: 'Expert tips on improving sleep quality for better academic performance.',
      duration: '20 min',
      rating: 4.9,
      downloads: 1200,
      thumbnail: '😴',
      featured: false
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                Curated Resource Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Access guides, videos, and wellness exercises
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.filter(r => r.featured).map(resource => (
              <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{resource.thumbnail}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                        {resource.type}
                      </span>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{resource.rating}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{resource.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {resource.downloads}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    {resource.type === 'video' ? <Play className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                    {resource.type === 'video' ? 'Watch' : 'Read'}
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Resources */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">All Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{resource.thumbnail}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                        {resource.type}
                      </span>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{resource.rating}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{resource.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {resource.downloads}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    {resource.type === 'video' ? <Play className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                    {resource.type === 'video' ? 'Watch' : 'Read'}
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">No resources found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceHub;
