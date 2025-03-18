import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EntrepreneurProfile = () => {
  const { id } = useParams();
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startups, setStartups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntrepreneur = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEntrepreneur(response.data);
        
        // Also fetch any startups associated with this entrepreneur
        try {
          const startupsResponse = await axios.get(`http://localhost:5000/api/entrepreneurs/${id}/startups`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setStartups(startupsResponse.data);
        } catch (err) {
          console.error('Error fetching startups:', err);
        }
      } catch (error) {
        console.error('Error fetching entrepreneur details:', error);
      }
      setLoading(false);
    };

    fetchEntrepreneur();
  }, [id]);

  const handleRequestMentor = () => {
    // Navigate to messages with this entrepreneur's ID
    navigate(`/messages?to=${id}`);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!entrepreneur) {
    return <div className="p-4">Error loading entrepreneur details</div>;
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
            src={entrepreneur.profileDetails.profilePhoto || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="w-24 h-24 rounded-full mr-6"
          />
          <div>
            {/* Add text-gray-900 for dark text */}
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{entrepreneur.name}</h2>
            <p className="text-gray-700 mb-1">
              <strong className="text-gray-900">Role:</strong> 
              {entrepreneur.role.charAt(0).toUpperCase() + entrepreneur.role.slice(1)}
            </p>
            <p className="text-gray-700 mb-4">
              <strong className="text-gray-900">Email:</strong> 
              {entrepreneur.email}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Bio</h3>
          <p className="text-gray-700">{entrepreneur.profileDetails.bio || 'No bio available'}</p>
        </div>
        
        {startups.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Startups</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {startups.map(startup => (
                <div key={startup._id} className="border rounded-md p-3 bg-gray-50">
                  <h4 className="font-bold text-gray-900">{startup.startupName}</h4>
                  <p className="text-sm text-gray-700">Industry: {startup.industry}</p>
                  <p className="text-sm text-gray-700">Stage: {startup.stage}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={handleRequestMentor} 
        className="mt-6 btn-primary"
      >
        Message Entrepreneur
      </button>
    </div>
  );
};

export default EntrepreneurProfile;