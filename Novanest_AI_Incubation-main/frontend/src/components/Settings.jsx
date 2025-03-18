import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';

const Settings = () => {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState({
    messages: true,
    profileViews: true,
    startupUpdates: true
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked
    });
  };

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value
    });
  };

  const saveNotificationSettings = async () => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/users/${user.id}/notifications`, 
        notifications,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage({ type: 'success', text: 'Notification settings updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notification settings.' });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/users/${user.id}/password`, 
        { currentPassword: password.current, newPassword: password.new },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPassword({ current: '', new: '', confirm: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data || 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="messages"
                name="messages"
                checked={notifications.messages}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="messages" className="ml-2 block text-sm text-gray-900">
                New message notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="profileViews"
                name="profileViews"
                checked={notifications.profileViews}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="profileViews" className="ml-2 block text-sm text-gray-900">
                Profile view notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="startupUpdates"
                name="startupUpdates"
                checked={notifications.startupUpdates}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="startupUpdates" className="ml-2 block text-sm text-gray-900">
                Startup updates and news
              </label>
            </div>
          </div>
          
          <button
            onClick={saveNotificationSettings}
            disabled={loading}
            className="mt-4 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md"
          >
            {loading ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label htmlFor="current" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="current"
                name="current"
                value={password.current}
                onChange={handlePasswordChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="new" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="new"
                name="new"
                value={password.new}
                onChange={handlePasswordChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                value={password.confirm}
                onChange={handlePasswordChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;