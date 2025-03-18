import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

const Requests = ({ mentorshipRequests = [], refreshRequests }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  // Filter mentorship requests based on search query and filter status
  const filteredRequests = mentorshipRequests
    .filter((request) => {
      // Filter by search query
      const nameMatches = request.entrepreneur?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const startupMatches = request.entrepreneur?.startupDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const queryMatches = !searchQuery || nameMatches || startupMatches;
      
      // Filter by status
      if (filterStatus === 'all') return queryMatches;
      return queryMatches && request.status === filterStatus;
    })
    .sort((a, b) => {
      // Sort by created date, most recent first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const handleAccept = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/mentorship/requests/${requestId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      // Update local state or refresh data
      // This would require a prop function from the parent component
      if (refreshRequests) refreshRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept mentorship request. Please try again.');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/mentorship/requests/${requestId}/decline`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      // Update local state or refresh data
      if (refreshRequests) refreshRequests();
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Failed to decline mentorship request. Please try again.');
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mentorship Requests</h2>
        <p className="text-gray-600 mt-1">Review and respond to entrepreneurs seeking your guidance.</p>
      </div>
      
      {/* Filter and search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 min-w-0 items-center">
          <div className="relative rounded-md shadow-sm flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
              placeholder="Search by name or startup"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-800"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {filteredRequests.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <li key={request._id} className="p-5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      className="h-12 w-12 rounded-full object-cover"
                      src={request.entrepreneur?.profilePhoto || "/avatar-placeholder.png"}
                      alt=""
                      onError={(e) => {
                        e.target.src = "/avatar-placeholder.png";
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.entrepreneur?.name || 'Entrepreneur'}</h3>
                      <p className="text-sm text-gray-600 mt-1">{request.entrepreneur?.startupDetails?.name || 'Startup'}</p>
                      
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-gray-800 font-medium">Request Message:</p>
                        <blockquote className="text-sm text-gray-600 border-l-4 border-gray-200 pl-3 italic">
                          {request.message || "I'd like to request mentorship for my startup."}
                        </blockquote>
                        
                        <div className="flex space-x-2 mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {request.entrepreneur?.startupDetails?.industry || 'Tech'}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {request.entrepreneur?.startupDetails?.stage || 'Early Stage'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status === 'pending' ? 'Pending' :
                             request.status === 'accepted' ? 'Accepted' : 'Declined'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end space-y-3">
                    <p className="text-xs text-gray-500">
                      Requested {request.createdAt ? format(new Date(request.createdAt), 'MMM d, yyyy') : 'Recently'}
                    </p>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAccept(request._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleDecline(request._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    
                    <Link 
                      to={`/entrepreneur/${request.entrepreneur?._id}`} 
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No mentorship requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || filterStatus !== 'pending' ? 
                'No requests match your search criteria.' : 
                'You don\'t have any pending mentorship requests at this time.'}
            </p>
            <div className="mt-6">
              <Link 
                to="/profile" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Your Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Requests;