import { faBuilding, faHome, faSignInAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import LoginPage from '../Login/LoginPage.jsx';
import DashboardOrgainization from "../organizations/DashboardOrgainization.jsx";
import DashboardTeam from "../teams/DashboardTeam.jsx";
import "./Dashboard.css";
import DashboardHome from './DashboardHome';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <Link to="/dashboard">
          <FontAwesomeIcon icon={faHome} /> Home
        </Link>
        <Link to="/orgainizations">
          <FontAwesomeIcon icon={faBuilding} />  Orgainization Management
        </Link>
        <Link to="/teams">
          <FontAwesomeIcon icon={faUsers} /> Team Management
        </Link>
  <Link to="/login">
  <FontAwesomeIcon icon={faSignInAlt} /> Login
</Link>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/orgainizations" element={<DashboardOrgainization />} />
          <Route exact path="/teams" element={<DashboardTeam />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
