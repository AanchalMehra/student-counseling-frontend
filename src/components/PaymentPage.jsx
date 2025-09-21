import React, { useState } from 'react';
import axios from 'axios';

export default function PaymentPage({ navigateTo }) {
  const [receipt, setReceipt] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('receipt', receipt);

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/students/payment`, formData)
      .then(res => {
        alert('Payment submitted!');
        navigateTo('offerLetter');
      })
      .catch(err => alert('Error submitting payment'));
  }

  return (
    <div className="form-container">
      <h1>Payment</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" onChange={e=>setReceipt(e.target.files[0])} className="input-field"/>
        <button type="submit" className="submit-button">Submit Payment</button>
      </form>
    </div>
  );
}
