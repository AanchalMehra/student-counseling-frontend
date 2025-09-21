// src/components/PaymentPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // <-- Import our new API service
import './PaymentPage.css';

const PaymentPage = () => {
  const [transactionId, setTransactionId] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId || !receiptUrl) {
      setError('Please provide both a transaction ID and a receipt URL.');
      return;
    }
    setError('');

    try {
      await api.post('/api/students/payment', {
        transactionId,
        receiptUrl,
      });
      alert('Payment details submitted successfully! You will be notified once the admin verifies it.');
      navigate('/student-dashboard'); // Go back to the dashboard to see the updated status
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit payment details.');
    }
  };

  return (
    <div className="payment-container">
      <form onSubmit={handleSubmit} className="payment-form">
        <h2>Submit Payment Details</h2>
        <p>
          After paying the fees, please enter the transaction ID and a link to your payment receipt (e.g., a Google Drive or Imgur link).
        </p>
        <input
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="URL to your payment receipt"
          value={receiptUrl}
          onChange={(e) => setReceiptUrl(e.target.value)}
          required
        />
        <button type="submit">Submit Payment</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentPage;