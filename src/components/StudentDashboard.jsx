import React, { useState, useEffect } from "react";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
  });

  const [message, setMessage] = useState(""); // For success/error messages
  const [loading, setLoading] = useState(false);

  // Fetch student data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://https://student-counseling-backend.onrender.com/student"); // Replace with your API
        if (!res.ok) throw new Error("Failed to fetch student data");
        const data = await res.json();
        setStudentData(data);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent comma in branch field
    if (name === "branch" && value.includes(",")) return;

    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate inputs
  const validateInputs = () => {
    const { name, email, password, branch } = studentData;
    if (!name || !email || !password || !branch) {
      setMessage("Please fill all fields");
      return false;
    }
    if (!email.includes("@")) {
      setMessage("Enter a valid email");
      return false;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const res = await fetch("https://your-backend-api.com/student/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update");

      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>
      {loading && <p>Loading...</p>}
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={studentData.name}
          placeholder="Name"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          value={studentData.email}
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          value={studentData.password}
          placeholder="Password"
          onChange={handleChange}
        />
        <input
          type="text"
          name="branch"
          value={studentData.branch}
          placeholder="Branch (no commas allowed)"
          onChange={handleChange}
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default StudentDashboard;
