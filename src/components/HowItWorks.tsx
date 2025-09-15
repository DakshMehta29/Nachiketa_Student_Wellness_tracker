import React from 'react';
import { UserPlus, Activity, Brain } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign up & create your pet",
      description: "Choose and customize your AI companion that will grow with your wellness journey",
      visual: "🐾",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Activity,
      title: "Track your daily wellness",
      description: "Log your sleep, exercise, meals, and mood. Your pet reacts to your progress!",
      visual: "📊",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Brain,
      title: "Get insights + AI support",
      description: "Receive personalized recommendations and chat with your AI companion anytime",
      visual: "💡",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
            How <span className="text-purple-600">ManasFit</span> Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Get started in minutes and begin your holistic wellness journey with your AI companion
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Connecting Lines - Hidden on mobile, visible on larger screens */}
          <div className="hidden lg:block absolute top-20 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-300 via-green-300 to-purple-300 dark:from-gray-700 dark:via-gray-700 dark:to-gray-700"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}>
                  <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{step.visual}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-base sm:text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;