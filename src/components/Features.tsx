import { 
  FileText, 
  Bot, 
  BarChart3, 
  BookOpen, 
  Bell, 
  Gamepad2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Unified Wellness Tracker",
      description: "Track sleep, exercise, nutrition, and mood in one place",
      color: "from-blue-500 to-blue-600",
      route: "/wellness-tracker"
    },
    {
      icon: Bot,
      title: "AI Conversational Agent",
      description: "Empathetic chatbot providing 24/7 support and guidance",
      color: "from-purple-500 to-purple-600",
      route: "/agent"
    },
    {
      icon: BarChart3,
      title: "Personalized Dashboard",
      description: "Beautiful data visualization of your wellness progress",
      color: "from-green-500 to-green-600",
      route: "/visualization-dashboard"
    },
    {
      icon: BookOpen,
      title: "Curated Resource Hub",
      description: "Access guides, videos, and wellness exercises",
      color: "from-teal-500 to-teal-600",
      route: "/resource-hub"
    },
    {
      icon: Bell,
      title: "Correlation & Nudge Engine",
      description: "Smart, personalized habit reminders and insights",
      color: "from-orange-500 to-orange-600",
      route: "/nudge-engine"
    },
    {
      icon: Gamepad2,
      title: "Gamification & Guided Modules",
      description: "Earn streaks, badges, and complete self-care journeys",
      color: "from-pink-500 to-pink-600",
      route: "/onboarding"
    }
  ];

  return (
    <section id="features" className="pt-2 sm:pt-4 pb-12 sm:pb-16 lg:pb-20 bg-white dark:bg-gray-900 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
            Complete Wellness in <span className="text-blue-600">One Platform</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Everything you need to maintain your mental and physical health as a student, 
            powered by AI and designed with your busy lifestyle in mind.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Link 
              key={index}
              to={feature.route}
              className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-3 block relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${feature.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
                  {feature.description}
                </p>
                
                <span className="inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm sm:text-base group-hover:translate-x-1 transition-transform duration-300">
                  Explore {feature.title} →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center relative">
          {/* Decorative elements */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-2xl"></div>
          
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-blue-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative z-10">
            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm sm:text-base">🎯 All features designed specifically for student life</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;