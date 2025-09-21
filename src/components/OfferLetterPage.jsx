import React, { useState } from "react";
import axios from "axios";

export default function PaymentPage({ user, navigateTo }) {
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receipt) {
      setMessage("Please upload a payment receipt");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("receipt", receipt);

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/students/payment`, formData, {
        headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "multipart/form-data" },
      });

      setMessage("Payment submitted successfully!");
      if (navigateTo) navigateTo("/offer-letter");
    } catch (err) {
      setMessage("Error submitting payment");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Payment</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setReceipt(e.target.files[0])} />
        <button type="submit">Submit Payment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
