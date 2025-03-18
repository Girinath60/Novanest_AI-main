import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';

const NotificationCenter = () => {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await axios.get('http://localhost:5000/api/notifications', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          console.log('Fetched notifications:', response.data);
          setNotifications(response.data);
          setError(null);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setError('Failed to load notifications');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
    
    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Update local state
      setNotifications(notifications.map(notif => 
        notif._id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading notifications...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications yet</div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => markAsRead(notification._id)}
            >
              <div className="flex items-start">
                <div className={`w-2 h-2 rounded-full mt-2 mr-2 ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.message || 'No message content'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'No date'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;