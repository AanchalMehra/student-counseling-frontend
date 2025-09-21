import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OfferLetterPage({ user }) {
  const [allocatedBranch, setAllocatedBranch] = useState('');

  useEffect(() => {
    axios.get(`http://https://student-counseling-backend.onrender.com/api/students/${user._id}/offer`)
      .then(res => setAllocatedBranch(res.data.branch))
      .catch(err => console.log('Error fetching offer letter'));
  }, [user]);

  return (
    <div className="form-container">
      <h1>Offer Letter</h1>
      <p>Congratulations {user?.name || 'Student'}!</p>
      <p>You have been allocated to your branch: <strong>{allocatedBranch}</strong></p>
      <p>Please keep this offer letter for your records.</p>
    </div>
  );
}
