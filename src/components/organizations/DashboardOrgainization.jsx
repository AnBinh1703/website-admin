import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MapList from './MapList';
import MatchList from './MatchList';
import RoundList from './RoundList';
import TournamentList from './TournamentList';

const DashboardOrganization = ({ match }) => {
  return (
    <div>
      <h2>Organizations Management List</h2>
      <div>
        <h1>Organization Dashboard</h1>

        {/* Map List */}
        <div>
          <h2>Maps</h2>
          <MapList />
        </div>

        {/* Round List */}
        <div>
          <h2>Rounds</h2>
          <RoundList />
        </div>

        {/* Match List */}
        <div>
          <h2>Matches</h2>
          <MatchList />
        </div>

        {/* Tournament List */}
        <div>
          <h2>Tournaments</h2>
          <TournamentList />
        </div>
      </div>

      {/* Nested Routes for DashboardOrganization */}
      <Routes>
        <Route path={`${match.url}/maps`} element={<MapList />} />
        <Route path={`${match.url}/rounds`} element={<RoundList />} />
        <Route path={`${match.url}/matches`} element={<MatchList />} />
        <Route path={`${match.url}/tournaments`} element={<TournamentList />} />
      </Routes>
    </div>
  );
};

export default DashboardOrganization;
