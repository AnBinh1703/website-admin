import React, { useEffect, useState } from 'react';

const apiUrl = 'https://fptbottournamentweb.azurewebsites.net/api';

const RoundList = () => {
  const [rounds, setRounds] = useState([]);
  const [newRound, setNewRound] = useState({
    roundName: '',
  });

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    try {
      const response = await fetch(`${apiUrl}/Round/get-all-rounds`);
      if (!response.ok) {
        throw new Error(`Failed to fetch rounds: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setRounds(data);
    } catch (error) {
      console.error('Error fetching rounds:', error);
    }
  };

  const handleCreateRound = async () => {
    try {
      const response = await fetch(`${apiUrl}/Round/create-new-round`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRound),
      });

      if (!response.ok) {
        throw new Error(`Failed to create round: ${response.status} - ${response.statusText}`);
      }

      await fetchRounds();
      setNewRound({
        roundName: '',
      });
    } catch (error) {
      console.error('Error creating round:', error);
    }
  };

  const handleUpdateRound = async (roundId, updatedRoundData) => {
    try {
      const response = await fetch(`${apiUrl}/Round/update-round/${roundId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoundData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update round: ${response.status} - ${response.statusText}`);
      }

      await fetchRounds();
    } catch (error) {
      console.error('Error updating round:', error);
    }
  };

  const handleDeleteRound = async (roundId) => {
    try {
      const response = await fetch(`${apiUrl}/Round/delete-round/${roundId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete round: ${response.status} - ${response.statusText}`);
      }

      await fetchRounds();
    } catch (error) {
      console.error('Error deleting round:', error);
    }
  };

  return (
    <div>
      {/* Create Round */}
      <div>
        <h3>Create Round</h3>
        <label>Round Name:</label>
        <input
          type="text"
          value={newRound.roundName}
          onChange={(e) => setNewRound({ ...newRound, roundName: e.target.value })}
        />
        <button onClick={handleCreateRound}>Create Round</button>
      </div>

      {/* Display Rounds */}
      <div>
        <h3>Rounds</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Round Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round) => (
              <tr key={round.id}>
                <td>{round.id}</td>
                <td>{round.roundName}</td>
                <td>
                  <button onClick={() => handleUpdateRound(round.id, { roundName: 'Updated Round Name' })}>
                    Update
                  </button>
                  <button onClick={() => handleDeleteRound(round.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoundList;
