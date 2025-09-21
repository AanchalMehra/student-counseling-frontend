// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import PaymentPage from './components/PaymentPage';
import OfferLetterPage from './components/OfferLetterPage';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/offer-letter" element={<OfferLetterPage />} />
        </Route>
        
        {/* Admin-Only Protected Route */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;