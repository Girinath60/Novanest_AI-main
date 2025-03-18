import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from 'axios';
import Modal from './Modal';
import ProfileEditForm from './ProfileEditForm';

const NavBar = () => {
  const { user, refreshUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchCounts = async () => {
        try {
          // Fetch both counts in parallel
          const [messagesResponse, notificationsResponse] = await Promise.all([
            axios.get('http://localhost:5000/api/messages/unread/count', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }),
            axios.get('http://localhost:5000/api/notifications/unread/count', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
          ]);
          
          setUnreadCount(messagesResponse.data.unreadCount);
          setUnreadNotificationCount(notificationsResponse.data.unreadCount);
        } catch (error) {
          console.error('Error fetching counts:', error);
        }
      };
      
      fetchCounts();
      
      // Poll for updates every minute
      const interval = setInterval(fetchCounts, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handle edit profile click
  const handleEditProfileClick = () => {
    setShowEditProfileForm(true);
    setShowDropdown(false); // Close the dropdown
  };

  const handleProfileUpdate = (updatedUser) => {
    // Update user data in context
    refreshUserData();
  };

  // Determine dashboard route based on role
  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    switch(user.role) {
      case 'entrepreneur': return '/entrepreneur-dashboard';
      case 'investor': return '/investor-dashboard';
      case 'mentor': return '/mentor-dashboard';
      default: return '/';
    }
  };

  if (!user) {
    return (
      <nav className="bg-background-dark py-4 px-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            Novanest
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Sign Up</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-background-dark py-4 px-6 shadow-lg">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Logo and brand */}
        <Link to={getDashboardRoute()} className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">Novanest</span>
        </Link>
        
        {/* Navigation links */}
        <div className="flex items-center space-x-4">
          <Link to={getDashboardRoute()} className="nav-link">
            Dashboard
          </Link>
          <Link to="/pitchdeck" className="nav-link">
            Startups
          </Link>
          <Link to="/messages" className="nav-link relative">
            Messages
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          {user.role === 'entrepreneur' && (
            <Link to="/entrepreneur-dashboard" className="nav-link">
              My Startups
            </Link>
          )}
          {user.role === 'investor' && (
            <Link to="/investor-dashboard" className="nav-link">
              Investments
            </Link>
          )}
          {user.role === 'mentor' && (
            <Link to="/mentor-dashboard" className="nav-link">
              Mentorships
            </Link>
          )}
          <div className="relative">
            <Link to="/notifications" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
              </svg>
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </Link>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 nav-link focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {user.profileDetails?.profilePhoto ? (
                  <img 
                    src={user.profileDetails.profilePhoto} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span>{user.name}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  View Profile
                </Link>
                <button 
                  onClick={handleEditProfileClick}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Edit Profile
                </button>
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Settings
                </Link>
                <hr className="my-1 border-gray-200" />
                <button 
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }} 
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Add the modal at the bottom of your component */}
      {showEditProfileForm && (
        <Modal show={showEditProfileForm} onClose={() => setShowEditProfileForm(false)}>
          <ProfileEditForm 
            user={user} 
            onUpdate={handleProfileUpdate} 
            onClose={() => setShowEditProfileForm(false)} 
          />
        </Modal>
      )}
    </nav>
  );
};

export default NavBar;