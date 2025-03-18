import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import Modal from './Modal';
import StartupForm from './StartupForm';

const StartupProfile = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewsCount, setViewsCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [pitchDeckViews, setPitchDeckViews] = useState(0);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  // Check if current user is the founder
  const isFounder = user && startup?.founderId?._id === user.id;

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/startups/${id}`);
        setStartup(response.data);
        
        // Record a view if not the founder
        if (user && user.id !== response.data.founderId._id) {
          await axios.post(`http://localhost:5000/api/startups/${id}/view`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
        }
        
        // Get analytics data
        if (user && response.data.founderId._id === user.id) {
          const analyticsRes = await axios.get(`http://localhost:5000/api/startups/${id}/analytics`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setViewsCount(analyticsRes.data.viewsCount);
          setMessageCount(analyticsRes.data.messageCount);
          setPitchDeckViews(analyticsRes.data.pitchDeckViews);
        }
      } catch (error) {
        console.error('Error fetching startup details:', error);
      }
      setLoading(false);
    };

    fetchStartup();
  }, [id, user]);

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };
  
  const handlePitchDeckView = async () => {
    // Track pitch deck views
    if (user && startup && user.id !== startup.founderId._id) {
      try {
        await axios.post(`http://localhost:5000/api/startups/${id}/pitchdeck-view`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (error) {
        console.error('Error recording pitch deck view:', error);
      }
    }
    
    // Open pitch deck in new tab
    window.open(startup.pitchDeckURL, '_blank');
  };
  
  const handleEditSubmit = async (formData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/startups/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setStartup(response.data);
      setShowEditForm(false);
      alert('Startup details updated successfully');
    } catch (error) {
      console.error('Error updating startup:', error);
      alert(`Error updating startup: ${error.response?.data || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!startup) {
    return <div className="p-4">Error loading startup details</div>;
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
      
      <div className="bg-white shadow-md rounded-lg p-6 relative">
        {/* Edit button for entrepreneurs */}
        {isFounder && (
          <button 
            onClick={() => setShowEditForm(true)}
            className="absolute top-4 right-4 btn-secondary"
          >
            Edit Startup
          </button>
        )}
        
        {/* Founder Analytics Section */}
        {isFounder && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-2">Startup Analytics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-md shadow text-center">
                <p className="text-3xl font-bold text-blue-600">{viewsCount}</p>
                <p className="text-sm text-gray-600">Profile Views</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow text-center">
                <p className="text-3xl font-bold text-blue-600">{messageCount}</p>
                <p className="text-sm text-gray-600">Message Inquiries</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow text-center">
                <p className="text-3xl font-bold text-blue-600">{pitchDeckViews}</p>
                <p className="text-sm text-gray-600">Pitch Deck Views</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{startup.startupName}</h2>
            {startup.tagline && <p className="text-xl text-gray-600 italic">{startup.tagline}</p>}
          </div>
          
          {startup.logoUrl && (
            <img 
              src={startup.logoUrl}
              alt={`${startup.startupName} logo`}
              className="w-20 h-20 object-contain mt-4 md:mt-0"
            />
          )}
        </div>
        
        {/* Overview Section - Basic Info */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-900">Startup Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-700"><strong>Industry:</strong> {startup.industry}</p>
            </div>
            <div>
              <p className="text-gray-700"><strong>Stage:</strong> {startup.stage}</p>
            </div>
            <div>
              <p className="text-gray-700"><strong>Location:</strong> {startup.location}</p>
            </div>
            {startup.website && (
              <div>
                <p className="text-gray-700">
                  <strong>Website:</strong> <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{startup.website}</a>
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-700"><strong>Business Model:</strong> {startup.businessModelType}</p>
            </div>
          </div>
        </div>
        
        {/* Problem & Solution Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-900">Problem & Solution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-2 text-gray-900">Problem Statement</h4>
              <p className="text-gray-700">{startup.problemStatement}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2 text-gray-900">Our Solution</h4>
              <p className="text-gray-700">{startup.solution}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-lg font-medium mb-2 text-gray-900">Target Audience</h4>
            <p className="text-gray-700">{startup.targetAudience}</p>
          </div>
        </div>
        
        {/* Business Model & Traction */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-900">Business Model & Traction</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-2 text-gray-900">Business Description</h4>
              <p className="text-gray-700">{startup.businessModel}</p>
            </div>
            
            {startup.currentCustomers && (
              <div>
                <h4 className="text-lg font-medium mb-2 text-gray-900">Current Customers/Users</h4>
                <p className="text-gray-700">{startup.currentCustomers}</p>
              </div>
            )}
          </div>
          
          {startup.competitors && (
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2 text-gray-900">Competitor Analysis</h4>
              <p className="text-gray-700">{startup.competitors}</p>
            </div>
          )}
        </div>
        
        {/* Financial Details */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-900">Financial Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {startup.fundingGoal && (
              <div>
                <p className="text-gray-700"><strong>Funding Goal:</strong> ${startup.fundingGoal}</p>
              </div>
            )}
            
            {startup.equityOffered && (
              <div>
                <p className="text-gray-700"><strong>Equity Offered:</strong> {startup.equityOffered}%</p>
              </div>
            )}
            
            {startup.previousFunding && (
              <div>
                <p className="text-gray-700"><strong>Previous Funding:</strong> {startup.previousFunding}</p>
              </div>
            )}
            
            {startup.revenueModel && (
              <div>
                <p className="text-gray-700"><strong>Revenue Model:</strong> {startup.revenueModel}</p>
              </div>
            )}
            
            {startup.currentRevenue && (
              <div>
                <p className="text-gray-700"><strong>Current Revenue:</strong> ${startup.currentRevenue}</p>
              </div>
            )}
            
            {startup.burnRate && (
              <div>
                <p className="text-gray-700"><strong>Monthly Burn Rate:</strong> ${startup.burnRate}</p>
              </div>
            )}
          </div>
          
          {startup.useOfFunds && (
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2 text-gray-900">Use of Funds</h4>
              <p className="text-gray-700">{startup.useOfFunds}</p>
            </div>
          )}
          
          {startup.projectedGrowth && (
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2 text-gray-900">Projected Growth</h4>
              <p className="text-gray-700">{startup.projectedGrowth}</p>
            </div>
          )}
        </div>
        
        {/* Team Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-900">The Team</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-2 text-gray-900">Founder Background</h4>
              <p className="text-gray-700">{startup.founderBackground}</p>
            </div>
            
            {startup.teamMembers && (
              <div>
                <h4 className="text-lg font-medium mb-2 text-gray-900">Team Members</h4>
                <p className="text-gray-700">{startup.teamMembers}</p>
              </div>
            )}
          </div>
          
          {startup.mentorsAdvisors && (
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2 text-gray-900">Mentors & Advisors</h4>
              <p className="text-gray-700">{startup.mentorsAdvisors}</p>
            </div>
          )}
          
          {/* Founder Information Card */}
          {startup.founderId && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-lg font-medium mb-3 text-gray-900">Founder Information</h4>
              <div className="flex items-center mb-3">
                <img 
                  src={startup.founderId.profileDetails?.profilePhoto || 'https://via.placeholder.com/50'} 
                  alt="Founder" 
                  className="w-16 h-16 rounded-full mr-3 object-cover" 
                />
                <div>
                  <p className="font-semibold text-lg text-gray-900">{startup.founderId.name}</p>
                  <p className="text-gray-600">{startup.founderId.email}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-3">
                <Link 
                  to={`/entrepreneur/${startup.founderId._id}`}
                  className="btn-outline-primary text-center"
                >
                  View Founder Profile
                </Link>
                
                <Link 
                  to={`/messages?to=${startup.founderId._id}`} 
                  className="btn-primary text-center"
                >
                  Message Founder
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Market Research */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-900">Market Research</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {startup.marketSize && (
              <div>
                <h4 className="text-lg font-medium mb-2 text-gray-900">Market Size (TAM)</h4>
                <p className="text-gray-700">{startup.marketSize}</p>
              </div>
            )}
            
            {startup.customerValidation && (
              <div>
                <h4 className="text-lg font-medium mb-2 text-gray-900">Customer Validation</h4>
                <p className="text-gray-700">{startup.customerValidation}</p>
              </div>
            )}
          </div>
          
          {startup.goToMarketStrategy && (
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2 text-gray-900">Go-To-Market Strategy</h4>
              <p className="text-gray-700">{startup.goToMarketStrategy}</p>
            </div>
          )}
        </div>
        
        {/* Pitch Materials */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-900">Pitch Materials</h3>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handlePitchDeckView}
              className="btn-outline-secondary flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>
              </svg>
              View Pitch Deck
            </button>
            
            {startup.demoVideoURL && (
              <a 
                href={startup.demoVideoURL}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-outline-secondary flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                </svg>
                Watch Demo Video
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Form Modal */}
      <Modal show={showEditForm} onClose={() => setShowEditForm(false)}>
        <StartupForm 
          onSubmit={handleEditSubmit} 
          onClose={() => setShowEditForm(false)} 
          initialData={startup}
          isEditing={true}
        />
      </Modal>
    </div>
  );
};

export default StartupProfile;