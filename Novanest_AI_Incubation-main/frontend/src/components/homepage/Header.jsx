import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/Novanest-logo.jpg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle navbar transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header>
      <div className={`fixed top-0 w-full py-5 px-8 flex justify-between items-center z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' : ''
      }`}>
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Novanest Logo" 
            className="h-10 object-contain bg-white rounded-full p-0.5 shadow-md mr-3"
          />
          <h1 className="text-white text-2xl font-bold">Novanest</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-white hover:text-blue-200 text-sm font-medium transition-all duration-300">
            Features
          </a>
          <a href="#how-it-works" className="text-white hover:text-blue-200 text-sm font-medium transition-all duration-300">
            How It Works
          </a>
          <a href="#testimonials" className="text-white hover:text-blue-200 text-sm font-medium transition-all duration-300">
            Success Stories
          </a>
          <Link to="/login" className="text-white hover:text-blue-200 text-sm font-medium transition-all duration-300">
            Sign in
          </Link>
          <Link 
            to="/register" 
            className="text-blue-600 bg-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-opacity-90 transition-all duration-300"
          >
            Get Started
          </Link>
        </nav>
        <button 
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[73px] left-0 right-0 bg-gray-900/95 backdrop-blur-md shadow-lg z-40 py-4 px-6">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-white hover:text-blue-200 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-white hover:text-blue-200 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#testimonials" 
              className="text-white hover:text-blue-200 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Success Stories
            </a>
            <Link 
              to="/login" 
              className="text-white hover:text-blue-200 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;