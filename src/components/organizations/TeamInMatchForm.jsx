import React, { useEffect, useState } from "react";

const TeamInMatchForm = ({ onClose, onCreate, onUpdateResult, matchId }) => {
  const [formData, setFormData] = useState({
    teamId: "",
    teamName: "",
    matchKeyId: "",
    score: "",
    duration: "",
    isWinner: "",
  });

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTeamSelectionPopup, setShowTeamSelectionPopup] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `https://fptbottournamentweb.azurewebsites.net/api/team-in-match/get-all-teams-in-match-id/${matchId}`
        );
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error.message);
        setError("Error fetching teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [matchId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleCreate = async () => {
  //   try {
  //     // Check if teamId is selected
  //     if (!formData.teamId) {
  //       console.error("Please select a team.");
  //       return;
  //     }

  //     // Create the request body based on formData
  //     const requestBody = {
  //       teamId: formData.teamId,
  //       matchId: matchId, // Assuming matchId is available as a prop
  //     };

  //     const response = await fetch(
  //       "https://fptbottournamentweb.azurewebsites.net/api/team-in-match/add-team-to-match",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(requestBody),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Error creating team-in-match");
  //     }

  //     // If successful, close the form and trigger a refresh or additional actions if needed
  //     onCreate(formData);
  //     onClose();
  //   } catch (error) {
  //     console.error("Error creating team-in-match:", error);
  //   }
  // };

  // const handleCreate = async () => {
  //   try {
  //     // Check if a team has been selected
  //     if (!formData.teamId) {
  //       console.error("Please select a team.");
  //       return;
  //     }

  //     // Create the request body based on formData
  //     const requestBody = {
  //       teamId: formData.teamId,
  //       matchId: matchId,
  //     };

  //     const response = await fetch(
  //       "https://fptbottournamentweb.azurewebsites.net/api/team-in-match/add-team-to-match",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(requestBody),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Error creating team-in-match");
  //     }

  //     // If successful, clear the form data and trigger a refresh or additional actions if needed
  //     setFormData({
  //       teamId: "",
  //       teamName: "",
  //       matchKeyId: "",
  //       score: "",
  //       duration: "",
  //       isWinner: "",
  //     });

  //     // Trigger a refresh or additional actions if needed
  //     onUpdateResult(formData);
  //     onClose();
  //   } catch (error) {
  //     console.error("Error creating team-in-match:", error);
  //   }
  // };

  const handleCreate = async () => {
    try {
      // Check if a team has been selected
      if (!formData.teamId) {
        console.error("Please select a team.");
        return;
      }

      // Create the request body based on formData
      const requestBody = {
        teamId: formData.teamId,
        matchId: matchId,
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
        throw new Error("Error creating team-in-match");
      }

      // If successful, clear the form data and trigger a refresh or additional actions if needed
      setFormData({
        teamId: "",
        teamName: "",
        matchKeyId: "",
        score: "",
        duration: "",
        isWinner: "",
      });

      // Trigger a refresh or additional actions if needed
      onUpdateResult(formData);
      onClose();
    } catch (error) {
      console.error("Error creating team-in-match:", error);
    }
  };

  const handleUpdateResult = () => {
    // Implement the logic for updating the result
    onUpdateResult(formData);
    onClose();
  };

  return (
    <div className="popup-form">
      <h3>Team-in-Match List</h3>

      {/* Display table with team information */}
      <table>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Match Key ID</th>
            <th>Score</th>
            <th>Duration</th>
            <th>Is Winner</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td>{team.teamName}</td>
              <td>{team.matchKeyId}</td>
              <td>{team.score}</td>
              <td>{team.duration}</td>
              <td>{team.isWinner}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add three buttons: Create, Update Result, Close */}
      <button onClick={handleCreate}>Create</button>
      <button onClick={handleUpdateResult}>Update Result</button>
      <button onClick={onClose}>Close</button>

      {/* Team selection popup */}
      {showTeamSelectionPopup && (
        <div className="team-selection-popup">
          <label>Team Name:</label>
          <select
            name="teamId"
            value={formData.teamId}
            onChange={handleInputChange}
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TeamInMatchForm;
