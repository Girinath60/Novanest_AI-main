import React, { useState } from 'react'; // Removed unused useEffect import
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

const Mentees = ({ 
  activeMentorships = [], 
  matchedEntrepreneurs = [], 
  handleJoinMeeting,
  onMentorshipOfferSent // new prop
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filter and sort mentees based on search query and filters
  const filteredMentorships = activeMentorships
    .filter((mentorship) => {
      // Filter by search query
      const menteeNameMatches = mentorship.mentee?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const startupNameMatches = mentorship.startup?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const queryMatches = menteeNameMatches || startupNameMatches;
      
      // Filter by status
      if (filterStatus === 'all') return queryMatches;
      if (filterStatus === 'scheduled' && mentorship.nextSession) return queryMatches;
      if (filterStatus === 'unscheduled' && !mentorship.nextSession) return queryMatches;
      return false;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === 'name') {
        return (a.mentee?.name || '').localeCompare(b.mentee?.name || '');
      }
      if (sortBy === 'recent') {
        const dateA = a.nextSession ? new Date(a.nextSession) : new Date(0);
        const dateB = b.nextSession ? new Date(b.nextSession) : new Date(0);
        return dateB - dateA;
      }
      if (sortBy === 'startup') {
        return (a.startup?.name || '').localeCompare(b.startup?.name || '');
      }
      return 0;
    });

  const handleMessage = async (menteeId) => {
    // Navigate to messaging interface or open message modal
    console.log(`Opening message interface for mentee ${menteeId}`);
    // Implementation would depend on your messaging system
  };

  const handleSchedule = async (mentorship) => {
    // Open scheduling interface or redirect to calendar
    console.log(`Scheduling session with ${mentorship.mentee?.name}`);
    // This could open a modal or redirect to the office hours page
  };

  const handleOfferMentorship = async (entrepreneurId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/mentorship/offer`,
        { entrepreneurId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      // Use response data for a better user experience
      const menteeDetails = response.data.mentee || {};
      
      // Show enhanced success notification with mentee name
      alert(`Mentorship offer sent successfully to ${menteeDetails.name || 'entrepreneur'}!`);
      
      // Mark this entrepreneur as "offered" in UI
      // This would require updating the matchedEntrepreneurs state
      if (typeof onMentorshipOfferSent === 'function') {
        onMentorshipOfferSent(entrepreneurId, response.data);
      }
    } catch (error) {
      console.error('Error offering mentorship:', error);
      alert('Failed to send mentorship offer. Please try again.');
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Mentees</h2>
        <p className="text-gray-600 mt-1">Manage your active mentorships and schedule sessions.</p>
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
              placeholder="Search by mentee or startup name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
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
              <option value="all">All Mentees</option>
              <option value="scheduled">Scheduled</option>
              <option value="unscheduled">Unscheduled</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 sr-only">
              Sort by
            </label>
            <select
              id="sort-by"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-800"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="recent">Sort by Recent</option>
              <option value="startup">Sort by Startup</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mentees Table */}
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        {filteredMentorships.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Startup
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Session
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMentorships.map((mentorship) => (
                  <tr key={mentorship._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={mentorship.mentee?.profilePhoto || "/avatar-placeholder.png"}
                            alt=""
                            onError={(e) => {
                              e.target.src = "/avatar-placeholder.png";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {mentorship.mentee?.name || 'Entrepreneur'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {mentorship.mentee?.email || 'No email available'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mentorship.startup?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {mentorship.startup?.industry || 'Tech'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mentorship.startup?.stage || 'Early'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mentorship.nextSession ? format(new Date(mentorship.nextSession), 'MMM d, yyyy') : 'Not scheduled'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                          onClick={() => handleMessage(mentorship.mentee?._id)}
                        >
                          Message
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-900 font-medium"
                          onClick={() => handleSchedule(mentorship)}
                        >
                          Schedule
                        </button>
                        {mentorship.nextSession && (
                          <button 
                            onClick={() => handleJoinMeeting(mentorship)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Join Meeting
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No mentees found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 
                'No mentees match your search criteria.' : 
                'You don\'t have any active mentees yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Recommended Mentees Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Recommended Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matchedEntrepreneurs && matchedEntrepreneurs.map(({ entrepreneur, matchPercentage }) => (
            entrepreneur && (
              <div key={entrepreneur._id} className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg p-5 border border-gray-100">
                <div className="flex items-start">
                  <img
                    src={entrepreneur.profileDetails?.profilePhoto || "/avatar-placeholder.png"}
                    alt={entrepreneur.name} 
                    className="h-12 w-12 rounded-full mr-4 object-cover"
                    onError={(e) => {
                      e.target.src = "/avatar-placeholder.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{entrepreneur.name || 'N/A'}</h3>
                    <div className="flex items-center mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${matchPercentage || 0}%` }}></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">{matchPercentage?.toFixed(0) || 0}% Match</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{entrepreneur.profileDetails?.bio || 'No bio available'}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {entrepreneur.startupDetails?.industry || 'Tech'}
                  </span>
                  {entrepreneur.startupDetails?.stage && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {entrepreneur.startupDetails.stage}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  <Link to={`/entrepreneur/${entrepreneur._id}`} className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    View Profile
                  </Link>
                  <button 
                    onClick={() => handleOfferMentorship(entrepreneur._id)}
                    className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Offer Mentorship
                  </button>
                </div>
              </div>
            )
          ))}
          {(!matchedEntrepreneurs || matchedEntrepreneurs.length === 0) && (
            <div className="col-span-full bg-white shadow-sm rounded-lg p-6 text-center">
              <p className="text-gray-500">No potential mentees found based on your expertise.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Mentees;