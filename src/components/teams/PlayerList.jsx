import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PlayerList = () => {
    const [players, setPlayers] = useState([]);
    useEffect(() => {
        // Fetch teams when the component mounts
        const fetchPlayers = async () => {
          try {
            const response = await axios.get('https://fptbottournamentweb.azurewebsites.net/api/player/get-all');
            setPlayers(response.data);
          } catch (error) {
            console.error(error);
          }
        };
        fetchPlayers();
      }, []); 
      return (
        <div>
          {/* Display Teams */}
          <div>
            <h3>Players</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Team Id</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.Id}>
                    <td>{player.keyId}</td>
                    <td>{player.name}</td>
                    <td>{new Date(player.dob).toLocaleString()}</td>
                    <td>{player.teamId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );   
};
export default PlayerList;    
    