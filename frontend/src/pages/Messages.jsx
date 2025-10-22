import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { sessionAPI } from '../services/sessionService';
import Chat from '../components/Chat';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if we have tutor context from BrowseSkills
  useEffect(() => {
    const tutorContext = location.state;
    if (tutorContext && tutorContext.tutorId) {
      // Create a temporary conversation for chatting with the tutor
      const tempConversation = {
        id: `temp-${tutorContext.tutorId}`,
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
    }
  }, [location.state]);

  // Fetch real conversations from backend
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await sessionAPI.getAllSessions();
        
        // Transform session data to conversation format
        const conversationData = response.data.map(session => ({
          id: session._id,
          sessionId: session._id,
          sessionTitle: session.title,
          instructor: {
            id: session.tutor?._id || 'unknown',
            name: session.tutor?.name || 'Unknown Tutor',
            avatar: null
          },
          lastMessage: 'Session details updated',
          timestamp: new Date(session.updatedAt || session.createdAt || Date.now()),
          unread: 0,
          type: 'session',
          startTime: session.startTime,
          endTime: session.endTime,
          status: session.status
        }));
        
        setConversations(conversationData);
        
        // If no conversation is selected and we have conversations, select the first one
        if (!selectedConversation && conversationData.length > 0) {
          setSelectedConversation(conversationData[0]);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

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
              tutorId={selectedConversation.instructor.id}
              tutorName={selectedConversation.instructor.name}
              skillContext={selectedConversation.skillContext}
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