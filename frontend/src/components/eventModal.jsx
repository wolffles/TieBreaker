import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/eventModal.css';

const EventModal = ({ isOpen, onClose, event }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleJoinEvent = async () => {
    setIsLoading(true);
    try {
      // API call to join event would go here
      console.log('Joining event:', event.id);
      // After successful join, navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error joining event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <div className="event-details">
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Players:</strong> {event.currentPlayers}/{event.maxPlayers}</p>
        </div>
        <button 
          className="join-button" 
          onClick={handleJoinEvent}
          disabled={isLoading}
        >
          {isLoading ? 'Joining...' : 'Join Event'}
        </button>
      </div>
    </div>
  );
};

export default EventModal; 