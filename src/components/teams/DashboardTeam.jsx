import React, { useState } from "react";
import HighSchoolList from "./HighSchoolList";
import PlayerList from "./PlayerList";
import TeamInMatchList from "./TeamInMatchList";
import TeamList from "./TeamList";

function DashboardTeam() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="dasshboard-user">
      <h2>User Management</h2>

      {/* Header */}
      <header className="header">
        <div className="logo">Your Logo Here</div>
        <div className="welcome-user">Welcome, User!</div>
      </header>

      {/* Subtopnav */}
      <nav className="subtopnav">
        <button
          className="btn btn-secondary subtopnav-item"
          onClick={() => handleComponentSelect("team-in-match")}
        >
          Team in Match
        </button>
        <button
          className="btn btn-secondary subtopnav-item"
          onClick={() => handleComponentSelect("teams")}
        >
          Team
        </button>
        <button
          className="btn btn-secondary subtopnav-item"
          onClick={() => handleComponentSelect("player")}
        >
          Player
        </button>
        <button
          className="btn btn-secondary subtopnav-item"
          onClick={() => handleComponentSelect("high-school")}
        >
          HighSchool
        </button>
      </nav>

      {/* Display screen */}
      <div className="display-screen">
        {selectedComponent === "team-in-match" && <TeamInMatchList />}
        {selectedComponent === "teams" && <TeamList />}
        {selectedComponent === "player" && <PlayerList />}
        {selectedComponent === "high-school" && <HighSchoolList />}
      </div>
    </div>
  );
}

export default DashboardTeam;
