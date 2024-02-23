import React, { useEffect, useState } from 'react';

const apiUrl = 'https://fptbottournamentweb.azurewebsites.net/api';

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({
    TournamentName: '',
    StartDate: '',
    EndDate: '',
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch(`${apiUrl}/Tournament/get-all-tournaments`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tournaments: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const handleCreateTournament = async () => {
    try {
      const response = await fetch(`${apiUrl}/Tournament/create-new-tournament`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTournament),
      });

      if (!response.ok) {
        throw new Error(`Failed to create tournament: ${response.status} - ${response.statusText}`);
      }

      await fetchTournaments();
      setNewTournament({
        TournamentName: '',
        StartDate: '',
        EndDate: '',
      });
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  const handleUpdateTournament = async (tournamentId, updatedTournamentData) => {
    try {
      const response = await fetch(`${apiUrl}/Tournament/update-tournament/${tournamentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTournamentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update tournament: ${response.status} - ${response.statusText}`);
      }

      await fetchTournaments();
    } catch (error) {
      console.error('Error updating tournament:', error);
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    try {
      const response = await fetch(`${apiUrl}/Tournament/delete-tournament/${tournamentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete tournament: ${response.status} - ${response.statusText}`);
      }

      await fetchTournaments();
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  return (
    <div>
      {/* Create Tournament */}
      <div>
        <h3>Create Tournament</h3>
        <label>Tournament Name:</label>
        <input
          type="text"
          value={newTournament.TournamentName}
          onChange={(e) => setNewTournament({ ...newTournament, TournamentName: e.target.value })}
        />
        <label>Start Date:</label>
        <input
          type="text"
          value={newTournament.StartDate}
          onChange={(e) => setNewTournament({ ...newTournament, StartDate: e.target.value })}
        />
        <label>End Date:</label>
        <input
          type="text"
          value={newTournament.EndDate}
          onChange={(e) => setNewTournament({ ...newTournament, EndDate: e.target.value })}
        />
        <button onClick={handleCreateTournament}>Create Tournament</button>
      </div>

      {/* Display Tournaments */}
      <div>
        <h3>Tournaments</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tournament Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((tournament) => (
              <tr key={tournament.id}>
                <td>{tournament.id}</td>
                <td>{tournament.TournamentName}</td>
                <td>{tournament.StartDate}</td>
                <td>{tournament.EndDate}</td>
                <td>
                  <button onClick={() => handleUpdateTournament(tournament.id, { TournamentName: 'Updated Tournament Name' })}>
                    Update
                  </button>
                  <button onClick={() => handleDeleteTournament(tournament.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TournamentList;
