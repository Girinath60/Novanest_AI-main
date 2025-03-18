import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const MeetingModal = ({ meeting, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Handle copying the meeting link to clipboard
  const copyMeetingLink = () => {
    const link = `https://meet.novanest.com/session/${meeting._id}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy link:', err));
  };

  // Handle joining the video meeting
  const joinMeeting = () => {
    // In a real app, this would navigate to or open the video conference
    window.open(`https://meet.novanest.com/session/${meeting._id}`, '_blank');
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", duration: 0.5, bounce: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 overflow-y-auto"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <motion.div 
            className="fixed inset-0 transition-opacity" 
            aria-hidden="true"
            onClick={onClose}
            variants={overlayVariants}
          >
            <div className="absolute inset-0 bg-gray-900 opacity-75 backdrop-blur-sm"></div>
          </motion.div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-block align-bottom bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
              
              <h3 className="text-xl leading-6 font-bold text-white">
                Meeting Details
              </h3>
              <p className="mt-1 text-sm text-blue-100">
                Mentorship session information
              </p>
            </div>
            
            <div className="bg-white p-6">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex items-center mb-3">
                  <img 
                    className="h-10 w-10 rounded-full object-cover mr-3"
                    src={meeting.mentee?.profilePhoto || "/avatar-placeholder.png"}
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/avatar-placeholder.png";
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {meeting.mentee?.name || 'Entrepreneur'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {meeting.nextSession ? format(new Date(meeting.nextSession), 'MMMM d, yyyy • h:mm a') : 'Time not set'}
                    </p>
                  </div>
                </div>
                
                {meeting.startup && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Startup:</span> {meeting.startup.name}
                    </p>
                    {meeting.startup.industry && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        {meeting.startup.industry}
                      </span>
                    )}
                  </div>
                )}
                
                {meeting.agenda && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">Meeting Agenda:</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {meeting.agenda}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link:
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md p-2">
                  <span className="text-sm text-blue-600 truncate flex-1">
                    https://meet.novanest.com/session/{meeting?._id || 'meeting-id'}
                  </span>
                  <button 
                    onClick={copyMeetingLink}
                    className="ml-2 inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    title="Copy link"
                  >
                    {isCopied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <motion.button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
                <motion.button
                  type="button"
                  onClick={joinMeeting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Join Meeting
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MeetingModal;