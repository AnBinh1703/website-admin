import axios from "axios";
import React, { useEffect, useState } from "react";

const LoadingIndicator = () => <p>Loading...</p>;

const ErrorDisplay = ({ error }) => <p style={{ color: "red" }}>{error}</p>;

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [highSchoolsOptions, setHighSchoolsOption] = useState([]);
  const [selectedHighSchool, setSelectedHighSchool] = useState(false);
  const [selectedHighSchoolId, setSelectedHighSchoolId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [formData, setFormData] = useState({
    keyId: "",
    teamName: "",
    highSchoolId: "",
  });

  useEffect(() => {
    // Fetch teams when the component mounts
    fetchTeams();
  }, []);
  const fetchTeams = async () => {
    try {
      const response = await axios.get(
        "https://fptbottournamentweb.azurewebsites.net/api/team/get-all"
      );
      setTeams(response.data);
    } catch (error) {
      console.error(error);
    }
  };
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
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Log the entire response for inspection
      console.log("Create Team Response:", response);

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      fetchTeams();
      // Clear form data
      setFormData({
        keyId: "",
        teamName: "",
        highSchoolId: "",
      });

      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating team:", error);
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
      const response = await axios.get(
        "https://fptbottournamentweb.azurewebsites.net/api/Team/get-all-teams"
      );
      setTeams(response.data);
      setShowUpdateForm(false);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/highSchool/get-all`
      );
      const data = await response.json();
      setHighSchoolsOption(data);
    } catch (error) {
      console.error(`Error fetching highSchool options:`, error.message);
    }
  };
  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const handleDeleteTeam = async () => {
    try {
      // Send a DELETE request to remove the team
      await axios.delete(
        `https://fptbottournamentweb.azurewebsites.net/api/Team/delete-team/${selectedTeamId}`
      );
      // Fetch teams again to update the list
      const response = await axios.get(
        "https://fptbottournamentweb.azurewebsites.net/api/Team/get-all-teams"
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
          <label>ID:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Name:</label>
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleInputChange}
          />

          <label>High School:</label>
          <select
            name="highSchoolId"
            value={selectedHighSchoolId}
            onChange={handleInputChange}
          >
            <option value="">Select High School</option>
            {highSchoolsOptions.map((highSchool) => (
              <option key={highSchool.id} value={highSchool.id}>
                {highSchool.highSchoolName}
              </option>
            ))}
          </select>
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
              <th>High School Name</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.Id}>
                <td>{team.keyId}</td>
                <td>{team.teamName}</td>
                <td>{team.highSchoolName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamList;
