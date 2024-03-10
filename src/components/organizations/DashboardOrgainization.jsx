import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useEffect, useState } from 'react';
import MapList from './MapList';
import MatchList from './MatchList';
import RoundList from './RoundList';
import TournamentList from './TournamentList';
import './css/DashboardOrganization.css';

function DashboardOrganization() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [tournamentOptions, setTournamentOptions] = useState([]);
  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
  };
  useEffect(()=> {
    fetchDropdownTournamentOptions();
  },[]);
  const fetchDropdownTournamentOptions = async() => {
    try{
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/tournament/get-all`
      );
      const data = await response.json();
      setTournamentOptions(data);
    }
    catch(error){
      console.error(`Error fetching tournament options:`, error.message);
    }
  };
  const handleDropdownChange = (selectedOption) => {
    setSelectedTournamentId(selectedOption.id);
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
      
      <select name = "tournamentId" value = {selectedTournamentId} onChange={(e) => handleDropdownChange(tournamentOptions.find((m) => m.id === e.target.value))}>
        <option value="">Select Tournament</option>
        {tournamentOptions.map((tournament) => (
          <option key={tournament.id} value={tournament.id}>
            {tournament.tournamentName}
          </option>
        ))}
      </select>

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