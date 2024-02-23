import React, { useEffect, useState } from 'react';

const apiUrl = 'https://fptbottournamentweb.azurewebsites.net/api';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({
    MapId: '',
    MatchDate: '',
    RoundID: '',
    TournamentId: '',
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${apiUrl}/Match/get-all-matches`);
      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleCreateMatch = async () => {
    try {
      const response = await fetch(`${apiUrl}/Match/create-new-match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMatch),
      });

      if (!response.ok) {
        throw new Error(`Failed to create match: ${response.status} - ${response.statusText}`);
      }

      await fetchMatches();
      setNewMatch({
        MapId: '',
        MatchDate: '',
        RoundID: '',
        TournamentId: '',
      });
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const handleUpdateMatch = async (matchId, updatedMatchData) => {
    try {
      const response = await fetch(`${apiUrl}/Match/update-match/${matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMatchData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update match: ${response.status} - ${response.statusText}`);
      }

      await fetchMatches();
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      const response = await fetch(`${apiUrl}/Match/delete-match/${matchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete match: ${response.status} - ${response.statusText}`);
      }

      await fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  return (
    <div>
      {/* Create Match */}
      <div>
        <h3>Create Match</h3>
        {/* Input fields for newMatch properties */}
        <button onClick={handleCreateMatch}>Create Match</button>
      </div>

      {/* Display Matches */}
      <div>
        <h3>Matches</h3>
        <table>
          <thead>
            {/* Table headers */}
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>{/* Display match properties */}</td>
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
