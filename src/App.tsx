import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import MotivationStories from './components/MotivationStories';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <MotivationStories />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;