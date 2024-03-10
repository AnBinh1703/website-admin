import React, { useEffect, useState } from "react";
import TeamInMatchForm from "./TeamInMatchForm";
import "./css/MatchList.css";
const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    keyId: "",
    mapId: "",
    matchDate: "",
    roundId: "",
    tournamentId: "",
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [selectedMapId, setSelectedMapId] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const [setMatchKeyId] = useState("");

  const [mapOptions, setMapOptions] = useState([]);
  const [roundOptions, setRoundOptions] = useState([]);
  const [tournamentOptions, setTournamentOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [matchOptions, setMatchOptions] = useState([]);

  const [setShowTeamInMatchForm] = useState(false);
  const [doubleClick, setDoubleClick] = useState(false);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState("");

  useEffect(() => {
    fetchDropdownOptions("map");
    fetchDropdownOptions("round");
    fetchDropdownOptions("tournament");
    fetchDropdownOptions("team");
    fetchDropdownOptions("match");
  }, []);

  const handleRowDoubleClick = async (matchId) => {
    try {
      setSelectedMatchId(matchId);
      setDoubleClick(true);

      // Fetch match details based on matchId
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/match/get/${matchId}`
      );

      if (!response.ok) {
        throw new Error("Error fetching match details");
      }

      const matchData = await response.json();
      const matchKeyId = matchData.matchKeyId;

      setShowTeamInMatchForm(true);
      setMatchKeyId(matchKeyId);

      // Trigger the "Add Team" form
      setShowAddTeamForm(true);
    } catch (error) {
      console.error("Error handling double-click:", error.message);
    }
  };

  const fetchDropdownOptions = async (type) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/${type}/get-all`
      );
      const data = await response.json();

      switch (type) {
        case "map":
          setMapOptions(data);
          break;
        case "round":
          setRoundOptions(data);
          break;
        case "tournament":
          setTournamentOptions(data);
          break;
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

  const handleDropdownChange = (type, selectedOption) => {
    switch (type) {
      case "map":
        setSelectedMapId(selectedOption.id);
        break;
      case "round":
        setSelectedRoundId(selectedOption.id);
        break;
      case "tournament":
        setSelectedTournamentId(selectedOption.id);
        break;
      default:
        break;
    }
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleShowUpdateForm = (id) => {
    const selectedMatch = matches.find((match) => match.id === id);

    if (selectedMatch) {
      // Format date for display in the update form
      const formattedDate = new Date(selectedMatch.matchDate);
      formattedDate.setHours(formattedDate.getHours() - 17);

      // Set the form data with the formatted match date
      setFormData({
        ...selectedMatch,
        matchDate: formattedDate.toISOString().slice(0, 16), // Display only up to the minutes
      });

      // Set selected values for dropdowns
      setSelectedMapId(selectedMatch.mapId);
      setSelectedRoundId(selectedMatch.roundId);
      setSelectedTournamentId(selectedMatch.tournamentId);

      setShowUpdateForm(true);
      setSelectedMatchId(id);
    }
  };
  const handleShowAddTeamForm = () => {
    setShowAddTeamForm(true);
  };
  const handleShowDeleteForm = (id) => {
    const selectedMatch = matches.find((match) => match.id === id);

    setFormData({
      keyId: selectedMatch.keyId,
      mapId: selectedMatch.mapId,
      matchDate: selectedMatch.matchDate,
      roundId: selectedMatch.roundId,
      tournamentId: selectedMatch.tournamentId,
    });

    setShowDeleteForm(true);
    setSelectedMatchId(id);
  };

  const handleCloseForms = () => {
    setShowCreateForm(false);
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setSelectedMatchId(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getAllMatches();
    fetchDropdownOptions("team");
    fetchDropdownOptions("match");
  }, []);

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

  const handleCreateMatch = async () => {
    try {
      const requestBody = {
        keyId: formData.keyId,
        mapId: selectedMapId,
        matchDate: formData.matchDate,
        roundId: selectedRoundId,
        tournamentId: selectedTournamentId,
      };

      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/match/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Error creating match.");
      }

      setLoading(true);

      await getAllMatches();

      setLoading(false);
      setShowCreateForm(false);
      setFormData({
        keyId: "",
        mapId: "",
        matchDate: "",
        roundId: "",
        tournamentId: "",
      });
    } catch (error) {
      console.error("Error creating match:", error.message);
    }
  };

  const handleUpdateMatch = async () => {
    try {
      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/match/update/${selectedMatchId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      setShowUpdateForm(false);
      getAllMatches();
      setFormData({
        keyId: "",
        mapId: "",
        matchDate: "",
        roundId: "",
        tournamentId: "",
      });
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  const handleDeleteMatch = async () => {
    try {
      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/match/delete/${selectedMatchId}`,
        {
          method: "DELETE",
        }
      );

      setShowDeleteForm(false);
      getAllMatches();
      setFormData({
        keyId: "",
        mapId: "",
        matchDate: "",
        roundId: "",
        tournamentId: "",
      });
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };
  const handleAddTeamToMatch = async () => {
    try {
      const requestBody = {
        teamId: selectedTeam, // Use selectedTeam instead of teamId
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
      setSelectedMatch("");

      setSelectedTeam("");
    } catch (error) {
      console.error("Error adding team to match:", error.message);
    }
  };

  return (
    <div id="match-list-container">
      <h2>Match List</h2>
      <div>
        <button className="create-button" onClick={handleShowCreateForm}>
          Create Match
        </button>
        <button
          className="update-button"
          onClick={() =>
            selectedMatchId && handleShowUpdateForm(selectedMatchId)
          }
          disabled={!selectedMatchId}
        >
          Update Match
        </button>
        <button
          className="delete-button"
          onClick={() =>
            selectedMatchId && handleShowDeleteForm(selectedMatchId)
          }
          disabled={!selectedMatchId}
        >
          Delete Match
        </button>
        {/* <button
          className="add-team-button"
          onClick={() => setShowAddTeamForm(true)}
        >
          Add Team to Match
        </button> */}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Match Key</th>
              <th>Map Name</th>
              <th>Round Name</th>
              <th>Tournament Name</th>
              <th>Match Date</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr
                key={match.id}
                className={selectedMatchId === match.id ? "selected-row" : ""}
                onClick={() => setSelectedMatchId(match.id)}
                onDoubleClick={() => handleRowDoubleClick(match.id)}
              >
                <td>{match.keyId}</td>
                <td>{match.mapName}</td>
                <td>{match.roundName}</td>
                <td>{match.tournamentName}</td>
                <td>{new Date(match.matchDate).toLocaleString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showCreateForm && (
        <div className="popup-form">
          <h3>Create Match</h3>
          <label>Match Id:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Map:</label>
          <select
            name="mapId"
            value={selectedMapId}
            onChange={(e) =>
              handleDropdownChange(
                "map",
                mapOptions.find((m) => m.id === e.target.value)
              )
            }
          >
            <option value="">Select Map</option>
            {mapOptions.map((map) => (
              <option key={map.id} value={map.id}>
                {map.mapName}
              </option>
            ))}
          </select>
          <label>Match Date:</label>
          <input
            type="datetime-local"
            name="matchDate"
            value={formData.matchDate}
            onChange={handleInputChange}
          />
          <label>Round ID:</label>
          <select
            name="roundId"
            value={selectedRoundId}
            onChange={(e) =>
              handleDropdownChange(
                "round",
                roundOptions.find((r) => r.id === e.target.value)
              )
            }
          >
            <option value="">Select Round</option>
            {roundOptions.map((round) => (
              <option key={round.id} value={round.id}>
                {round.roundName}
              </option>
            ))}
          </select>
          <label>Tournament ID:</label>
          <select
            name="tournamentId"
            value={selectedTournamentId}
            onChange={(e) =>
              handleDropdownChange(
                "tournament",
                tournamentOptions.find((t) => t.id === e.target.value)
              )
            }
          >
            <option value="">Select Tournament</option>
            {tournamentOptions.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.tournamentName}
              </option>
            ))}
          </select>
          <button onClick={handleCreateMatch}>Create Match</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}

      {showUpdateForm && (
        <div className="popup-form">
          <h3>Update Match</h3>
          <label>Match Id:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Map:</label>
          <select
            name="mapId"
            value={selectedMapId}
            onChange={(e) =>
              handleDropdownChange(
                "map",
                mapOptions.find((m) => m.id === e.target.value)
              )
            }
          >
            <option value="">Select Map</option>
            {mapOptions.map((map) => (
              <option key={map.id} value={map.id}>
                {map.mapName}
              </option>
            ))}
          </select>
          <label>Match Date:</label>
          <input
            type="datetime-local"
            name="matchDate"
            value={formData.matchDate}
            onChange={handleInputChange}
          />
          <label>Round ID:</label>
          <select
            name="roundId"
            value={selectedRoundId}
            onChange={(e) =>
              handleDropdownChange(
                "round",
                roundOptions.find((r) => r.id === e.target.value)
              )
            }
          >
            <option value="">Select Round</option>
            {roundOptions.map((round) => (
              <option key={round.id} value={round.id}>
                {round.roundName}
              </option>
            ))}
          </select>
          <label>Tournament ID:</label>
          <select
            name="tournamentId"
            value={selectedTournamentId}
            onChange={(e) =>
              handleDropdownChange(
                "tournament",
                tournamentOptions.find((t) => t.id === e.target.value)
              )
            }
          >
            <option value="">Select Tournament</option>
            {tournamentOptions.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.tournamentName}
              </option>
            ))}
          </select>
          <button onClick={handleUpdateMatch}>Update Match</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}

      {showDeleteForm && (
        <div className="popup-form">
          <h3>Delete Match</h3>
          <p>Are you sure you want to delete this match?</p>
          <button onClick={handleDeleteMatch}>Delete Match</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}
      {/* Display TeamInMatchForm.jsx if double-click event occurred */}
      {doubleClick && (
        <div className="popup-form">
          <TeamInMatchForm
            matchId={selectedMatchId}
            onClose={() => setDoubleClick(false)} // Fix: Close the form on close button click
            onUpdateResult={(updatedData) => {
              // Handle the updated data if needed
              console.log("Updated Result:", updatedData);
            }}
          />
        </div>
      )}

      {showAddTeamForm && (
        <div className="popup-form">
          <h3>Add Team to Match</h3>
          <label>Match:</label>
          <select
            name="matchId"
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
          >
            <option value="">Select Match</option>
            {matchOptions.map((match) => (
              <option key={match.id} value={match.id}>
                {match.matchKeyId}
              </option>
            ))}
          </select>
          <label>Team:</label>
          <select
            name="teamId"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">Select Team</option>
            {teamOptions.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
          {/* ... (Existing input fields) */}
          <button onClick={handleAddTeamToMatch}>Add Team</button>
          <button onClick={() => setShowAddTeamForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MatchList;
