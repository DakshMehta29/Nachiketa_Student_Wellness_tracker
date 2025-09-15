import React from 'react';
import { Heart, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 dark:bg-gray-950 dark:text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Heart className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-xl sm:text-2xl font-bold text-white">Nachiketa</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              Empowering students worldwide with AI-powered wellness tracking and mental health support.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li className="hover:text-white cursor-pointer transition-colors">Wellness Tracking</li>
              <li className="hover:text-white cursor-pointer transition-colors">AI Companion</li>
              <li className="hover:text-white cursor-pointer transition-colors">Personal Dashboard</li>
              <li className="hover:text-white cursor-pointer transition-colors">Resource Hub</li>
              <li className="hover:text-white cursor-pointer transition-colors">Smart Reminders</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-white cursor-pointer transition-colors">Student Stories</li>
              <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">For Institutions</li>
              <li className="hover:text-white cursor-pointer transition-colors">API Documentation</li>
              <li className="hover:text-white cursor-pointer transition-colors">System Status</li>
              <li className="hover:text-white cursor-pointer transition-colors">Community</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
          <p>&copy; 2025 Nachiketa. All rights reserved. Made with ❤️ for student wellness.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;