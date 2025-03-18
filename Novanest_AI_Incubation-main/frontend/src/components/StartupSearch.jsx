import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StartupSearch = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    industry: '',
    stage: '',
    fundingGoal: '',
    location: ''
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/startups', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStartups(response.data);
      } catch (error) {
        console.error('Error fetching startups:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStartups();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = search === '' || 
      startup.startupName.toLowerCase().includes(search.toLowerCase()) ||
      startup.tagline?.toLowerCase().includes(search.toLowerCase()) ||
      startup.problemStatement?.toLowerCase().includes(search.toLowerCase());
      
    const matchesIndustry = filters.industry === '' || startup.industry === filters.industry;
    const matchesStage = filters.stage === '' || startup.stage === filters.stage;
    const matchesLocation = filters.location === '' || 
      startup.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    let matchesFunding = true;
    if (filters.fundingGoal) {
      const fundingValue = parseInt(startup.fundingGoal.replace(/[^0-9]/g, ''));
      switch(filters.fundingGoal) {
        case 'under50k':
          matchesFunding = fundingValue < 50000;
          break;
        case '50kto250k':
          matchesFunding = fundingValue >= 50000 && fundingValue <= 250000;
          break;
        case '250kto1m':
          matchesFunding = fundingValue > 250000 && fundingValue <= 1000000;
          break;
        case 'over1m':
          matchesFunding = fundingValue > 1000000;
          break;
        default:
          matchesFunding = true;
      }
    }
    
    return matchesSearch && matchesIndustry && matchesStage && matchesFunding && matchesLocation;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Find Startups</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, tagline, or problem statement..."
            className="w-full p-3 border border-gray-300 rounded-md"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <select
              name="industry"
              value={filters.industry}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Industries</option>
              <option value="Tech">Tech</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Ecommerce">E-commerce</option>
              <option value="Food">Food & Beverage</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
            <select
              name="stage"
              value={filters.stage}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Stages</option>
              <option value="Idea">Idea</option>
              <option value="MVP">MVP</option>
              <option value="Scaling">Scaling</option>
              <option value="Revenue">Revenue-Generating</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal</label>
            <select
              name="fundingGoal"
              value={filters.fundingGoal}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Any Amount</option>
              <option value="under50k">Under $50K</option>
              <option value="50kto250k">$50K - $250K</option>
              <option value="250kto1m">$250K - $1M</option>
              <option value="over1m">Over $1M</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              placeholder="City, Country"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center p-10">Loading startups...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.length > 0 ? (
            filteredStartups.map(startup => (
              <div key={startup._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">{startup.startupName}</h2>
                      {startup.tagline && <p className="text-gray-600 italic">{startup.tagline}</p>}
                    </div>
                    {startup.logoUrl && (
                      <img 
                        src={startup.logoUrl} 
                        alt={startup.startupName} 
                        className="w-16 h-16 object-contain"
                      />
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {startup.industry}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {startup.stage}
                      </span>
                      {startup.location && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {startup.location}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 line-clamp-3">
                      {startup.problemStatement}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <Link 
                      to={`/startup/${startup._id}`}
                      className="text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center p-10 bg-white rounded-lg shadow">
              <p className="text-xl text-gray-500">No startups found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StartupSearch;