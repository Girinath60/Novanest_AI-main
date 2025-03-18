import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';
import StartupForm from './StartupForm';
import ExpertiseForm from './ExpertiseForm';
import { UserContext } from '../UserContext';

const EntrepreneurDashboard = () => {
  const { user, loading, refreshUserData } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  const [showExpertiseForm, setShowExpertiseForm] = useState(false);
  const [startups, setStartups] = useState([]);
  const [expertiseAreas, setExpertiseAreas] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (user) {
      // Debug user object
      console.log("User data:", user);
      
      // Check if expertise areas exist
      if (user.expertiseAreas) {
        console.log("Expertise areas:", user.expertiseAreas);
        setExpertiseAreas(user.expertiseAreas);
      } else {
        console.log("No expertise areas found in user object");
        // Fetch expertise areas separately if needed
        const fetchExpertiseAreas = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/users/${user.id}/expertise`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            setExpertiseAreas(response.data.expertiseAreas || []);
          } catch (error) {
            console.error('Error fetching expertise areas:', error);
          }
        };
        fetchExpertiseAreas();
      }
    }
  }, [user]);

  useEffect(() => {
    // Only proceed if user is fully loaded (not just the loading state completed)
    if (user && user.id && !loading) {
      const fetchStartups = async () => {
        try {
          console.log("Fetching startups for user ID:", user.id);
          
          // First try the entrepreneur-specific endpoint
          const response = await axios.get(`http://localhost:5000/api/entrepreneurs/${user.id}/startups`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          
          console.log("Startups response data:", response.data);
          
          if (Array.isArray(response.data) && response.data.length > 0) {
            // If we get data, use it
            setStartups(response.data);
          } else {
            console.log("No startups found or invalid data format, trying alternative endpoint");
            
            // If no data, try the general startups endpoint with a filter
            const generalResponse = await axios.get(`http://localhost:5000/api/startups?founderId=${user.id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            
            console.log("General startups response:", generalResponse.data);
            
            if (Array.isArray(generalResponse.data)) {
              setStartups(generalResponse.data);
            } else {
              console.error("Both endpoints returned invalid data format");
              setStartups([]);
            }
          }
        } catch (error) {
          console.error('Error fetching startups:', error.response?.data || error.message);
          // Add a fallback to the general endpoint if specific one fails
          try {
            console.log("Trying fallback endpoint");
            const fallbackResponse = await axios.get(`http://localhost:5000/api/startups?founderId=${user.id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            setStartups(fallbackResponse.data || []);
          } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
            setStartups([]);
          }
        }
      };

      fetchStartups();

      const fetchRecommendedMentors = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/match/mentors`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setRecommendedMentors(response.data);
        } catch (error) {
          console.error('Error fetching recommended mentors:', error);
        }
      };
      fetchRecommendedMentors();
    }
  }, [user, loading]);

  const handleCreateStartup = () => {
    setShowForm(true);
  };

  const handleCreateFirstStartup = () => {
    setShowForm(true);
  };

  const handleAddExpertise = () => {
    setShowExpertiseForm(true);
  };

  const handleCloseForm = () => {
    console.log("Closing form");
    setShowForm(false);
  };

  const handleSubmit = async (formData) => {
    try {
      // Fix the unused variable warning by using await without assignment
      await axios.post('http://localhost:5000/api/startups', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Close the form
      setShowForm(false);
      
      // Show success message
      alert('Startup created successfully!');
      
      // Refresh the startups list
      const updatedStartupsResponse = await axios.get(`http://localhost:5000/api/entrepreneurs/${user.id}/startups`);
      setStartups(updatedStartupsResponse.data);
    } catch (error) {
      console.error('Error creating startup:', error);
      alert(error.response?.data || 'Error creating startup');
    }
  };

  const handleUpdateExpertise = async (expertiseAreas) => {
    try {
      const userId = user._id || user.id;
      
      if (!userId) {
        console.error('User ID is undefined');
        alert('Error: User ID not found. Please refresh the page and try again.');
        return;
      }
      
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/expertise`,
        { expertiseAreas: expertiseAreas.join(',') },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Update local state
        setExpertiseAreas(response.data.expertiseAreas || []);
        setShowExpertiseForm(false);
        
        // Use refreshUserData instead of manually updating user context and localStorage
        refreshUserData();
        
        alert('Expertise areas updated successfully!');
      }
    } catch (error) {
      console.error('Error updating expertise:', error);
      alert(error.response?.data?.message || 'Error updating expertise areas');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-500"></div>
    </div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading user data</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Navigation items
  const navItems = [
    { title: "Dashboard", path: "/entrepreneur-dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { title: "My Startups", path: "#startups", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { title: "Find Mentors", path: "#mentors", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { title: "My Profile", path: "/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { title: "Messages", path: "/messages", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <span className="text-lg font-bold">Novanest</span>}
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-700">
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <nav className="mt-6">
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.path}
              className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {sidebarOpen && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
        
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-700">
            <div className="flex items-center">
              <img 
                src={user.profileDetails?.profilePhoto || "/avatar-placeholder.png"} 
                alt="Profile" 
                className="h-10 w-10 rounded-full"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/avatar-placeholder.png";
                }}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-200">{user.name}</p>
                <p className="text-xs text-gray-400">Entrepreneur</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Entrepreneur Dashboard</h1>
          <div className="flex items-center">
            <button 
              onClick={handleCreateStartup}
              className="btn btn-primary btn-small mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="text-[0.7rem]">Post Startup</span>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          {/* Startups Section */}
          <section id="startups" className="mb-10">
            <h2 className="flex items-center text-xl font-semibold mb-4 text-gray-800">
              <span className="inline-block w-1 h-5 bg-gray-800 rounded-full mr-2"></span>
              My Startups
            </h2>
            {startups.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <p className="text-gray-500">You haven't posted any startups yet.</p>
                <button 
                  onClick={handleCreateFirstStartup}
                  className="btn btn-secondary btn-small mx-auto mt-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[0.7rem]">Create Startup</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {startups.map((startup) => (
                  <div key={startup._id} className="bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-all duration-200 border border-gray-100">
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{startup.startupName}</h3>
                      <p className="text-gray-600 mb-3 text-sm line-clamp-2">{startup.tagline || startup.problemStatement || 'No description available'}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">{startup.industry}</span>
                        <Link to={`/startup/${startup._id}`} className="text-gray-800 font-medium hover:underline text-sm flex items-center">
                          View 
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Expertise Areas Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">My Expertise Areas</h2>
              {expertiseAreas.length > 0 && (
                <button 
                  onClick={handleAddExpertise}
                  className="btn btn-secondary btn-small"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span className="text-[0.7rem]">Update</span>
                </button>
              )}
            </div>
            
            {expertiseAreas.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-gray-500">You haven't set any expertise areas yet.</p>
                <button 
                  onClick={handleAddExpertise}
                  className="btn btn-secondary btn-small mx-auto mt-4"
                >
                  <span className="text-[0.7rem]">Add Expertise</span>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {expertiseAreas.map((area, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Recommended Mentors Section */}
          <section id="mentors" className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Recommended Mentors</h2>
            {recommendedMentors.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-gray-500">No mentor recommendations available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {recommendedMentors.map(({ mentor, matchPercentage }) => (
                  mentor && (
                    <div key={mentor._id} className="bg-white shadow-sm hover:shadow-md rounded-lg p-4 transition-all duration-200 border border-gray-100">
                      <div className="flex items-center mb-3">
                        <img 
                          src={mentor.profileDetails?.profilePhoto || "/avatar-placeholder.png"} 
                          alt={mentor.name} 
                          className="h-10 w-10 rounded-full mr-3 object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "/avatar-placeholder.png";
                          }}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{mentor.name || 'N/A'}</h3>
                          <div className="flex items-center">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">{matchPercentage}% Match</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <Link to={`/mentor/${mentor._id}`} className="text-gray-800 font-medium hover:underline text-sm">
                          View Profile
                        </Link>
                        <button className="inline-flex px-2 py-0.5 text-[0.6rem] font-medium bg-white border border-black rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Modals */}
        {showForm && (
          <Modal show={showForm} onClose={handleCloseForm}>
            <StartupForm 
              onSubmit={handleSubmit} 
              onClose={handleCloseForm}
              initialData={{
                startupName: '',
                tagline: '',
                website: '',
                location: '',
                industry: '',
                stage: 'Idea',
                problemStatement: '',
                solution: '',
                businessModel: '',
                targetAudience: '',
                businessModelType: '',
                fundingGoal: '',
                useOfFunds: '',
                equityOffered: '',
                founderBackground: '',
              }}
              isEditing={false}
            />
          </Modal>
        )}

        {showExpertiseForm && (
          <Modal show={showExpertiseForm} onClose={() => setShowExpertiseForm(false)}>
            <ExpertiseForm 
              expertiseAreas={expertiseAreas} // Change from initialExpertiseAreas to expertiseAreas
              onSubmit={handleUpdateExpertise}
              onClose={() => setShowExpertiseForm(false)} // Change from onCancel to onClose
            />
          </Modal>
        )}
      </div>
    </div>
  );
};
export default EntrepreneurDashboard;