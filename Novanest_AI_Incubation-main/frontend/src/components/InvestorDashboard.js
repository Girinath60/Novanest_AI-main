import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterBar from './FilterBar';
import { Link } from 'react-router-dom';

const InvestorDashboard = () => {
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
      
      const response = await axios.get(`http://localhost:5000/api/startups?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStartups(response.data);
    } catch (error) {
      console.error('Error fetching startups:', error);
    }
    setLoading(false);
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
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Investor Dashboard</h2>
      
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <h3 className="text-xl font-semibold mb-2">Find Your Next Investment</h3>
        <p className="text-gray-600">Browse through startups and filter by industry, stage, and funding goals.</p>
      </div>
      
      <FilterBar onFilter={handleFilter} />
      
      <Link 
        to="/pitchdeck"
        className="w-full md:w-auto bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition duration-200 shadow-md mb-6"
      >
        Browse All Startups
      </Link>

      <Link 
        to="/startups/search" 
        className="btn-primary"
      >
        Search Startups
      </Link>

      {startups.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          No startups match your filters. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <div key={startup._id} className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{startup.startupName}</h3>
              <p className="text-gray-600 mb-2"><strong>Founder:</strong> {startup.founderId?.name}</p>
              <p className="text-gray-600 mb-2"><strong>Industry:</strong> {startup.industry}</p>
              <p className="text-gray-600 mb-2"><strong>Stage:</strong> {startup.stage}</p>
              <p className="text-gray-600 mb-2"><strong>Funding Goal:</strong> ${startup.fundingGoal}</p>
              <Link to={`/startups/${startup._id}`} className="text-blue-500 hover:underline">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestorDashboard;