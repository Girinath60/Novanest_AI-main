import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import StartupProfile from './components/StartupProfile';
import EntrepreneurDashboard from './components/EntrepreneurDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import MentorDashboard from './components/MentorDashboard';
import MentorProfile from './components/MentorProfile';
import EntrepreneurProfile from './components/EntrepreneurProfile';
import PitchDeck from './components/PitchDeck';
import Messages from './components/Messages';
import NavBar from './components/NavBar';
import StartupSearch from './components/StartupSearch';
import NotificationCenter from './components/NotificationCenter';
import Settings from './components/Settings';
import HomePage from './components/homepage';
import { UserProvider } from './UserContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

const MainLayout = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
);

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Set HomePage as the root route */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/startup/:id" element={<MainLayout><StartupProfile /></MainLayout>} />
          <Route path="/entrepreneur-dashboard" element={<MainLayout><EntrepreneurDashboard /></MainLayout>} />
          <Route path="/investor-dashboard" element={<MainLayout><InvestorDashboard /></MainLayout>} />
          <Route path="/mentor-dashboard" element={<MainLayout><MentorDashboard /></MainLayout>} />
          <Route path="/mentor/:id" element={<MainLayout><MentorProfile /></MainLayout>} />
          <Route path="/entrepreneur/:id" element={<MainLayout><EntrepreneurProfile /></MainLayout>} />
          <Route path="/pitchdeck" element={<MainLayout><PitchDeck /></MainLayout>} />
          <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
          <Route path="/startups/search" element={
            <ProtectedRoute>
              <StartupSearch />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationCenter />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Change fallback route to home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;