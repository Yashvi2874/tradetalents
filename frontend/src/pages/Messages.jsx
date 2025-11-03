import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/sessionService';
import { messageAPI } from '../services/messageService';
import Chat from '../components/Chat';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if we have tutor context from BrowseSkills
  useEffect(() => {
    const tutorContext = location.state;
    if (tutorContext && tutorContext.tutorId) {
      // Prevent users from chatting with themselves
      if (tutorContext.tutorId === user._id) {
        alert('You cannot chat with yourself!');
        return;
      }
      
      // Create a consistent conversation ID (sorted by user IDs)
      const userIds = [user._id, tutorContext.tutorId].sort();
      const conversationId = `conv-${userIds[0]}-${userIds[1]}`;
      
      // Create a temporary conversation for chatting with the tutor using consistent ID format
      const tempConversation = {
        id: conversationId,
        sessionId: null,
        sessionTitle: `Chat with ${tutorContext.tutorName}`,
        instructor: {
          id: tutorContext.tutorId,
          name: tutorContext.tutorName,
          avatar: null
        },
        lastMessage: 'Start a conversation with this tutor',
        timestamp: new Date(),
        unread: 0,
        type: 'tutor',
        skillContext: {
          skillId: tutorContext.skillId,
          skillName: tutorContext.skillName
        }
      };
      
      // Set this as the selected conversation
      setSelectedConversation(tempConversation);
      
      // Add this to conversations list if not already there
      setConversations(prev => {
        const exists = prev.find(conv => conv.id === tempConversation.id);
        if (!exists) {
          return [tempConversation, ...prev];
        }
        return prev;
      });
    }
  }, [location.state, user._id, user.name]);

  // Fetch real conversations from backend
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user's messages to build conversation list
        const messageResponse = await messageAPI.getUserMessages();
        const messages = messageResponse.data;
        
        // Get unique conversation partners
        const conversationPartners = new Map();
        
        messages.forEach(message => {
          // Determine the other user in the conversation
          let otherUserId, otherUserName;
          
          if (message.sender._id === user._id) {
            // Current user is sender, so recipient is the other user
            if (message.recipient) {
              otherUserId = message.recipient._id;
              otherUserName = message.recipient.name;
            }
          } else {
            // Current user is recipient, so sender is the other user
            otherUserId = message.sender._id;
            otherUserName = message.sender.name;
          }
          
          // Skip if no other user or if it's the current user (prevent chatting with yourself)
          if (!otherUserId || otherUserId === user._id) {
            return;
          }
          
          // Create/update conversation with this user using consistent ID format
          const userIds = [user._id, otherUserId].sort();
          const conversationId = `conv-${userIds[0]}-${userIds[1]}`;
          
          if (!conversationPartners.has(conversationId)) {
            conversationPartners.set(conversationId, {
              id: conversationId,
              sessionId: null,
              sessionTitle: `Chat with ${otherUserName}`,
              instructor: {
                id: otherUserId,
                name: otherUserName,
                avatar: null
              },
              lastMessage: message.content,
              timestamp: message.createdAt,
              unread: 0,
              type: 'tutor'
            });
          } else {
            // Update with latest message if this one is newer
            const existing = conversationPartners.get(conversationId);
            if (new Date(message.createdAt) > new Date(existing.timestamp)) {
              existing.lastMessage = message.content;
              existing.timestamp = message.createdAt;
            }
          }
        });
        
        // Convert map to array and sort by timestamp
        const allConversations = Array.from(conversationPartners.values())
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setConversations(allConversations);
        
        // If no conversation is selected and we have conversations, select the first one
        if (!selectedConversation && allConversations.length > 0 && !location.state) {
          setSelectedConversation(allConversations[0]);
        }
        
        // If we have tutor context but no conversations yet, keep the temp conversation
        if (location.state && !selectedConversation) {
          // The tutor context useEffect will handle this
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [location.state, user, selectedConversation]);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return new Date(timestamp).toLocaleDateString([], { weekday: 'short' });
    } else {
      return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Format session time for display
  const formatSessionTime = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const startDate = start.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
    
    const startTimeStr = start.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const endTimeStr = end.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return `${startDate}, ${startTimeStr} - ${endTimeStr}`;
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleDeleteConversation = (conversationId, e) => {
    e.stopPropagation(); // Prevent the conversation from being selected
    
    // Filter out the conversation to delete
    setConversations(prevConversations => 
      prevConversations.filter(conv => conv.id !== conversationId)
    );
    
    // If the deleted conversation was selected, select another one or null
    if (selectedConversation && selectedConversation.id === conversationId) {
      const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
      setSelectedConversation(remainingConversations.length > 0 ? remainingConversations[0] : null);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'upcoming': return 'status-upcoming';
      case 'ongoing': return 'status-ongoing';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="messages-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messages-page">
        <div className="error-container">
          <h3>Error Loading Messages</h3>
          <p>{error}</p>
          <button className="btn primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="conversations-panel">
          <div className="conversations-header">
            <h2>Messages</h2>
          </div>
          
          <div className="conversations-list">
            {conversations.map(conversation => (
              <div 
                key={conversation.id} 
                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="conversation-avatar">
                  {conversation.instructor.avatar ? (
                    <img src={conversation.instructor.avatar} alt={conversation.instructor.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {conversation.instructor.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="conversation-info">
                  <div className="conversation-top">
                    <h3 className="conversation-title">{conversation.sessionTitle}</h3>
                    <span className="conversation-time">{formatTime(conversation.timestamp)}</span>
                  </div>
                  
                  <div className="conversation-bottom">
                    <p className="conversation-instructor">with {conversation.instructor.name}</p>
                    <p className="conversation-preview">{conversation.lastMessage}</p>
                  </div>
                </div>
                
                <button 
                  className="delete-conversation-btn"
                  onClick={(e) => handleDeleteConversation(conversation.id, e)}
                  aria-label="Delete conversation"
                >
                  🗑️
                </button>
                
                {conversation.unread > 0 && (
                  <div className="unread-badge">{conversation.unread}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="chat-panel">
          {selectedConversation ? (
            <Chat
              sessionId={selectedConversation.sessionId}
              sessionTitle={selectedConversation.sessionTitle}
              isOpen={true}
              onClose={() => {}}
              tutorId={selectedConversation.instructor.id}
              tutorName={selectedConversation.instructor.name}
              skillContext={selectedConversation.skillContext}
              user={user}
            />
          ) : (
            <div className="no-conversation-selected">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;