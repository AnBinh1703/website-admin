import axios from "axios";
import React, { useEffect, useState } from "react";

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({
    Name: "",
    HighSchool_Id: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    HighSchool_Id: "",
  });

  useEffect(() => {
    // Fetch teams when the component mounts
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          "https://fptbottournamentweb.azurewebsites.net/api/team/get-all"
        );
        setTeams(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeams();
  }, []);

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleShowUpdateForm = (id) => {
    setFormData({ ...teams.find((team) => team.Id === id) });
    setShowUpdateForm(true);
    setSelectedTeamId(id);
  };

  const handleShowDeleteForm = (id) => {
    setFormData({ ...teams.find((team) => team.Id === id) });
    setShowDeleteForm(true);
    setSelectedTeamId(id);
  };

  const handleCloseForms = () => {
    setShowCreateForm(false);
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setSelectedTeamId(null);
  };

  const handleInputChange = (e) => {
    // Update form data when input fields change
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTeam = async () => {
    try {
      // Create a new team
      await axios.post(
        "https://fptbottournamentweb.azurewebsites.net/api/Team/create-team",
        newTeam
      );
      // Update the list
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/get-all"
      );
      setTeams(response.data);
      // Clear the newTeam state
      setNewTeam({
        Name: "",
        HighSchool_Id: "",
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTeam = async () => {
    try {
      // Send a PUT request to update the team
      await axios.put(
        `https://fptbottournamentweb.azurewebsites.net/api/Team/update-team/${selectedTeamId}`,
        formData
      );
      // Fetch teams again to update the list
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/get-all"
      );
      setTeams(response.data);
      setShowUpdateForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      // Send a DELETE request to remove the team
      await axios.delete(
        `https://fptbottournamentweb.azurewebsites.net/api/Team/delete-team/${selectedTeamId}`
      );
      // Fetch teams again to update the list
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/get-all"
      );
      setTeams(response.data);
      setShowDeleteForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Buttons for Create, Update, Delete */}
      <div>
        <button className="create-button" onClick={handleShowCreateForm}>
          Create Team
        </button>
        <button
          className="update-button"
          onClick={() => selectedTeamId && handleShowUpdateForm(selectedTeamId)}
          disabled={!selectedTeamId}
        >
          Update Team
        </button>
        <button
          className="delete-button"
          onClick={() => selectedTeamId && handleShowDeleteForm(selectedTeamId)}
          disabled={!selectedTeamId}
        >
          Delete Team
        </button>
      </div>

      {/* Create Team Form */}
      {showCreateForm && (
        <div className="popup-form">
          <h3>Create New Team</h3>
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={newTeam.Name}
            onChange={(e) => setNewTeam({ ...newTeam, Name: e.target.value })}
          />

          <label>High School ID:</label>
          <input
            type="text"
            name="HighSchool_Id"
            value={newTeam.HighSchool_Id}
            onChange={(e) =>
              setNewTeam({ ...newTeam, HighSchool_Id: e.target.value })
            }
          />
          <button onClick={handleCreateTeam}>Create Team</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Update Team Form */}
      {showUpdateForm && (
        <div className="popup-form">
          <h3>Update Team</h3>
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
          />

          <label>High School ID:</label>
          <input
            type="text"
            name="HighSchool_Id"
            value={formData.HighSchool_Id}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdateTeam}>Update Team</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Delete Team Confirmation */}
      {showDeleteForm && (
        <div className="popup-form">
          <h3>Delete Team</h3>
          <p>Are you sure you want to delete this team?</p>
          <button onClick={handleDeleteTeam}>Delete Team</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}

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
                  <button
                    onClick={() =>
                      handleUpdateTeam(team.Id, { Name: "Updated Team Name" })
                    }
                  >
                    Update
                  </button>
                  <button onClick={() => handleDeleteTeam(team.Id)}>
                    Delete
                  </button>
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
