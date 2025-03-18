import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 text-indigo-300 text-sm font-semibold mb-6">
          The Future of Startup Ecosystem
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Connect. Innovate.</span> Grow Together.
        </h1>
        <p className="text-xl text-blue-100/80 max-w-3xl mx-auto mb-10">
          Novanest brings entrepreneurs, investors, and mentors together on one AI-powered platform to build the future of innovation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link 
            to="/register" 
            className="w-full sm:w-auto py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Join Novanest Now
          </Link>
          <a 
            href="#how-it-works" 
            className="w-full sm:w-auto py-3 px-8 bg-gray-800/50 text-white font-medium rounded-lg border border-gray-700 hover:bg-gray-800/80 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>How It Works</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
      
      {/* Floating cards preview */}
      <div className="w-full max-w-6xl mx-auto relative h-96 mb-16">
        <div className="absolute left-0 top-0 md:left-10 w-full max-w-md transform -rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-105 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Startup Registration</h3>
                  <p className="text-sm text-gray-600">Complete profile in minutes</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
                <div className="h-2 bg-gray-200 rounded-full"></div>
                <div className="h-2 bg-gray-200 rounded-full w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-16 md:right-10 w-full max-w-md transform rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-105 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-3"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mentor Matching</h3>
                  <p className="text-sm text-gray-600">AI-powered recommendations</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
                <div className="h-2 bg-gray-200 rounded-full w-4/6"></div>
                <div className="h-2 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;