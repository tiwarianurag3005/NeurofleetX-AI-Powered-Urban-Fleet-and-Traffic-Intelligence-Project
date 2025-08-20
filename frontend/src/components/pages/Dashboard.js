import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const isAuthenticated = localStorage.getItem("authToken");

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>You are not logged in 🚫</h2>
        <p>
          Please <Link to="/login">Login</Link> to access the Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Welcome to your fleet and traffic intelligence system 🚖🚦</p>
    </div>
  );
};

export default Dashboard;
