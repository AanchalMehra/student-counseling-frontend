/import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './StudentDashboard.css';

// This is the form component
const StudentInfoForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    address: '', phone: '',
    highSchool: { maths: '', science: '', english: '', hindi: '' },
    intermediate: { physics: '', chemistry: '', maths: '' },
    branchChoice1: '', branchChoice2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Pass the form's state and error setter to the parent
    onFormSubmit(formData, setError).finally(() => setLoading(false));
  };
  
  return (
    <div className="form-container">
      <h2>Student Information Form</h2>
      <p>Fill out your details below to be considered for allocation.</p>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Personal Information</legend>
          <input type="text" name="address" placeholder="Full Address" onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
        </fieldset>
        <fieldset>
          <legend>10th Grade Marks</legend>
          <input type="number" name="maths" placeholder="Maths" onChange={(e) => handleNestedChange('highSchool', e)} required />
          <input type="number" name="science" placeholder="Science" onChange={(e) => handleNestedChange('highSchool', e)} required />
          <input type="number" name="english" placeholder="English" onChange={(e) => handleNestedChange('highSchool', e)} required />
          <input type="number" name="hindi" placeholder="Hindi" onChange={(e) => handleNestedChange('highSchool', e)} required />
        </fieldset>
        <fieldset>
          <legend>12th Grade Marks (PCM)</legend>
          <input type="number" name="physics" placeholder="Physics" onChange={(e) => handleNestedChange('intermediate', e)} required />
          <input type="number" name="chemistry" placeholder="Chemistry" onChange={(e) => handleNestedChange('intermediate', e)} required />
          <input type="number" name="maths" placeholder="Maths" onChange={(e) => handleNestedChange('intermediate', e)} required />
        </fieldset>
        <fieldset>
          <legend>Branch Choices</legend>
          <input type="text" name="branchChoice1" placeholder="First Choice Branch" onChange={handleChange} required />
          <input type="text" name="branchChoice2" placeholder="Second Choice Branch" onChange={handleChange} required />
        </fieldset>
        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Information'}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
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

  // ===============================================================
  //               *** THIS IS THE CORRECTED FUNCTION ***
  // ===============================================================
  const handleFormSubmit = async (formData, setFormError) => {
    // 1. Create the correctly structured payload that the backend expects
    const payload = {
      personal: {
        address: formData.address,
        phone: formData.phone,
      },
      highSchool: formData.highSchool,
      intermediate: formData.intermediate,
      branchChoices: {
        branchChoice1: formData.branchChoice1,
        branchChoice2: formData.branchChoice2,
      },
    };

    // 2. Send the new 'payload' object to the API
    try {
      await api.post('/api/students/submit', payload);
      alert('Information submitted successfully!');
      fetchStatus(); // Refresh status after submission
    } catch (err) {
      // Use the error message from the backend, or a default one
      setFormError(err.response?.data?.message || 'Submission failed.');
    }
  };

  const handleAccept = async () => {
    try {
      await api.post('/api/students/accept');
      alert('Seat accepted! Please proceed to payment.');
      fetchStatus(); // Refresh status to show 'Accepted'
    } catch (err) {
      alert('Failed to accept the seat.');
    }
  };

  if (loading) return <h2>Loading your dashboard...</h2>;
  if (error) return <h2 className="error">{error}</h2>;

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

  // Conditional rendering based on the student's status
  if (!status || !status._id) {
    return <StudentInfoForm onFormSubmit={handleFormSubmit} />;
  }

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
          <>
            <p>You have accepted your seat. Please submit your payment details to finalize your admission.</p>
            <Link to="/payment" className="payment-btn">Proceed to Payment</Link>
          </>
        )}
        {status.status === 'Payment Submitted' && (
          <p>Your payment receipt has been submitted and is awaiting verification from the admin.</p>
        )}
        {status.status === 'Payment Verified' && (
          <>
            <p>Your admission is confirmed! You can now download your offer letter.</p>
            <Link to="/offer-letter" className="offer-letter-btn">View Offer Letter</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;