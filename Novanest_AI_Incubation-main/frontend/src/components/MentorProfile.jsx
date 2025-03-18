import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MentorProfile = () => {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMentor(response.data);
      } catch (error) {
        console.error('Error fetching mentor details:', error);
      }
      setLoading(false);
    };

    fetchMentor();
  }, [id]);

  const handleRequestMentorship = () => {
    // Navigate to messages with this mentor's ID
    navigate(`/messages?to=${id}`);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!mentor) {
    return <div className="p-4">Error loading mentor details</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back button */}
      <button onClick={handleGoBack} className="mb-4 btn-ghost flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </button>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-start">
          <img 
            src={mentor.profileDetails.profilePhoto || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="w-24 h-24 rounded-full mr-6"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{mentor.name}</h2>
            <p className="text-gray-600 mb-1"><strong>Role:</strong> {mentor.role.charAt(0).toUpperCase() + mentor.role.slice(1)}</p>
            <p className="text-gray-600 mb-4"><strong>Email:</strong> {mentor.email}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Bio</h3>
          <p className="text-gray-700">{mentor.profileDetails.bio || 'No bio available'}</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Expertise Areas</h3>
          <div className="flex flex-wrap gap-2">
            {mentor.mentorshipAreas && mentor.mentorshipAreas.length > 0 ? (
              mentor.mentorshipAreas.map((area, index) => (
                <span key={index} className="badge-primary">
                  {area}
                </span>
              ))
            ) : (
              <p className="text-gray-700">No expertise areas specified</p>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleRequestMentorship} 
          className="mt-6 btn-primary"
        >
          Request Mentorship
        </button>
      </div>
    </div>
  );
};

export default MentorProfile;