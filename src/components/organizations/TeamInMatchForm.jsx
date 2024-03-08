import React, { useEffect, useState } from "react";

const TeamInMatchForm = ({ onClose, onUpdateResult, matchId }) => {
  const [formData, setFormData] = useState({
    teamId: "",
    score: "",
    duration: "",
    isWinner: "",
  });
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeamId, setselectedTeamId] = useState("");
  const [setMatchKeyId] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [setShowTeamInMatchForm] = useState(false);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [mapOptions, setMapOptions] = useState([]);
  const [matchOptions, setMatchOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    // Fetch teams data based on matchId
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
        setLoading(true);
      } catch (error) {
        console.error("Error fetching teams data:", error.message);
        setError("Error fetching teams data. Please try again.");
        setLoading(false);
      }
    };

    fetchTeamsData();
  }, [matchId]);

  useEffect(() => {
    fetchDropdownOptions("team");
    fetchDropdownOptions("match");
  }, []);
  const handleRowClick = (teamInMatchId) => {
    // Set the selected row ID
    setSelectedRowId(teamInMatchId);
  };
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
        case "match": // Add this case to set match options
          setMatchOptions(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${type} options:`, error.message);
    }
  };
  const handleUpdateResult = async () => {
    try {
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

      onUpdateResult(formData);
      onClose();
    } catch (error) {
      console.error("Error updating team-in-matz result:", error);
    }
  };

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
      setLoading(false);
    }
  };

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

      await getAllMatches();

      setShowAddTeamForm(false);

      setselectedTeamId("");
    } catch (error) {
      console.error("Error adding team to match:", error.message);
    }
    setLoading();
  };

  const handleDeleteTeam = async () => {
    try {
      const teamIdToDelete = formData.teamId;

      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team-in-match/delete-team-with-id/${teamIdToDelete}?matchId=${matchId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting team");
      }

      onUpdateResult(formData);
      onClose();
    } catch (error) {
      console.error("Error deleting team:", error);
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
            <tr key={team.id} onClick={() => handleRowClick(team.id)}>
              <td>{team.teamName} </td>
              <td>{team.matchKeyId}</td>
              <td>{team.score}</td>
              <td>{team.duration}</td>
              <td>{team.isWinner}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {teams.length >= 0 && (
        <>
          <button
            className="add-team-button"
            onClick={() => setShowAddTeamForm(true)}
          >
            Add Team
          </button>

          <button onClick={handleUpdateResult}>Update Result</button>
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
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default TeamInMatchForm;
