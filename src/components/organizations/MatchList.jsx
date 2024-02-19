import axios from 'axios';
import React, { useEffect, useState } from 'react';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({
    MapId: '',
    MatchDate: '',
    RoundID: '',
    TournamentId: '',
     
  });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:3000/matches');
        setMatches(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMatches();
  }, []);

  const handleCreateMatch = async () => {
    try {
      await axios.post('http://localhost:3000/matches', newMatch);
      const response = await axios.get('http://localhost:3000/matches');
      setMatches(response.data);
      setNewMatch({
        MapId: '',
        MatchDate: '',
        RoundID: '',
        TournamentId: '',
        
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateMatch = async (matchId, updatedMatchData) => {
    try {
      await axios.put(`http://localhost:3000/matches/${matchId}`, updatedMatchData);
      const response = await axios.get('http://localhost:3000/matches');
      setMatches(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      await axios.delete(`http://localhost:3000/matches/${matchId}`);
      const response = await axios.get('http://localhost:3000/matches');
      setMatches(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Create Match */}
      <div>
        <h3>Create Match</h3>
        <label>Map ID:</label>
        <input
          type="text"
          value={newMatch.MapId}
          onChange={(e) => setNewMatch({ ...newMatch, MapId: e.target.value })}
        />
        <label>Match Date:</label>
        <input
          type="text"
          value={newMatch.MatchDate}
          onChange={(e) => setNewMatch({ ...newMatch, MatchDate: e.target.value })}
        />
        <label>Round ID:</label>
        <input
          type="text"
          value={newMatch.RoundID}
          onChange={(e) => setNewMatch({ ...newMatch, RoundID: e.target.value })}
        />
        <label>Tournament ID:</label>
        <input
          type="text"
          value={newMatch.TournamentId}
          onChange={(e) => setNewMatch({ ...newMatch, TournamentId: e.target.value })}
        />
         <button onClick={handleCreateMatch}>Create Match</button>
      </div>

      {/* Display Matches */}
      <div>
        <h3>Matches</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Map ID</th>
              <th>Match Date</th>
              <th>Round ID</th>
              <th>Tournament ID</th>
               <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>{match.id}</td>
                <td>{match.MapId}</td>
                <td>{match.MatchDate}</td>
                <td>{match.RoundID}</td>
                <td>{match.TournamentId}</td>
                {/* Render other properties */}
                <td>
                  <button onClick={() => handleUpdateMatch(match.id, { MapId: 'Updated Map ID' })}>
                    Update
                  </button>
                  <button onClick={() => handleDeleteMatch(match.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchList;
