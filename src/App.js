import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import DashboardOrgainization from "./components/organizations/DashboardOrgainization.jsx";
import DashboardTeam from "./components/teams/DashboardTeam.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route
            exact
            path="/dashboard/orgainizations"
            element={<DashboardOrgainization />}
          />
          <Route exact path="/dashboard/teams" element={<DashboardTeam />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
