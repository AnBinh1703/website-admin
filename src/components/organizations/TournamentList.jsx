import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({
    TournamentName: '',
    StartDate: '',
    EndDate: '',
  });

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tournaments');
        setTournaments(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTournaments();
  }, []);

  const handleCreateTournament = async () => {
    try {
      await axios.post('http://localhost:3000/tournaments', newTournament);
      const response = await axios.get('http://localhost:3000/tournaments');
      setTournaments(response.data);
      setNewTournament({
        TournamentName: '',
        StartDate: '',
        EndDate: '',
        // Add other properties as needed
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTournament = async (tournamentId, updatedTournamentData) => {
    try {
      await axios.put(`http://localhost:3000/tournaments/${tournamentId}`, updatedTournamentData);
      const response = await axios.get('http://localhost:3000/tournaments');
      setTournaments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    try {
      await axios.delete(`http://localhost:3000/tournaments/${tournamentId}`);
      const response = await axios.get('http://localhost:3000/tournaments');
      setTournaments(response.data);
    } catch (error) {
      console.error(error);
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
