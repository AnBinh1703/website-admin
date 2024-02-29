import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from 'react';
import MapList from './MapList';
import MatchList from './MatchList';
import RoundList from './RoundList';
import TournamentList from './TournamentList';
import './css/DashboardOrganization.css';

function DashboardOrganization() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="dashboard-organization">
      {/* Header */}
      <header className="header">
        <div className="logo">Your Logo Here</div>
        <div className="welcome-user">Welcome, User!</div>
      </header>

      {/* Subtopnav */}
      <nav className="subtopnav">
        <button
          className="btn btn-secondary subtopnav-item"
          onClick={() => handleComponentSelect('map')}
        >
          Map
        </button>
        <button
          className="btn btn-secondary subtopnav-item"
          onClick={() => handleComponentSelect('round')}
        >
          Round
        </button>
        <button
          className="btn btn-secondary subtopnav-item"
          onClick={() => handleComponentSelect('match')}
        >
          Match
        </button>
        <button
          className="btn btn-secondary subtopnav-item"
          onClick={() => handleComponentSelect('tournament')}
        >
          Tournament
        </button>
      </nav>

      {/* Display screen */}
      <div className="display-screen">
        {selectedComponent === 'map' && <MapList />}
        {selectedComponent === 'round' && <RoundList />}
        {selectedComponent === 'match' && <MatchList />}
        {selectedComponent === 'tournament' && <TournamentList />}
      </div>

      
    </div>
  );
}

export default DashboardOrganization;