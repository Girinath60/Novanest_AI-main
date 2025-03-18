import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import Modal from './Modal';
import ProfileEditForm from './ProfileEditForm';

const Profile = () => {
  const { user: contextUser, setUser } = useContext(UserContext);
  const [user, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (contextUser) {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/${contextUser.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setLocalUser(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [contextUser]);

  const handleProfileUpdate = (updatedUser) => {
    setLocalUser(updatedUser);
    // Also update the user in context
    if (setUser) {
      setUser(updatedUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4">Error loading user profile</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header/Banner Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-40 relative">
          <button 
            onClick={() => setShowEditForm(true)}
            className="absolute top-4 right-4 bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Edit Profile
          </button>
        </div>
        
        {/* Profile Overview */}
        <div className="px-6 pt-0 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
              {user.profileDetails?.profilePhoto ? (
                <img 
                  src={user.profileDetails.profilePhoto} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">{user.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="md:ml-6 mt-4 md:mt-0">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>
          
          {/* User Bio */}
          {user.profileDetails?.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-700">{user.profileDetails.bio}</p>
            </div>
          )}
          
          {/* Contact & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="font-medium w-24">Email:</span>
                  <span className="text-gray-700">{user.email}</span>
                </li>
                {user.profileDetails?.phone && (
                  <li className="flex items-center">
                    <span className="font-medium w-24">Phone:</span>
                    <span className="text-gray-700">{user.profileDetails.phone}</span>
                  </li>
                )}
                {user.profileDetails?.address && (
                  <li className="flex items-center">
                    <span className="font-medium w-24">Address:</span>
                    <span className="text-gray-700">{user.profileDetails.address}</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Professional Details</h3>
              {user.profileDetails?.experience && (
                <div className="mb-3">
                  <h4 className="font-medium">Experience</h4>
                  <p className="text-gray-700">{user.profileDetails.experience}</p>
                </div>
              )}
              
              {user.expertiseAreas?.length > 0 && (
                <div>
                  <h4 className="font-medium">Expertise</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.expertiseAreas.map((area, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Role-Specific Information */}
          {user.role === 'investor' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Investor Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.profileDetails?.investmentFocus && (
                  <div>
                    <h4 className="font-medium">Investment Focus</h4>
                    <p className="text-gray-700">{user.profileDetails.investmentFocus}</p>
                  </div>
                )}
                
                {user.profileDetails?.investmentRange && (
                  <div>
                    <h4 className="font-medium">Investment Range</h4>
                    <p className="text-gray-700">{user.profileDetails.investmentRange}</p>
                  </div>
                )}
                
                {user.profileDetails?.previousInvestments && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium">Previous Investments</h4>
                    <p className="text-gray-700">{user.profileDetails.previousInvestments}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {user.role === 'mentor' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Mentor Details</h3>
              {user.mentorshipAreas?.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium">Mentorship Areas</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.mentorshipAreas.map((area, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {user.profileDetails?.yearsOfExperience && (
                <div>
                  <h4 className="font-medium">Years of Experience</h4>
                  <p className="text-gray-700">{user.profileDetails.yearsOfExperience} years</p>
                </div>
              )}
            </div>
          )}
          
          {user.role === 'entrepreneur' && user.startups?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Startups</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.startups.map(startup => (
                  <div key={startup._id} className="border rounded-lg p-3 hover:shadow-md transition">
                    <h4 className="font-bold">{startup.startupName}</h4>
                    <p className="text-sm text-gray-600">Industry: {startup.industry}</p>
                    <p className="text-sm text-gray-600">Stage: {startup.stage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* External Links */}
          <div className="flex gap-4">
            {user.profileDetails?.linkedin && (
              <a 
                href={user.profileDetails.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {user.profileDetails?.website && (
              <a 
                href={user.profileDetails.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Website
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Logout Button */}
      <div className="mt-6 text-center">
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      
      {/* Edit Profile Modal */}
      <Modal show={showEditForm} onClose={() => setShowEditForm(false)}>
        <ProfileEditForm 
          user={user} 
          onClose={() => setShowEditForm(false)} 
          onUpdate={handleProfileUpdate}
        />
      </Modal>
    </div>
  );
};

export default Profile;