import { faBuilding, faHome, faSignInAlt, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import LoginPage from '../Login/LoginPage.jsx';
import DashboardUser from '../User/DashboardUser.jsx';
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
          <FontAwesomeIcon icon={faHome} /> <span className="sidebar-text">Home</span>
        </Link>
        <Link to="/orgainizations">
          <FontAwesomeIcon icon={faBuilding} /> <span className="sidebar-text">Orgainization </span>
        </Link>
        <Link to="/teams">
          <FontAwesomeIcon icon={faUsers} /> <span className="sidebar-text">Team </span>
        </Link>
        <Link to="/users">
          <FontAwesomeIcon icon={faUser} /> <span className="sidebar-text">User </span>
        </Link>
        <Link to="/login">
          <FontAwesomeIcon icon={faSignInAlt} /> <span className="sidebar-text">Login </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route
            exact
            path="/orgainizations"
            element={<DashboardOrgainization />}
          />
          <Route exact path="/teams" element={<DashboardTeam />} />
          <Route exact path="/users" element={<DashboardUser />}/>
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
