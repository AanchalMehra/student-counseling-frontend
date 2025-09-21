// src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './StudentDashboard.css';

// Form component remains the same
const StudentInfoForm = ({ onFormSubmit }) => {
  // ... (no changes to this component, keep it as is)
};

// This is the main dashboard component
const StudentDashboard = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/students/status');
      setStatus(response.data);
    } catch (err) {
      setError('Could not fetch your status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFormSubmit = async (formData, setFormError) => {
    const payload = {
      personal: { address: formData.address, phone: formData.phone },
      highSchool: formData.highSchool,
      intermediate: formData.intermediate,
      branchChoices: { branchChoice1: formData.branchChoice1, branchChoice2: formData.branchChoice2 },
    };
    try {
      await api.post('/api/students/submit', payload);
      alert('Information submitted successfully!');
      fetchStatus();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Submission failed.');
    }
  };

  const handleAccept = async () => {
    try {
      await api.post('/api/students/accept');
      alert('Seat accepted! Please proceed to payment.');
      fetchStatus();
    } catch (err) {
      alert('Failed to accept the seat.');
    }
  };

  if (loading) return <h2>Loading your dashboard...</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  // ===============================================================
  //               *** THIS IS THE CORRECTED LOGIC ***
  // ===============================================================

  // 1. Check if the user needs to submit the form
  if (status?.message === 'Form not yet submitted') {
    return <StudentInfoForm onFormSubmit={handleFormSubmit} />;
  }

  // 2. Check if they have submitted and are waiting for allocation
  if (status?.message === 'Seat has not been allocated yet.') {
    return (
        <div className="status-container">
            <h2>Your Application Status</h2>
            <div className="status-card">
                <p>Your information has been received. Seat allocation is in progress. Please check back later.</p>
            </div>
        </div>
    );
  }

  // 3. If they have an allotment, show its status
  if (status && status._id) {
    return (
      <div className="status-container">
        <h2>Your Application Status</h2>
        <div className="status-card">
          <h3>Current Status: <span>{status.status}</span></h3>
          {status.status === 'Allocated' && (
            <>
              <p>Congratulations! You have been allocated the following branch:</p>
              <p className="branch-name">{status.allocatedBranch}</p>
              <button className="accept-btn" onClick={handleAccept}>Accept Seat</button>
            </>
          )}
          {status.status === 'Accepted' && (
            <><p>You have accepted your seat...</p><Link to="/payment" className="payment-btn">Proceed to Payment</Link></>
          )}
          {status.status === 'Payment Submitted' && (
            <p>Your payment receipt is awaiting verification.</p>
          )}
          {status.status === 'Payment Verified' && (
            <><p>Your admission is confirmed!</p><Link to="/offer-letter" className="offer-letter-btn">View Offer Letter</Link></>
          )}
        </div>
      </div>
    );
  }

  // Fallback for any other state
  return <div>Welcome to your dashboard.</div>;
};
export default StudentDashboard;
// You need to include the StudentInfoForm component definition here as well
// Paste the full StudentInfoForm component code from the previous response here.