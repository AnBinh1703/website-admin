import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from 'react';
import MapList from './MapList';
import MatchList from './MatchList';
import RoundList from './RoundList';
import TournamentList from './TournamentList';
import './css/DashboardOrganization.css';

function DashboardOrganization() {
  const [showMapList, setShowMapList] = useState(false);
  const [showRoundList, setShowRoundList] = useState(false);
  const [showMatchList, setShowMatchList] = useState(false);
  const [showTournamentList, setShowTournamentList] = useState(false);

  const toggleMapList = () => {
    setShowMapList(!showMapList);
    setShowRoundList(false);
    setShowMatchList(false);
    setShowTournamentList(false);
  };

  const toggleRoundList = () => {
    setShowRoundList(!showRoundList);
    setShowMapList(false);
    setShowMatchList(false);
    setShowTournamentList(false);
  };

  const toggleMatchList = () => {
    setShowMatchList(!showMatchList);
    setShowMapList(false);
    setShowRoundList(false);
    setShowTournamentList(false);
  };

  const toggleTournamentList = () => {
    setShowTournamentList(!showTournamentList);
    setShowMapList(false);
    setShowRoundList(false);
    setShowMatchList(false);
  };

  return (
    <div className="dashboard-organization">
      <h1 className="section-header">Organizations Management List</h1>
      <div>
        {/* Maps Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="mapsDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={toggleMapList}
          >
            Maps
          </button>
          <div className={`dropdown-menu${showMapList ? ' show' : ''}`} aria-labelledby="mapsDropdown">
            {showMapList && <MapList />}
          </div>
        </div>

        {/* Rounds Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="roundsDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={toggleRoundList}
          >
            Rounds
          </button>
          <div className={`dropdown-menu${showRoundList ? ' show' : ''}`} aria-labelledby="roundsDropdown">
            {showRoundList && <RoundList />}
          </div>
        </div>

        {/* Matches Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="matchesDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={toggleMatchList}
          >
            Matches
          </button>
          <div className={`dropdown-menu${showMatchList ? ' show' : ''}`} aria-labelledby="matchesDropdown">
            {showMatchList && <MatchList />}
          </div>
        </div>

        {/* Tournaments Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="tournamentsDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={toggleTournamentList}
          >
            Tournaments
          </button>
          <div className={`dropdown-menu${showTournamentList ? ' show' : ''}`} aria-labelledby="tournamentsDropdown">
            {showTournamentList && <TournamentList />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOrganization;
