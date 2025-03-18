import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="relative px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative px-8 py-16 md:py-20">
            {/* Abstract shapes */}
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full"></div>
            </div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Accelerate Your Startup Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-10">
                Join thousands of entrepreneurs, investors, and mentors on Novanest today and unlock your potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="py-3 px-8 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/about"
                  className="py-3 px-8 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;