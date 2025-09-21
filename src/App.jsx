import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PaymentPage from "./components/PaymentPage";
import OfferLetterPage from "./components/OfferLetterPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/student-dashboard"
          element={currentUser ? <StudentDashboard user={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin-dashboard"
          element={currentUser?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/payment"
          element={currentUser ? <PaymentPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/offer-letter"
          element={currentUser ? <OfferLetterPage user={currentUser} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
