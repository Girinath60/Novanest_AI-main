import React, { useState } from 'react';

const FilterBar = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    industry: '',
    stage: '',
    fundingGoal: '',
    search: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters({
      industry: '',
      stage: '',
      fundingGoal: '',
      search: '',
    });
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-3">Filter Startups</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="search"
              placeholder="Search startups..."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input
              type="text"
              name="industry"
              placeholder="Tech, Healthcare, etc."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.industry}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
            <select
              name="stage"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.stage}
              onChange={handleChange}
            >
              <option value="">All Stages</option>
              <option value="Idea">Idea</option>
              <option value="MVP">MVP</option>
              <option value="Scaling">Scaling</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Funding Goal</label>
            <input
              type="number"
              name="fundingGoal"
              placeholder="Amount in USD"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.fundingGoal}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button 
            type="button" 
            onClick={handleClear}
            className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear
          </button>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterBar;