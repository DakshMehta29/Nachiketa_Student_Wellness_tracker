import { ArrowRight, Building2, Users } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 lg:mb-10">
            Join ManasFit Today
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed px-6 sm:px-8">
            Take care of your body and mind with AI-powered wellness tracking. 
            Start your journey to better health and academic success.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <Users className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-blue-200 mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">For Students</h3>
            <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
              Start your personal wellness journey with your AI companion. Track, learn, and grow with personalized insights.
            </p>
            <ul className="text-blue-100 space-y-3 mb-8 sm:mb-10 text-sm sm:text-base lg:text-lg">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span>Free forever plan</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span>24/7 AI support</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span>Privacy protected</span>
              </li>
            </ul>
            <button className="w-full group px-8 sm:px-10 py-4 sm:py-5 bg-white text-blue-600 rounded-full font-semibold text-base sm:text-lg lg:text-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Start Free
              <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <Building2 className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-purple-200 mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">For Institutions</h3>
            <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
              Support your entire student body with comprehensive wellness analytics and campus-wide insights.
            </p>
            <ul className="text-blue-100 space-y-3 mb-8 sm:mb-10 text-sm sm:text-base lg:text-lg">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                <span>Campus-wide analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                <span>Student counseling support</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                <span>Custom integrations</span>
              </li>
            </ul>
            <button className="w-full group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-base sm:text-lg lg:text-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Contact Sales
              <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24 text-center px-4 sm:px-6">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10 text-blue-200 text-sm sm:text-base lg:text-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
              <span>Data Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;