import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FilterBar from './FilterBar';

const PitchDeck = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStartups = async (filters = {}) => {
    setLoading(true);
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value) queryParams.append(key, value);
      }
      
      const response = await axios.get(`http://localhost:5000/api/startups?${queryParams.toString()}`);
      // Ensure we always set an array, even if response.data is undefined
      setStartups(response.data || []);
    } catch (error) {
      console.error('Error fetching startups:', error);
      // Always reset to empty array on error
      setStartups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const handleFilter = (filters) => {
    fetchStartups(filters);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Pitch Decks</h2>
      
      <FilterBar onFilter={handleFilter} />
      
      {/* Add null check with && operator to prevent "length" property access on undefined */}
      {(!startups || startups.length === 0) ? (
        <div className="text-center text-gray-600 py-10">
          No startups match your filters. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add null check before mapping */}
          {startups && startups.map((startup) => (
            <div key={startup._id} className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{startup.startupName}</h3>
              <p className="text-gray-600 mb-2"><strong>Founder:</strong> {startup.founderId?.name || 'N/A'}</p>
              <p className="text-gray-600 mb-2"><strong>Industry:</strong> {startup.industry}</p>
              <p className="text-gray-600 mb-2"><strong>Stage:</strong> {startup.stage}</p>
              <p className="text-gray-600 mb-2"><strong>Funding Goal:</strong> ${typeof startup.fundingGoal === 'string' ? startup.fundingGoal : startup.fundingGoal?.toLocaleString() || 'N/A'}</p>
              <p className="text-gray-600 mb-3">{startup.description?.substring(0, 100) || startup.problemStatement?.substring(0, 100) || 'No description available'}{(startup.description?.length > 100 || startup.problemStatement?.length > 100) ? '...' : ''}</p>
              <div className="flex flex-col md:flex-row md:justify-between gap-2">
                {startup.pitchDeckURL && (
                  <a 
                    href={startup.pitchDeckURL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline-secondary w-full md:w-auto text-center"
                  >
                    View Pitch Deck
                  </a>
                )}
                
                {/* Add this new button */}
                <Link 
                  to={`/startup/${startup._id}`}
                  className="btn-secondary w-full md:w-auto text-center"
                >
                  View Details
                </Link>
                
                {startup.founderId?._id && (
                  <Link 
                    to={`/messages?to=${startup.founderId._id}`} 
                    className="btn-primary w-full md:w-auto text-center"
                  >
                    Message Entrepreneur
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PitchDeck;