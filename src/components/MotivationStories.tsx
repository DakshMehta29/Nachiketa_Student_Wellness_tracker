import React from 'react';
import { BookOpen, Clock, User, TrendingUp, Heart, Target } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  author: string;
  readTime: string;
  category: string;
  excerpt: string;
  image: string;
  source: string;
  url: string;
}

const MotivationStories = () => {
  const stories: Story[] = [
    {
      id: 1,
      title: "The Science of Building Better Habits: A Student's Guide to Lasting Change",
      author: "Dr. Sarah Chen",
      readTime: "8 min read",
      category: "Habit Formation",
      excerpt: "Discover the neuroscience behind habit formation and learn practical strategies that college students can use to build lasting positive habits for academic and personal success.",
      image: "📚",
      source: "Psychology Today",
      url: "https://www.psychologytoday.com"
    },
    {
      id: 2,
      title: "How Mindfulness Meditation Transformed My Academic Performance",
      author: "Alex Rodriguez",
      readTime: "6 min read",
      category: "Mental Wellness",
      excerpt: "A personal journey of how incorporating just 10 minutes of daily meditation led to improved focus, reduced stress, and better grades during the most challenging semester.",
      image: "🧘‍♀️",
      source: "Mindful.org",
      url: "https://www.mindful.org"
    },
    {
      id: 3,
      title: "The 5-Minute Rule: How Small Actions Lead to Big Changes",
      author: "Dr. James Clear",
      readTime: "5 min read",
      category: "Productivity",
      excerpt: "Learn how the principle of starting with just 5 minutes can help you overcome procrastination and build momentum toward your biggest goals.",
      image: "⏰",
      source: "James Clear Blog",
      url: "https://jamesclear.com"
    },
    {
      id: 4,
      title: "From Burnout to Balance: A Student's Recovery Story",
      author: "Maria Santos",
      readTime: "7 min read",
      category: "Wellness",
      excerpt: "How one graduate student learned to recognize the signs of burnout and implemented a sustainable self-care routine that transformed her academic and personal life.",
      image: "💪",
      source: "Harvard Health",
      url: "https://www.health.harvard.edu"
    },
    {
      id: 5,
      title: "The Power of Sleep: Why 8 Hours Isn't Just a Luxury",
      author: "Dr. Matthew Walker",
      readTime: "9 min read",
      category: "Sleep Science",
      excerpt: "Neuroscientist explains how proper sleep directly impacts learning, memory consolidation, and emotional regulation - essential for student success.",
      image: "😴",
      source: "Sleep Foundation",
      url: "https://www.sleepfoundation.org"
    },
    {
      id: 6,
      title: "Building Resilience: Lessons from Students Who Overcame Adversity",
      author: "Dr. Angela Duckworth",
      readTime: "10 min read",
      category: "Resilience",
      excerpt: "Research-backed strategies for developing grit and resilience, featuring real stories of students who turned their biggest challenges into their greatest strengths.",
      image: "🌟",
      source: "Character Lab",
      url: "https://characterlab.org"
    }
  ];

  const categories = ["All", "Habit Formation", "Mental Wellness", "Productivity", "Wellness", "Sleep Science", "Resilience"];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
              Motivation & <span className="text-blue-600">Success Stories</span>
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Real stories, proven strategies, and science-backed insights to inspire your wellness journey
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                category === "All"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {stories.map((story) => (
            <article
              key={story.id}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="text-2xl sm:text-3xl">{story.image}</div>
                <div className="flex-1">
                  <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    {story.category}
                  </span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 line-clamp-2">
                {story.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-3">
                {story.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">{story.author}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{story.readTime}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Source: {story.source}
                </div>
                <button
                  onClick={() => window.open(story.url, '_blank')}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-1 sm:gap-2"
                >
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-10 sm:mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                Ready to Start Your Journey?
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
              Join thousands of students who are already transforming their wellness habits with personalized insights and proven strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="px-5 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                Set Your Goals
              </button>
              <button className="px-5 sm:px-6 py-2 sm:py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                Track Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MotivationStories;
