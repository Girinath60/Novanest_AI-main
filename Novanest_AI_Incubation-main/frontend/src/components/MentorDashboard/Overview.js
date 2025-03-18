import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import Button from '../../components/common/Button'; // Add this import
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Overview = ({ 
  metrics, 
  activeMentorships = [], 
  matchedEntrepreneurs = [], 
  setActiveTab, 
  handleJoinMeeting 
}) => {
  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <motion.div 
          className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Mentees</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalMentees || 0}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              12% this month
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Requests</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{metrics.activeRequests || 0}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-amber-500 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Requires attention
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Sessions Completed</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{metrics.mentorshipSessions || 0}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              4 this week
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Impact Score</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{metrics.impactScore || 0}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-purple-500 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              Top 5% of mentors
            </span>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {activeMentorships.slice(0, 3).map((mentorship, idx) => (
                  <li key={mentorship._id || idx} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full"
                          src={mentorship.mentee?.profilePhoto || "/avatar-placeholder.png"}
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {mentorship.mentee?.name || 'Entrepreneur'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Session scheduled for {format(new Date(mentorship.nextSession || Date.now()), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleJoinMeeting(mentorship)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
                {activeMentorships.length === 0 && (
                  <li className="py-4">
                    <p className="text-center text-gray-500">No recent activity</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Goals & Insights */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-8">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Mentor Goals & Insights</h3>
          <Button variant="link" size="sm">Set Goals</Button>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Goal Progress */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quarterly Goals</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Sessions Completed</span>
                    <span className="text-sm font-medium text-gray-700">{metrics.mentorshipSessions || 0}/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(((metrics.mentorshipSessions || 0) / 15) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {15 - (metrics.mentorshipSessions || 0) > 0 
                      ? `${15 - (metrics.mentorshipSessions || 0)} more to reach your quarterly goal` 
                      : 'Goal reached! 🎉'}
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">New Mentees</span>
                    <span className="text-sm font-medium text-gray-700">{metrics.newMenteesThisQuarter || 2}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((((metrics.newMenteesThisQuarter || 2) / 5) * 100), 100)}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {5 - (metrics.newMenteesThisQuarter || 2) > 0 
                      ? `${5 - (metrics.newMenteesThisQuarter || 2)} more to reach your quarterly goal` 
                      : 'Goal reached! 🎉'}
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Satisfaction Score</span>
                    <span className="text-sm font-medium text-gray-700">{metrics.satisfactionScore || 4.7}/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((((metrics.satisfactionScore || 4.7) / 5) * 100), 100)}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Based on {metrics.totalReviews || 12} mentee reviews
                  </p>
                </div>
              </div>
            </div>
            
            {/* Achievements & Insights */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Achievements</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">Consistent Mentor badge earned</span>
                </li>
                <li className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">Top 10% profile views this month</span>
                </li>
                <li className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">5.0 rating on your last 3 sessions</span>
                </li>
              </ul>
              
              <h4 className="text-sm font-medium text-gray-700 mt-4 mb-3">Insight</h4>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Tip:</span> Entrepreneurs you mentor are 3x more likely to schedule follow-up sessions when you share relevant resources after your calls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-5 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Activity</h3>
        <div className="h-64">
          <Line 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  }
                },
                x: {
                  grid: {
                    display: false,
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  label: 'Sessions Completed',
                  data: [4, 6, 8, 7, 10, 12],
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                },
                {
                  label: 'New Mentees',
                  data: [2, 3, 4, 2, 5, 3],
                  borderColor: '#8B5CF6',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  tension: 0.4,
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Add this widget to your Overview */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-8">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Sessions</h3>
          <Button variant="link" size="sm" onClick={() => setActiveTab('office-hours')}>
            View Calendar
          </Button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {activeMentorships.filter(m => m.nextSession).slice(0, 3).map((mentorship, idx) => (
            <div key={idx} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={mentorship.mentee?.profilePhoto || "/avatar-placeholder.png"}
                    alt={mentorship.mentee?.name || "Mentee"}
                    className="h-10 w-10 rounded-full object-cover mr-3 border border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/avatar-placeholder.png";
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{mentorship.mentee?.name || "Entrepreneur"}</p>
                    <p className="text-sm text-gray-500">{new Date(mentorship.nextSession).toLocaleString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric', 
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => handleJoinMeeting(mentorship)}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                    </svg>
                  }
                >
                  Join
                </Button>
              </div>
            </div>
          ))}
          
          {activeMentorships.filter(m => m.nextSession).length === 0 && (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming sessions</h3>
              <p className="mt-1 text-sm text-gray-500">Schedule mentoring sessions or update your availability.</p>
              <div className="mt-6">
                <Button
                  variant="outline"  // Changed from "primary" to "outline" for better visibility
                  size="md"
                  onClick={() => setActiveTab('office-hours')}
                  icon={
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Set Availability
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
              
      {/* Potential Mentee Matches Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Potential Mentee Matches</h2>
          <Button variant="link" size="sm" onClick={() => setActiveTab('mentees')}>View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matchedEntrepreneurs.slice(0, 3).map(({ entrepreneur, matchPercentage }) => (
            entrepreneur && (
              <div key={entrepreneur._id} className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg p-5 border border-gray-100">
                <div className="flex items-start">
                  <img
                    src={entrepreneur.profileDetails?.profilePhoto || "/avatar-placeholder.png"}
                    alt={entrepreneur.name} 
                    className="h-12 w-12 rounded-full mr-4 object-cover"
                    onError={(e) => {
                      e.target.onerror = null; 
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
                <div className="mt-4 flex justify-between">
                  <Link to={`/entrepreneur/${entrepreneur._id}`} className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    View Profile
                  </Link>
                  <Button variant="outline" size="sm">
                    Offer Mentorship
                  </Button>
                </div>
              </div>
            )
          ))}
          {matchedEntrepreneurs.length === 0 && (
            <div className="col-span-full bg-white shadow-sm rounded-lg p-6 text-center">
              <p className="text-gray-500">No potential matches found based on your expertise.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Overview;