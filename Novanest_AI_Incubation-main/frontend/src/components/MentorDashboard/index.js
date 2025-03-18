import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Overview from './Overview';
import Mentees from './Mentees';
import Requests from './Requests';
import OfficeHours from './OfficeHours';
import Profile from './Profile';
import MeetingModal from './modals/MeetingModal';

const MentorDashboard = () => {
  const { user, loading } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [metrics, setMetrics] = useState({
    totalMentees: 0,
    activeRequests: 0,
    mentorshipSessions: 0,
    impactScore: 0
  });
  const [matchedEntrepreneurs, setMatchedEntrepreneurs] = useState([]);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [activeMentorships, setActiveMentorships] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (user && user._id) {
      fetchDashboardData();
      
      // Set up auto-refresh every 2 minutes
      const refreshInterval = setInterval(() => {
        fetchDashboardData();
      }, 120000); // 2 minutes
      
      return () => clearInterval(refreshInterval);
    }
  }, [user, refreshTrigger]);

  const fetchDashboardData = async () => {
    try {
      setIsDataLoading(true);
      
      // Get metrics data
      const metricsResponse = await axios.get('http://localhost:5000/api/mentors/metrics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (metricsResponse.data) {
        setMetrics(metricsResponse.data);
      }

      // Get matched entrepreneurs
      const matchResponse = await axios.get('http://localhost:5000/api/match/mentees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (matchResponse.data) {
        setMatchedEntrepreneurs(matchResponse.data);
      }

      // Get mentorship requests
      const requestsResponse = await axios.get('http://localhost:5000/api/mentorship/requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (requestsResponse.data) {
        setMentorshipRequests(requestsResponse.data);
      }

      // Get active mentorships
      const mentorshipsResponse = await axios.get('http://localhost:5000/api/mentorship/active', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (mentorshipsResponse.data) {
        setActiveMentorships(mentorshipsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Show error toast
    } finally {
      setIsDataLoading(false);
    }
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleJoinMeeting = (meeting) => {
    setActiveMeeting(meeting);
    setShowMeetingModal(true);
  };

  const handleMentorshipOfferSent = (entrepreneurId, offerData) => {
    // Update your app state to reflect the sent offer
    setMatchedEntrepreneurs(prev => 
      prev.map(match => 
        match.entrepreneur._id === entrepreneurId 
          ? { ...match, offered: true, offerData } 
          : match
      )
    );
    
    // Show success notification
    showNotification('Mentorship offer sent successfully!', 'success');
  };
  
  // Notification system
  const [notifications, setNotifications] = useState([]);
  
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  };

  // Animations variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
          <motion.p 
            className="text-white mt-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
          >
            Loading your dashboard...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          {/* ... header content ... */}
        </header>
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 p-6">
          <div className="max-w-7xl mx-auto">
            {/* User welcome section */}
            <motion.div 
              className="mb-8"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-3xl font-bold text-gray-900"
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                Welcome back, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Mentor'}</span>
              </motion.h1>
              <motion.p 
                className="text-gray-500 mt-2"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </motion.p>
            </motion.div>
            
            {/* Refresh & action buttons */}
            <motion.div 
              className="mb-6 flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Refresh button removed from here */}
              
              <div className="flex gap-3 ml-auto">
                {activeTab === 'office-hours' && (
                  <button 
                    onClick={() => document.getElementById('add-slot-button')?.click()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Availability
                  </button>
                )}
                
                {activeTab === 'mentees' && (
                  <button 
                    onClick={() => setActiveTab('requests')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    View Requests
                  </button>
                )}
              </div>
            </motion.div>
            
            {/* Main tab content with animations */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {activeTab === 'overview' && (
                  <Overview 
                    metrics={metrics} 
                    activeMentorships={activeMentorships} 
                    matchedEntrepreneurs={matchedEntrepreneurs}
                    setActiveTab={setActiveTab}
                    handleJoinMeeting={handleJoinMeeting}
                    isLoading={isDataLoading}
                  />
                )}
                
                {activeTab === 'mentees' && (
                  <Mentees 
                    activeMentorships={activeMentorships} 
                    matchedEntrepreneurs={matchedEntrepreneurs}
                    handleJoinMeeting={handleJoinMeeting}
                    onMentorshipOfferSent={handleMentorshipOfferSent}
                    isLoading={isDataLoading}
                  />
                )}
                
                {activeTab === 'requests' && (
                  <Requests 
                    mentorshipRequests={mentorshipRequests}
                    refreshRequests={refreshData}
                    isLoading={isDataLoading}
                  />
                )}
                
                {activeTab === 'office-hours' && (
                  <OfficeHours
                    activeMentorships={activeMentorships}
                    handleJoinMeeting={handleJoinMeeting}
                    isLoading={isDataLoading}
                  />
                )}
                
                {activeTab === 'profile' && (
                  <Profile 
                    showNotification={showNotification}
                    isLoading={isDataLoading}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {/* Floating toast notifications */}
      <div className="fixed top-5 right-5 z-50 flex flex-col space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-lg shadow-lg p-4 text-white ${
                notification.type === 'success' ? 'bg-green-500' : 
                notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}
            >
              <div className="flex items-center">
                {notification.type === 'success' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                )}
                <p>{notification.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Meeting Modal */}
      <AnimatePresence>
        {showMeetingModal && (
          <MeetingModal 
            meeting={activeMeeting} 
            onClose={() => setShowMeetingModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentorDashboard;