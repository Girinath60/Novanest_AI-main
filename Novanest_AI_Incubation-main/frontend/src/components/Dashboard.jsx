import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Novanest</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            <li className="mb-2">
              <Link to="/profile" className="block p-2 hover:bg-gray-700 rounded">Profile</Link>
            </li>
            <li className="mb-2">
              <Link to="/startup-submissions" className="block p-2 hover:bg-gray-700 rounded">Startup Submissions</Link>
            </li>
            <li className="mb-2">
              <Link to="/investment-opportunities" className="block p-2 hover:bg-gray-700 rounded">Investment Opportunities</Link>
            </li>
            <li className="mb-2">
              <Link to="/mentorships" className="block p-2 hover:bg-gray-700 rounded">Mentorships</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-gray-100 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <button className="mr-4">Notifications</button>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button>Logout</button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;