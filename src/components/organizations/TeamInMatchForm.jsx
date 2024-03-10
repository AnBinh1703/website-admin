import React, { useEffect, useState } from "react";
import "./css/TeamInMatch.css";

const TeamInMatchForm = ({ onClose, onUpdateResult, matchId }) => {
  // State for selected team's details and update form visibility
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [updateFormVisible, setUpdateFormVisible] = useState(false);

  // State for form data and dropdown options
  const [formData, setFormData] = useState({
    score: 0,
    duration: "",
    isWinner: true,
  });
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [selectedTeamId, setselectedTeamId] = useState("");
  const [matchOptions, setMatchOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);

  // Fetch teams data based on matchId
  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        const response = await fetch(
          `https://fptbottournamentweb.azurewebsites.net/api/team-in-match/get-all-teams-in-match-id/${matchId}`
        );

        if (!response.ok) {
          throw new Error("Error fetching teams data");
        }

        const teamsData = await response.json();
        setTeams(teamsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teams data:", error.message);
        setError("Error fetching teams data. Please try again.");
        setLoading(false);
      }
    };

    fetchTeamsData();
  }, [matchId]);

  // Fetch dropdown options on component mount
  useEffect(() => {
    fetchDropdownOptions("team");
    fetchDropdownOptions("match");
  }, []);

  // Handle row click to show update form
  const handleRowClick = async (teamId) => {
    console.log("Clicked row ID:", teamId);
    console.log("Current selectedRowId:", selectedRowId);

    // Fetch the selected team based on teamId
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team-in-match/get-team-in-match-by-id/${teamId}`
      );

      if (!response.ok) {
        throw new Error("Error fetching selected team");
      }

      const selectedTeamData = await response.json();
      setSelectedTeam(selectedTeamData);
      setSelectedRowId(teamId);
    } catch (error) {
      console.error("Error fetching selected team:", error.message);
    }
  };

  // Open the update form with selected team details

  // Open the update form with selected team details
  const handleUpdateFormOpen = () => {
    console.log("Selected team:", selectedTeam);

    if (!selectedTeam) {
      console.error("Selected team not found.");
      return;
    }

    setFormData({
      score: selectedTeam.score || 0,
      duration: selectedTeam.duration || "",
      isWinner: selectedTeam.isWinner || true,
    });

    setUpdateFormVisible(true);
  };

  // Additional method to close the update form
  const handleUpdateFormClose = () => {
    setUpdateFormVisible(false);
  };
  // Fetch dropdown options for teams and matches
  const fetchDropdownOptions = async (type) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/${type}/get-all`
      );
      const data = await response.json();

      switch (type) {
        case "team":
          setTeamOptions(data);
          break;
        case "match":
          setMatchOptions(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${type} options:`, error.message);
    }
  };

  // Fetch all matches
  const getAllMatches = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/match/get-all"
      );
      const data = await response.json();

      setMatches(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching matches:", error.message);
      setError("Error fetching matches. Please try again.");
      setLoading(true);
    }
  };

  // Add team to match
  const handleAddTeamToMatch = async () => {
    try {
      const requestBody = {
        teamId: selectedTeamId,
        matchId: selectedMatch,
      };

      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team-in-match/add-team-to-match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Error adding team to match.");
      }

      // Fetch updated data before setting state or closing the form
      await getAllMatches();

      // Reset form state
      setShowAddTeamForm(false);
      setselectedTeamId("");
    } catch (error) {
      console.error("Error adding team to match:", error.message);
      setLoading(false);
    }
  };
  // Update team-in-match result
  const handleUpdateResult = async () => {
    try {
      if (!selectedRowId) {
        console.error("No row selected for update.");
        return;
      }

      const teamInMatchIdToUpdate = selectedRowId;

      const updateRequestBody = {
        score: formData.score,
        duration: formData.duration,
        isWinner: formData.isWinner,
      };

      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team-in-match/update-result-for-team-in-match-id/${teamInMatchIdToUpdate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateRequestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating team-in-match result");
      }

      await getAllMatches(); // Fetch updated data
      setUpdateFormVisible(false); // Close the form
    } catch (error) {
      console.error("Error updating team-in-match result:", error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      if (!selectedRowId) {
        console.error("No row selected for delete.");
        return;
      }

      const teamInMatchIdToDelete = selectedRowId;

      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team-in-match/delete-team-with-id/${teamInMatchIdToDelete}?matchId=${matchId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting team");
      }

      onUpdateResult(null); // Notify parent that a team was deleted
      await getAllMatches(); // Fetch updated data
    } catch (error) {
      console.error("Error deleting team:", error);
    } finally {
      onClose(); // Close the form
    }
  };

  return (
    <div className="popup-form">
      <h3>Team-in-Match List</h3>

      <table>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Match Key ID</th>
            <th>Score</th>
            <th>Duration</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr
              key={team.id}
              onClick={() => handleRowClick(team.id)}
              className={selectedRowId === team.id ? "selected" : ""}
            >
              <td>{team.teamName}</td>
              <td>{team.matchKeyId}</td>
              <td>{team.score}</td>
              <td>{team.duration}</td>
              <td>{team.isWinner}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {teams.length > 0 && (
        <>
          <button
            className="add-team-button"
            onClick={() => setShowAddTeamForm(true)}
          >
            Add Team
          </button>

          <button onClick={handleUpdateFormOpen}>Update Result</button>
          <button onClick={handleDeleteTeam}>Delete Team</button>
        </>
      )}

      {showAddTeamForm && (
        <div className="popup-form">
          <h3>Add Team</h3>
          <label>Match:</label>
          <select
            name="matchId"
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
          >
            <option value="">Select Match</option>
            {matchOptions.map((match) => (
              <option key={match.id} value={match.id}>
                {match.keyId}
              </option>
            ))}
          </select>
          <label>Team:</label>
          <select
            name="teamId"
            value={selectedTeamId}
            onChange={(e) => setselectedTeamId(e.target.value)}
          >
            <option value="">Select Team</option>
            {teamOptions.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
          <button onClick={handleAddTeamToMatch}>Add Team</button>
          <button onClick={() => setShowAddTeamForm(false)}>Cancel</button>
        </div>
      )}

      {updateFormVisible && (
        <div className="popup-form">
          <h3>Update Result</h3>
          <label>Score:</label>
          <input
            type="number"
            value={formData.score}
            onChange={(e) =>
              setFormData({ ...formData, score: e.target.value })
            }
          />
          <label>Duration:</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
          <label>Is Winner:</label>
          <select
            value={formData.isWinner}
            onChange={(e) =>
              setFormData({ ...formData, isWinner: e.target.value })
            }
          >
            <option value={true}>Win</option>
            <option value={false}>Lose</option>
          </select>
          <button onClick={handleUpdateResult}>Update Result</button>
          <button onClick={handleUpdateFormClose}>Cancel</button>
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default TeamInMatchForm;
