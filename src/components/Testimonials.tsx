import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  university: string;
  year: string;
  quote: string;
  avatar: string;
  rating: number;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading and set mock testimonials
    const timer = setTimeout(() => {
      setTestimonials([
        {
          id: 1,
          name: "Sarah J.",
          university: "Stanford University",
          year: "Junior",
          quote: "Nachiketa has been a game-changer for my mental health during finals week!",
          avatar: "👩‍🎓",
          rating: 5
        },
        {
          id: 2,
          name: "Michael T.",
          university: "MIT",
          year: "Sophomore",
          quote: "The personalized wellness tips helped me establish a consistent sleep schedule.",
          avatar: "👨‍💻",
          rating: 4
        },
        {
          id: 3,
          name: "Priya K.",
          university: "UC Berkeley",
          year: "Senior",
          quote: "I love how the AI adapts to my changing needs throughout the semester.",
          avatar: "👩‍🔬",
          rating: 5
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="testimonials" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
            What <span className="text-blue-600">Students</span> Are Saying
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Join thousands of students who have transformed their wellness journey with ManasFit
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {isLoading && (
            <div className="sm:col-span-2 lg:col-span-3 text-center text-gray-600">Loading testimonials…</div>
          )}
          {!isLoading && error && (
            <div className="sm:col-span-2 lg:col-span-3 text-center text-red-600">{error}</div>
          )}
          {!isLoading && !error && (testimonials ?? []).map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 mb-3 sm:mb-4" />
              
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-4 sm:mb-6 italic">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg sm:text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{testimonial.year} at {testimonial.university}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white dark:bg-gray-800 px-6 sm:px-8 py-4 sm:py-4 rounded-full shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs sm:text-sm">👨‍🎓</div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xs sm:text-sm">👩‍💻</div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-xs sm:text-sm">👨‍🔬</div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs sm:text-sm">👩‍🎨</div>
            </div>
            <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              <span className="font-semibold">5,000+</span> students are already improving their wellness
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;