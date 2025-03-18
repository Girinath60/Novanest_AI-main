import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/Novanest-logo.jpg';

const Footer = () => {
  return (
    <footer className="relative px-4 py-12 bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src={logo} 
                alt="Novanest Logo" 
                className="h-8 object-contain bg-white rounded-full p-0.5 mr-2"
              />
              <h3 className="text-white text-xl font-bold">Novanest</h3>
            </div>
            <p className="text-gray-400 mb-4">
              The AI-powered platform connecting entrepreneurs, investors, and mentors to build the future of innovation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">For Entrepreneurs</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Resources</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Find Funding</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Mentorship</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">For Investors</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Deal Flow</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Portfolio</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Analytics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Investment Tools</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} Novanest, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-400">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-400">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;