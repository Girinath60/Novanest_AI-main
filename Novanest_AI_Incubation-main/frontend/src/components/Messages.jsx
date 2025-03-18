import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingRecipient, setLoadingRecipient] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [error, setError] = useState(null);

  // Get the recipient ID from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const recipientId = queryParams.get('to');
  
  // Define profile link based on recipient's role
  let profileLink;
  if (recipient) {
    if (recipient.role === 'entrepreneur') {
      profileLink = `/entrepreneur/${recipient._id}`;
    } else if (recipient.role === 'mentor') {
      profileLink = `/mentor/${recipient._id}`;
    } else if (recipient.role === 'investor') {
      profileLink = `/investor/${recipient._id}`;
    }
  }

  // Fetch conversations when no recipient is specified
  useEffect(() => {
    if (!recipientId && user) {
      setLoadingConversations(true);
      axios.get('http://localhost:5000/api/conversations/details', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(response => {
          setConversations(response.data);
          setLoadingConversations(false);
          setError(null);
        })
        .catch(err => {
          console.error('Error fetching conversations:', err);
          setError('Failed to load conversations');
          setLoadingConversations(false);
        });
    }
  }, [recipientId, user]);

  // Existing useEffect for recipient and messages
  useEffect(() => {
    // Fetch recipient data
    const fetchRecipient = async () => {
      if (recipientId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/${recipientId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setRecipient(response.data);
          setError(null);
        } catch (error) {
          console.error('Error fetching recipient:', error);
          setError('Failed to load user details');
        } finally {
          setLoadingRecipient(false);
        }
      } else {
        setLoadingRecipient(false);
      }
    };

    // Fetch messages between current user and recipient
    const fetchMessages = async () => {
      if (recipientId && user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/messages/${recipientId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setMessages(response.data);
          
          // Mark messages as read and update unread count
          await axios.put(`http://localhost:5000/api/messages/read/${recipientId}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          
          // Add this: Fetch updated unread count immediately
          try {
            const countResponse = await axios.get('http://localhost:5000/api/messages/unread/count', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // If you have a global state manager or context for the unread count, update it here
            if (window.updateUnreadMessageCount) {
              window.updateUnreadMessageCount(countResponse.data.unreadCount);
            }
          } catch (countError) {
            console.error('Error refreshing unread count:', countError);
          }
          
          setError(null);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setError('Failed to load messages');
        }
      }
    };

    fetchRecipient();
    if (recipientId) fetchMessages();
  }, [recipientId, user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && recipientId && user) {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/messages',
          {
            recipient: recipientId,
            content: newMessage
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        
        // Add the new message to the messages state
        setMessages([...messages, response.data]);
        // Clear the input field
        setNewMessage('');
        setError(null);
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message');
      }
    }
  };

  const selectConversation = (userId) => {
    navigate(`/messages?to=${userId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If no recipient ID was provided, show conversation list
  if (!recipientId) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Messages</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Recent Conversations</h3>
          </div>
          
          {loadingConversations ? (
            <div className="p-6 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-t-2 border-b-2 border-primary rounded-full"></div>
              <p className="mt-2 text-gray-500">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-1">
                You can start a conversation from a user's profile page
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.otherPartyId}
                  onClick={() => selectConversation(conversation.otherPartyId)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 mr-3 flex items-center justify-center overflow-hidden">
                      {conversation.user.profileDetails?.profilePhoto ? (
                        <img 
                          src={conversation.user.profileDetails.profilePhoto} 
                          alt={conversation.user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold">{conversation.user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-gray-900">{conversation.user.name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(conversation.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread && (
                        <span className="inline-block bg-primary rounded-full w-2 h-2 mt-1"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Rest of the component remains the same for when a recipient is selected
  // ...existing code for recipient view...

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Messages</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {recipient ? (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                {recipient.profileDetails?.profilePhoto ? (
                  <img 
                    src={recipient.profileDetails.profilePhoto} 
                    alt={recipient.name} 
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  recipient.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{recipient.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{recipient.role}</p>
              </div>
            </div>
            
            {profileLink && (
              <Link 
                to={profileLink}
                className="text-primary hover:underline"
              >
                View Profile
              </Link>
            )}
          </div>
        ) : (
          <p className="text-gray-700">Loading user details...</p>
        )}
      </div>
      
      {/* Messages Container */}
      <div className="bg-white rounded-lg shadow-lg mb-4">
        {loadingRecipient ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-96 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 py-4">No messages yet. Start a conversation!</p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 max-w-3/4 ${
                    message.sender === user.id 
                      ? 'ml-auto bg-primary rounded-lg p-3 text-white' 
                      : 'bg-gray-200 rounded-lg p-3 text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="form-input flex-grow"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button 
          onClick={handleSendMessage}
          className="btn-primary"
          disabled={!newMessage.trim() || loadingRecipient}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;