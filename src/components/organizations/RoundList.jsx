import axios from 'axios';
import React, { useEffect, useState } from 'react';

const apiUrl = 'https://fptbottournamentweb.azurewebsites.net/api';

const RoundList = () => {
  const [rounds, setRounds] = useState([]);
  const [newRound, setNewRound] = useState({
    roundName: '',
  });

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const response = await axios.get(`${apiUrl}/Round/get-all-rounds`);
        setRounds(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRounds();
  }, []);

  const handleCreateRound = async () => {
    try {
      await axios.post(`${apiUrl}/Round/create-new-round`, newRound);
      const response = await axios.get(`${apiUrl}/Round/get-all-rounds`);
      setRounds(response.data);
      setNewRound({
        roundName: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateRound = async (roundId, updatedRoundData) => {
    try {
      await axios.put(`${apiUrl}/Round/update-round/${roundId}`, updatedRoundData);
      const response = await axios.get(`${apiUrl}/Round/get-all-rounds`);
      setRounds(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRound = async (roundId) => {
    try {
      await axios.delete(`${apiUrl}/Round/delete-round/${roundId}`);
      const response = await axios.get(`${apiUrl}/Round/get-all-rounds`);
      setRounds(response.data);
    } catch (error) {
      console.error(error);
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
