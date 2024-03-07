import React, { useEffect, useState } from "react";

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [highSchoolsOptions, setHighSchoolsOption] = useState([]);
  const [selectedHighSchoolId,setSelectedHighSchoolId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [formData, setFormData] = useState({
    keyId: "",
    teamName: "",
    highSchoolId: "",
  });

  const getAllTeams = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/get-all"
      );
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error("Error fetching teams: ",error.message);
    }
  };
  const handleFetchTeamById = async (id) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team/get-by-id/${id}`
      );
      const data = await response.json();
      const updateTeams = teams.map((team) => ({
        ...team,
        hightlighted: team.id === id,
      }));
      setTeams(updateTeams);
      setSelectedTeamId(id);
      setFormData(data);
      console.log(updateTeams);
    } catch (error) {
      console.error("Error fetching team by ID:", error.message);
    }
  };
  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleShowUpdateForm = (id) => {
    const selectedTeam = teams.find((team) => team.id === id);
    setFormData({
      ...selectedTeam
    })
    setShowUpdateForm(true);
    setSelectedTeam(id);
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

      getAllTeams();
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
      // Validation checks
      if (
        !formData.keyId ||
        !formData.teamName ||
        !formData.highSchoolId
      ) {
        console.error("Please fill in all required fields.");
        return;
      }

      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team/update/${selectedTeamId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update Tournament Error:", errorData);
        throw new Error(
          `Failed to update team: ${response.status} - ${response.statusText}`
        );
      }

      getAllTeams();

      // Clear form data
      setFormData({
        keyId: "",
        teamName: "",
        highSchoolId: "",
      });
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating team:", error.message);
    }
  };
  const handleDeleteTeam = async () => {
    try {
      console.log("Deleting team:", selectedTeamId);
      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team/delete/${selectedTeamId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedTeamId,
          }),
        }
      );
      getAllTeams();
      setFormData({
        keyId: "",
        teamName: "",
        highSchoolId: "",
      });
      setShowDeleteForm(false);
    } catch (error) {
      console.error("Error deleting team:", error);
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

  useEffect(() => {
    getAllTeams();
  }, []);
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
            value={formData.highSchoolId}
            onChange={handleInputChange}
          >
            <option value="">Select High School</option>
            {highSchoolsOptions.map((highSchool) => (
              <option key={highSchool.id} value={highSchool.id}>
                {highSchool.highSchoolName}
              </option>
            ))}
          </select>
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
              <tr 
                key={team.id} 
                className = {team.hightlighted ? "selected-row" : ""} 
                onClick={() => handleFetchTeamById(team.id)}>
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
