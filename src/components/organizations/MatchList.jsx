import React, { useEffect, useState } from "react";
import "./css/MatchList.css";

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setFormValid] = useState(true);

  const [formData, setFormData] = useState({
    keyId: "",
    mapId: "",
    matchDate: "",
    roundId: "",
    tournamentId: "",
  });

  // State for handling pop-up forms
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  // State for dropdown options and selected values
  const [mapOptions, setMapOptions] = useState([]);
  const [roundOptions, setRoundOptions] = useState([]);
  const [tournamentOptions, setTournamentOptions] = useState([]);

  const [setSelectedMap] = useState("");
  const [selectedMapId, setSelectedMapId] = useState("");

  const [setSelectedRound] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");

  const [setSelectedTournament] = useState("");
  const [selectedTournamentId, setSelectedTournamentId] = useState("");

  // Add these state variables
  const [selectedMapName, setSelectedMapName] = useState("");
  const [selectedRoundName, setSelectedRoundName] = useState("");
  const [selectedTournamentName, setSelectedTournamentName] = useState("");

  // Fetch dropdown options when the component mounts
  useEffect(() => {
    fetchDropdownOptions("map");
    fetchDropdownOptions("round");
    fetchDropdownOptions("tournament");
  }, []);

  // Function to fetch dropdown options
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
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${type} options:`, error.message);
    }
  };

  // Function to handle dropdown selection
  const handleDropdownChange = (type, selectedOption) => {
    switch (type) {
      case "map":
        setSelectedMap(selectedOption.id);
        setSelectedMapName(selectedOption.mapName);
        break;
      case "round":
        setSelectedRound(selectedOption.id);
        setSelectedRoundName(selectedOption.roundName);
        break;
      case "tournament":
        setSelectedTournament(selectedOption.id);
        setSelectedTournamentName(selectedOption.tournamentName);
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

    setFormData({
      keyId: selectedMatch.keyId,
      mapId: selectedMatch.mapId,
      matchDate: selectedMatch.matchDate,
      roundId: selectedMatch.roundId,
      tournamentId: selectedMatch.tournamentId,
      teamInMatch: selectedMatch.teamInMatch.map((team) => team.teamId),
    });

    setShowUpdateForm(true);
    setSelectedMatchId(id);
  };

  const handleShowDeleteForm = (id) => {
    const selectedMatch = matches.find((match) => match.id === id);

    setFormData({
      keyId: selectedMatch.keyId,
      mapId: selectedMatch.mapId,
      matchDate: selectedMatch.matchDate,
      roundId: selectedMatch.roundId,
      tournamentId: selectedMatch.tournamentId,
      teamInMatch: selectedMatch.teamInMatch.map((team) => team.teamId),
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

<<<<<<< HEAD
  const loadTeams = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/get-all"
      );
      const data = await response.json();
    } catch (error) {
      console.error("Error fetching teams:", error.message);
      // Handle error fetching teams
    }
  };

=======
>>>>>>> web-dev
  useEffect(() => {
    getAllMatches();
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
        mapId: formData.mapId,
        matchDate: formData.matchDate,
        roundId: formData.roundId,
        tournamentId: formData.tournamentId,
      }


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
        const errorResponse = await response.json();
        console.error("Error creating match:", errorResponse);
        setFormValid(false); // Set form validity to false on error
        throw new Error(`Error adding a new match: ${errorResponse.message}`);
      }
      const createdMatchId = await response.json();
      console.log("Match created successfully. ID:", createdMatchId);

      setFormValid(true);
      setShowCreateForm(false);
      getAllMatches();
      setFormData({
        keyId: "",
        mapId: "",
        matchDate: "",
        roundId: "",
        tournamentId: "",
        teamInMatch: [],
      });
    } catch (error) {
      console.error("Error creating match:", error.message);
    }
  };

  const handleUpdateMatch = async () => {
    try {
      const requestBody = {
        mapId: formData.mapId,
        matchDate: formData.matchDate,
        roundId: formData.roundId,
        tournamentId: formData.tournamentId,
        keyId: formData.keyId,
      };

      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/match/update-match`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
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
        teamInMatch: [],
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
        teamInMatch: [],
      });
    } catch (error) {
      console.error("Error deleting match:", error);
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
              <tr key={match.id}>
                <td>{match.keyId}</td>
                <td>{match.mapName}</td>
                <td>{match.roundName}</td>
                <td>{match.tournamentName}</td>
                <td>{new Date(match.matchDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreateForm && (
        <div className="popup-form">
          <h3>Create New Match</h3>
          <label>Match Id:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
<<<<<<< HEAD

=======
>>>>>>> web-dev
          <label>Map:</label>
          <select
            name="mapId"
            value={selectedMapId}
            onChange={(e) => {
              handleDropdownChange("map", e.target.value);
              setSelectedMapId(e.target.value);
              const selectedMap = mapOptions.find(
                (map) => map.id === e.target.value
              );
              setSelectedMap(selectedMap ? selectedMap.mapName : "");
            }}
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

          <label>Round:</label>
          <select
            name="roundId"
            value={selectedRoundId}
            onChange={(e) => {
              handleDropdownChange("round", e.target.value);
              setSelectedRoundId(e.target.value);
              const selectedRound = roundOptions.find(
                (round) => round.id === e.target.value
              );
              setSelectedRound(selectedRound ? selectedRound.roundName : "");
            }}
          >
            <option value="">Select Round</option>
            {roundOptions.map((round) => (
              <option key={round.id} value={round.id}>
                {round.roundName}
              </option>
            ))}
          </select>

          <label>Tournament:</label>
          <select
            name="tournamentId"
            value={selectedTournamentId}
            onChange={(e) => {
              handleDropdownChange("tournament", e.target.value);
              setSelectedTournamentId(e.target.value);
              const selectedTournament = tournamentOptions.find(
                (tournament) => tournament.id === e.target.value
              );
              setSelectedTournament(
                selectedTournament ? selectedTournament.tournamentName : ""
              );
            }}
          >
            <option value="">Select Tournament</option>
            {tournamentOptions.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
<<<<<<< HEAD
                {tournament.tournamentName}
              </option>
            ))}
          </select>

          {/* Add other form elements or customize as needed */}

=======
                {tournament.tournamentName}{" "}
                {/* Adjust with the actual property name */}
              </option>
            ))}
          </select>
>>>>>>> web-dev
          <button onClick={handleCreateMatch}>Create Match</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}

      {showUpdateForm && (
        <div className="popup-form">
          <h3>Update Match</h3>
<<<<<<< HEAD
          {/* ... (rest of the form elements) */}
=======
          <label>KeyId:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Map ID:</label>
          <input
            type="text"
            name="mapId"
            value={formData.mapId}
            onChange={handleInputChange}
          />
          <label>Match Date:</label>
          <input
            type="datetime-local"
            name="matchDate"
            value={formData.matchDate}
            onChange={handleInputChange}
          />
          <label>Round ID:</label>
          <input
            type="text"
            name="roundId"
            value={formData.roundId}
            onChange={handleInputChange}
          />
          <label>Tournament ID:</label>
          <input
            type="text"
            name="tournamentId"
            value={formData.tournamentId}
            onChange={handleInputChange}
          />
>>>>>>> web-dev
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
    </div>
  );
};

export default MatchList;
