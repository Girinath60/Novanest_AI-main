import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './components/Modal';
import ProfileEditForm from './components/ProfileEditForm';
import { motion } from 'framer-motion'; // Add this dependency for animations

const Profile = () => {
  const { loading: contextLoading, refreshUserData } = useContext(UserContext);
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data) {
          setLocalUser(response.data);
        } else {
          setError("Received empty response from server");
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        
        if (error.response) {
          setError(`Server error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, []); 

  const handleProfileUpdate = (updatedUser) => {
    setLocalUser(updatedUser);
    refreshUserData();
  };

  // Update the click handler for the Edit Profile button to check authentication
  const handleEditClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Your session has expired. Please login again.");
      navigate('/login');
      return;
    }
    
    // If token exists, show the edit form
    setShowEditForm(true);
  };


  if (contextLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-white shadow-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !localUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Profile Error</h2>
          <p className="text-red-500 mb-6 text-sm">{error || "Error loading profile data"}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 w-full"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-6 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100"
        >
          {/* Banner */}
          <div className="h-60 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <button 
              onClick={handleEditClick}
              className="absolute top-4 right-4 flex items-center px-4 py-2 bg-white bg-opacity-90 text-blue-600 rounded-lg shadow-md hover:bg-opacity-100 transition-all duration-200 font-medium text-sm border border-blue-100 backdrop-blur-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              Edit Profile
            </button>
          </div>
          
          <div className="px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-end">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl -mt-24 ring-4 ring-blue-50">
                {localUser.profileDetails?.profilePhoto ? (
                  <img 
                    src={localUser.profileDetails.profilePhoto} 
                    alt={localUser.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {localUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="md:ml-8 mt-4 md:mt-0">
                <h1 className="text-3xl font-bold text-gray-800">{localUser.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full capitalize">
                    {localUser.role}
                  </span>
                  {localUser.profileDetails?.location && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {localUser.profileDetails.location}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:ml-auto flex space-x-4 mt-6 md:mt-0">
                {localUser.profileDetails?.linkedin && (
                  <a 
                    href={localUser.profileDetails.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md border border-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                  </a>
                )}
                {localUser.profileDetails?.website && (
                  <a 
                    href={localUser.profileDetails.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md border border-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
                    </svg>
                  </a>
                )}
                {localUser.profileDetails?.email && (
                  <a 
                    href={`mailto:${localUser.email}`}
                    className="text-gray-400 hover:text-blue-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md border border-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
            
            {localUser.profileDetails?.bio && (
              <div className="mt-6 max-w-3xl bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-gray-700 leading-relaxed">{localUser.profileDetails.bio}</p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Navigation Tabs */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-1 border border-gray-100">
          <nav className="flex justify-center">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-3 text-sm font-medium rounded-lg mx-1 transition-all duration-200 ${
                activeTab === 'about' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              About
            </button>
            
            {localUser.role === 'entrepreneur' && (
              <button
                onClick={() => setActiveTab('startups')}
                className={`px-6 py-3 text-sm font-medium rounded-lg mx-1 transition-all duration-200 ${
                  activeTab === 'startups' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Startups
              </button>
            )}
            
            {localUser.role === 'investor' && (
              <button
                onClick={() => setActiveTab('investments')}
                className={`px-6 py-3 text-sm font-medium rounded-lg mx-1 transition-all duration-200 ${
                  activeTab === 'investments' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Investments
              </button>
            )}
            
            {localUser.role === 'mentor' && (
              <button
                onClick={() => setActiveTab('mentorship')}
                className={`px-6 py-3 text-sm font-medium rounded-lg mx-1 transition-all duration-200 ${
                  activeTab === 'mentorship' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Mentorship
              </button>
            )}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Tab Content */}
          {activeTab === 'about' && (
            <>
              <div className="md:col-span-1">
                {/* Contact Information Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 mb-6 border border-gray-100"
                >
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start rounded-lg p-2 hover:bg-gray-50">
                      <span className="text-blue-600 font-medium w-24 flex-shrink-0">Email:</span>
                      <span className="text-gray-800">{localUser.email}</span>
                    </div>
                    {localUser.profileDetails?.phone && (
                      <div className="flex items-start rounded-lg p-2 hover:bg-gray-50">
                        <span className="text-blue-600 font-medium w-24 flex-shrink-0">Phone:</span>
                        <span className="text-gray-800">{localUser.profileDetails.phone}</span>
                      </div>
                    )}
                    {localUser.profileDetails?.address && (
                      <div className="flex items-start rounded-lg p-2 hover:bg-gray-50">
                        <span className="text-blue-600 font-medium w-24 flex-shrink-0">Address:</span>
                        <span className="text-gray-800">{localUser.profileDetails.address}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
                
                {/* Expertise Areas */}
                {localUser.expertiseAreas?.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
                  >
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                      </svg>
                      Areas of Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {localUser.expertiseAreas.map((area, index) => (
                        <span 
                          key={index} 
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column */}
              <div className="md:col-span-2">
                {/* Professional Experience */}
                {localUser.profileDetails?.experience && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 mb-6 border border-gray-100"
                  >
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
                      </svg>
                      Professional Experience
                    </h2>
                    <div className="prose prose-blue max-w-none">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{localUser.profileDetails.experience}</p>
                    </div>
                  </motion.div>
                )}
                
                {/* Role-specific sections */}
                {localUser.role === 'investor' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
                  >
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                      </svg>
                      Investment Profile
                    </h2>
                    
                    <div className="space-y-6">
                      {localUser.profileDetails?.investmentFocus && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h3 className="font-medium text-blue-800 mb-2">Investment Focus</h3>
                          <p className="text-gray-700">{localUser.profileDetails.investmentFocus}</p>
                        </div>
                      )}
                      
                      {localUser.profileDetails?.investmentRange && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                          <h3 className="font-medium text-green-800 mb-2">Investment Range</h3>
                          <p className="text-gray-700">{localUser.profileDetails.investmentRange}</p>
                        </div>
                      )}
                      
                      {localUser.profileDetails?.previousInvestments && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                          <h3 className="font-medium text-purple-800 mb-2">Previous Investments</h3>
                          <p className="text-gray-700">{localUser.profileDetails.previousInvestments}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
                
                {localUser.role === 'mentor' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
                  >
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                      </svg>
                      Mentor Profile
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {localUser.mentorshipAreas?.length > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                          <h3 className="font-medium text-green-800 mb-3">Mentorship Areas</h3>
                          <div className="flex flex-wrap gap-2">
                            {localUser.mentorshipAreas.map((area, index) => (
                              <span 
                                key={index} 
                                className="bg-white text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200 shadow-sm"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {localUser.profileDetails?.yearsOfExperience && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                          <h3 className="font-medium text-blue-800 mb-3">Professional Experience</h3>
                          <div className="flex items-center">
                            <span className="text-3xl font-bold text-blue-600 mr-2">
                              {localUser.profileDetails.yearsOfExperience}
                            </span>
                            <span className="text-gray-700">years in the industry</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
          
          {/* Startups Tab Content */}
          {activeTab === 'startups' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="md:col-span-3"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L10 13.197l-4.419 2.617A1 1 0 014 15V4z" clipRule="evenodd"></path>
                  </svg>
                  My Startups
                </h2>
                
                {localUser.startups?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {localUser.startups.map((startup, index) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        key={startup._id} 
                        className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
                      >
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{startup.startupName}</h3>
                          {startup.tagline && (
                            <p className="text-sm text-gray-500 italic mb-4">{startup.tagline}</p>
                          )}
                          <div className="flex items-center justify-between mt-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                              {startup.industry}
                            </span>
                            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
                              {startup.stage}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <p className="text-gray-500 mb-3">You haven't posted any startups yet.</p>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      Add Your First Startup
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Investments Tab Content */}
          {activeTab === 'investments' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="md:col-span-3"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  Investment Portfolio
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {localUser.profileDetails?.investmentFocus && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                      <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
                        </svg>
                        Investment Focus
                      </h3>
                      <p className="text-gray-700">{localUser.profileDetails.investmentFocus}</p>
                    </div>
                  )}
                  
                  {localUser.profileDetails?.investmentRange && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 shadow-sm">
                      <h3 className="font-medium text-green-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                        </svg>
                        Investment Range
                      </h3>
                      <p className="text-gray-700">{localUser.profileDetails.investmentRange}</p>
                    </div>
                  )}
                  
                  {localUser.profileDetails?.previousInvestments && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 shadow-sm">
                      <h3 className="font-medium text-purple-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
                        </svg>
                        Previous Investments
                      </h3>
                      <p className="text-gray-700 whitespace-pre-line">{localUser.profileDetails.previousInvestments}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Mentorship Tab Content */}
          {activeTab === 'mentorship' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="md:col-span-3"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                  Mentorship Profile
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {localUser.mentorshipAreas?.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                      <h3 className="font-medium text-blue-800 mb-4 text-lg">Mentorship Areas</h3>
                      <div className="flex flex-wrap gap-3">
                        {localUser.mentorshipAreas.map((area, index) => (
                          <motion.span 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            key={index} 
                            className="bg-white text-blue-700 px-3 py-2 rounded-lg font-medium text-sm shadow-sm border border-blue-100 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            {area}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {localUser.profileDetails?.yearsOfExperience && (
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-100">
                      <h3 className="font-medium text-amber-800 mb-4 text-lg">Professional Experience</h3>
                      <div className="flex flex-col">
                        <div className="text-5xl font-bold text-amber-600 mb-2">
                          {localUser.profileDetails.yearsOfExperience}
                        </div>
                        <span className="text-gray-700">years in the industry</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {showEditForm && (
        <Modal onClose={() => setShowEditForm(false)}>
          <ProfileEditForm 
            user={localUser} 
            onUpdate={handleProfileUpdate} 
            onClose={() => setShowEditForm(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

export default Profile;