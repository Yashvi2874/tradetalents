import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Chat from '../components/Chat';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Mock conversations data
  const mockConversations = [
    {
      id: 1,
      sessionId: 'JS101',
      sessionTitle: 'JavaScript Fundamentals',
      instructor: {
        id: 'tutor1',
        name: 'Alex Johnson',
        avatar: null
      },
      lastMessage: 'See you in the session!',
      timestamp: new Date(Date.now() - 3600000),
      unread: 0,
      type: 'session',
      startTime: new Date(Date.now() + 86400000), // Tomorrow
      endTime: new Date(Date.now() + 86400000 + 3600000), // 1 hour session
      status: 'upcoming'
    },
    {
      id: 2,
      sessionId: 'PY201',
      sessionTitle: 'Python for Data Science',
      instructor: {
        id: 'tutor2',
        name: 'Sarah Miller',
        avatar: null
      },
      lastMessage: 'The dataset is ready for download',
      timestamp: new Date(Date.now() - 86400000),
      unread: 3,
      type: 'session',
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      endTime: new Date(Date.now() + 3600000), // Ends in 1 hour
      status: 'ongoing'
    },
    {
      id: 3,
      sessionId: 'UI301',
      sessionTitle: 'UI/UX Design Principles',
      instructor: {
        id: 'tutor3',
        name: 'Emma Wilson',
        avatar: null
      },
      lastMessage: 'Here are the design resources',
      timestamp: new Date(Date.now() - 172800000),
      unread: 0,
      type: 'session',
      startTime: new Date(Date.now() - 86400000), // Yesterday
      endTime: new Date(Date.now() - 82800000), // Ended yesterday
      status: 'completed'
    }
  ];

  useEffect(() => {
    // Simulate loading conversations
    setConversations(mockConversations);
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0]);
    }
  }, []);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return timestamp.toLocaleDateString([], { weekday: 'short' });
    } else {
      return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Format session time for display
  const formatSessionTime = (startTime, endTime) => {
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

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-header">
          <h1>Messages</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome back, {user?.name || 'User'}!</span>
            <div className="credits-badge">
              <span>{user?.credits || 0} Credits</span>
            </div>
          </div>
        </div>

        <div className="messages-content">
          <div className="conversations-panel">
            <div className="conversations-header">
              <h2>Conversations</h2>
              {/* Removed Create Session button */}
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
                    
                    <div className="session-details">
                      <span className={`session-status ${getStatusClass(conversation.status)}`}>
                        {getStatusText(conversation.status)}
                      </span>
                      <span className="session-time">
                        {formatSessionTime(conversation.startTime, conversation.endTime)}
                      </span>
                    </div>
                  </div>
                  
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
              />
            ) : (
              <div className="no-conversation-selected">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;