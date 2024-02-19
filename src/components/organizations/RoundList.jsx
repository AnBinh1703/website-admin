import axios from 'axios';
import React, { useEffect, useState } from 'react';

const RoundList = () => {
  const [rounds, setRounds] = useState([]);
  const [newRound, setNewRound] = useState({
    roundName: '',
   });

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const response = await axios.get('http://localhost:3000/rounds');
        setRounds(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRounds();
  }, []);

  const handleCreateRound = async () => {
    try {
      await axios.post('http://localhost:3000/rounds', newRound);
      const response = await axios.get('http://localhost:3000/rounds');
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
      await axios.put(`http://localhost:3000/rounds/${roundId}`, updatedRoundData);
      const response = await axios.get('http://localhost:3000/rounds');
      setRounds(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRound = async (roundId) => {
    try {
      await axios.delete(`http://localhost:3000/rounds/${roundId}`);
      const response = await axios.get('http://localhost:3000/rounds');
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
