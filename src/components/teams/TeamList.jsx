import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TeamList = () => {
    const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({
    Name: '',
    HighSchool_Id: '',
   });

  useEffect(() => {
    // Fetch teams when the component mounts
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3000/teams');
        setTeams(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeams();
  }, []);  
  const handleCreateTeam = async () => {
    try {
      // Create a new team
      await axios.post('http://localhost:3000/teams', newTeam);
      // Update the list
      const response = await axios.get('http://localhost:3000/teams');
      setTeams(response.data);
      // Clear the newTeam state
      setNewTeam({
        Name: '',
        HighSchool_Id: '',
       });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTeam = async (teamId, updatedTeamData) => {
    try {
      // Send a PUT request to update the team
      await axios.put(`http://localhost:3000/teams/${teamId}`, updatedTeamData);
      // Fetch teams again to update the list
      const response = await axios.get('http://localhost:3000/teams');
      setTeams(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      // Send a DELETE request to remove the team
      await axios.delete(`http://localhost:3000/teams/${teamId}`);
      // Fetch teams again to update the list
      const response = await axios.get('http://localhost:3000/teams');
      setTeams(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      {/* Create Team */}
      <div>
        <h3>Create Team</h3>
        <label>Name:</label>
        <input
          type="text"
          value={newTeam.Name}
          onChange={(e) => setNewTeam({ ...newTeam, Name: e.target.value })}
        />
         <label>High School ID:</label>
        <input
          type="text"
          value={newTeam.HighSchool_Id}
          onChange={(e) => setNewTeam({ ...newTeam, HighSchool_Id: e.target.value })}
        />
        <button onClick={handleCreateTeam}>Create Team</button>
      </div>

      {/* Display Teams */}
      <div>
        <h3>Teams</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>High School ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.Id}>
                <td>{team.Id}</td>
                <td>{team.Name}</td>
                <td>{team.HighSchool_Id}</td>
                <td>
                  <button onClick={() => handleUpdateTeam(team.Id, { Name: 'Updated Team Name' })}>
                    Update
                  </button>
                  <button onClick={() => handleDeleteTeam(team.Id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default TeamList;
