import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token'); // Clear invalid token
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const refreshUserData = () => {
    fetchUserData();
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};