import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

type PetProfile = {
  name: string;
  imageKey?: 'pet1' | 'pet2';
  startDate: string;
  mood?: 'happy' | 'sad' | 'neutral' | 'stressed';
};

const Hero = () => {
  const [profile, setProfile] = useState<PetProfile | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('petProfile');
      if (raw) setProfile(JSON.parse(raw) as PetProfile);
    } catch (error) {
      console.error('Error loading pet profile:', error);
    }
  }, []);
  const daysTogether = useMemo(() => {
    if (!profile?.startDate) return 14; // default placeholder
    const start = new Date(profile.startDate).getTime();
    const today = new Date().setHours(0,0,0,0);
    return Math.max(1, Math.ceil((today - start) / (1000*60*60*24)));
  }, [profile?.startDate]);
  const petSrc = profile?.imageKey === 'pet2' ? '/pets/pet-2.jpeg' : '/pets/pet-1.jpeg';

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-16 sm:pt-20 pb-2 sm:pb-4 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1 lg:ml-8 lg:mr-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 leading-tight mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Nachiketa
              </span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Your AI Wellness Companion</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Holistic wellness tracking and AI-powered support designed specifically for students. 
              Balance your mental health and fitness journey with your personal AI companion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-4 sm:mb-6">
              <Link to="/companion-selection">
                <button className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-base sm:text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Get Started Free
                  <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <button className="group px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-full font-semibold text-base sm:text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                <Play className="inline-block mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>24/7 AI Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Student Focused</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative">
              <div className="w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-green-400/20 rounded-full blur-3xl absolute inset-0"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 dark:border-gray-700 w-80 sm:w-96">
                <div className="text-center">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 sm:mb-5 flex items-center justify-center overflow-hidden">
                    <img src={petSrc} alt="Pet" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Meet your AI Companion</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 sm:mb-4">Your personalized wellness buddy</p>
                  
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <div className="text-green-600 dark:text-green-400 font-bold text-base sm:text-lg">85%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Health</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="text-blue-600 dark:text-blue-400 font-bold text-base sm:text-lg">Low</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Stress</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                      <div className="text-purple-600 dark:text-purple-400 font-bold text-base sm:text-lg">{daysTogether}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative transition element */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      
      {/* Floating elements for dashing look */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-green-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
    </section>
  );
};

export default Hero;