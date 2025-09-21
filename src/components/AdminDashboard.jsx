// src/components/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api'; // <-- Import our new API service
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      // Use the correct route '/api/admin/all'
      const response = await api.get('/api/admin/all');
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch student data. Please check your connection or login again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAllocate = async (userId, branch) => {
    if (!branch) {
      alert('This student did not select a second branch choice.');
      return;
    }
    try {
      await api.post('/api/admin/allocate', { userId, allocatedBranch: branch });
      alert(`Successfully allocated ${branch} to the student.`);
      fetchStudents(); // Refresh the list to show the new status
    } catch (err) {
      alert('Error allocating seat. The student may already have an allocation.');
      console.error(err);
    }
  };

  const handleVerifyPayment = async (allotmentId) => {
    try {
      await api.post('/api/admin/verify-payment', { allotmentId });
      alert('Payment verified successfully!');
      fetchStudents(); // Refresh the list
    } catch (err) {
      alert('Error verifying payment.');
      console.error(err);
    }
  };

  if (loading) return <div className="dashboard-container"><h2>Loading students...</h2></div>;
  if (error) return <div className="dashboard-container"><h2 className="error">{error}</h2></div>;

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Email</th>
            <th>12th Total</th>
            <th>Choice 1</th>
            <th>Choice 2</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id}>
              <td>{index + 1}</td>
              <td>{student.user.name}</td>
              <td>{student.user.email}</td>
              <td>{student.intermediate.total}</td>
              <td>{student.branchChoice1}</td>
              <td>{student.branchChoice2}</td>
              <td className={`status-${student.allotment?.status?.replace(/\s+/g, '-').toLowerCase()}`}>
                {student.allotment?.status || 'Not Allocated'}
              </td>
              <td>
                {(!student.allotment || student.allotment.status === 'Pending') && (
                  <div className="action-buttons">
                    <button onClick={() => handleAllocate(student.user._id, student.branchChoice1)}>
                      Allocate Choice 1
                    </button>
                    <button onClick={() => handleAllocate(student.user._id, student.branchChoice2)}>
                      Allocate Choice 2
                    </button>
                  </div>
                )}
                {student.allotment?.status === 'Payment Submitted' && (
                  <button className="verify-btn" onClick={() => handleVerifyPayment(student.allotment._id)}>
                    Verify Payment
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;