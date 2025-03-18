import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from './api';
import { motion } from 'framer-motion';
import './styles.css';
import logo from './assets/Novanest-logo.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error message when user starts typing again
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const response = await loginUser(formData);
      localStorage.setItem('token', response.token);
      
      // Wait for the user context to update before redirecting
      setTimeout(() => {
        if (response.role === 'entrepreneur') {
          navigate('/entrepreneur-dashboard');
        } else if (response.role === 'investor') {
          navigate('/investor-dashboard');
        } else if (response.role === 'mentor') {
          navigate('/mentor-dashboard');
        }
      }, 100);
    } catch (error) {
      setErrorMsg(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-20 -left-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute w-96 h-96 -bottom-20 -right-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute w-80 h-80 top-1/3 left-1/3 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute w-72 h-72 bottom-1/3 right-1/3 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-6000"></div>
      </div>

      <motion.div 
        className="relative w-full max-w-md p-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="backdrop-blur-md bg-white/90 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 relative overflow-hidden">
            {/* Abstract shapes in header */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
            
            <motion.div 
              className="flex justify-center"
              variants={itemVariants}
            >
              <img 
                src={logo} 
                alt="Novanest Logo" 
                className="h-16 object-contain bg-white rounded-full p-1 shadow-xl"
              />
            </motion.div>
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-center mt-4 text-white"
              variants={itemVariants}
            >
              Welcome Back
            </motion.h2>
            <motion.p 
              className="text-sm text-center text-blue-100 mt-2 max-w-xs mx-auto"
              variants={itemVariants}
            >
              Sign in to your Novanest account
            </motion.p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded"
              >
                <p>{errorMsg}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div className="group" variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all group-focus-within:text-blue-600">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div className="group" variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all group-focus-within:text-blue-600">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div className="flex items-center justify-between" variants={itemVariants}>
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <button 
                  type="button"
                  onClick={() => alert('Forgot password functionality coming soon!')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 border-none bg-transparent p-0 cursor-pointer"
                >
                  Forgot password?
                </button>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : 'Sign In'}
              </motion.button>
            </form>

            {/* Account Portal Info */}
            <motion.div 
              className="mt-8 pt-6 border-t border-gray-100"
              variants={itemVariants}
            >
              <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-700">Welcome Back!</span> Sign in to access your personalized dashboard, connect with your network, and explore new opportunities in the startup ecosystem.
                </p>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div 
              className="mt-6 pt-5 border-t border-gray-200 text-center"
              variants={itemVariants}
            >
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  Create Account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="text-center mt-6"
          variants={itemVariants}
        >
          <p className="text-xs text-blue-200/80">
            © {new Date().getFullYear()} Novanest. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;