import React, { useEffect, useState } from "react";
import "./css/TournamentList.css";

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true); // New state for initial loading
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    keyId: "",
    tournamentName: "",
    startDate: "",
    endDate: "",
  });

  const clearFormData = () => {
    setFormData({
      keyId: "",
      tournamentName: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleErrors = (error, action) => {
    console.error(`Error ${action}:`, error);
  };
  // State for handling pop-up forms
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleShowUpdateForm = (id) => {
    setFormData({ ...tournaments.find((tournament) => tournament.id === id) });
    setShowUpdateForm(true);
    setSelectedTournamentId(id);
  };

  const handleShowDeleteForm = (id) => {
    setFormData({ ...tournaments.find((tournament) => tournament.id === id) });
    setShowDeleteForm(true);
    setSelectedTournamentId(id);
  };

  const handleCloseForms = () => {
    setShowCreateForm(false);
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setSelectedTournamentId(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(
          "https://fptbottournamentweb.azurewebsites.net/api/tournament/get-all"
        );
        const data = await response.json();

        setTournaments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tournaments:", error.message);
        setError("Error fetching tournaments. Please try again.");
        setLoading(false);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const getAllTournaments = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/tournament/get-all"
      );
      const data = await response.json();

      setTournaments(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tournaments:", error.message);
      setError("Error fetching tournaments. Please try again.");
      setLoading(false);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleFetchTournamentById = async (id) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/tournament/get-by-id/${id}`
      );
      const data = await response.json();

      const updatedTournaments = tournaments.map((tournament) => ({
        ...tournament,
        highlighted: tournament.id === id,
      }));

      setTournaments(updatedTournaments);
      setSelectedTournamentId(id);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching tournament by ID:", error.message);
    }
  };

  const handleCreateTournament = async () => {
    try {
      // Validation checks
      if (
        !formData.keyId ||
        !formData.tournamentName ||
        !formData.startDate ||
        !formData.endDate
      ) {
        console.error("Please fill in all required fields.");
        return;
      }

      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/tournament/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Create Tournament Error:", errorData);
        throw new Error(
          `Failed to create tournament: ${response.status} - ${response.statusText}`
        );
      }

      // Refresh tournament list
      setInitialLoading(true); // Set initial loading to true before fetching data
      getAllTournaments();

      // Clear form data
      setFormData({
        keyId: "",
        tournamentName: "",
        startDate: "",
        endDate: "",
      });

      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  const handleUpdateTournament = async () => {
    try {
      // Validation checks
      if (
        !formData.keyId ||
        !formData.tournamentName ||
        !formData.startDate ||
        !formData.endDate
      ) {
        console.error("Please fill in all required fields.");
        return;
      }

      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/tournament/update/${selectedTournamentId}`,
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
          `Failed to update tournament: ${response.status} - ${response.statusText}`
        );
      }

      // Refresh tournament list
      setInitialLoading(true); // Set initial loading to true before fetching data
      getAllTournaments();

      // Clear form data
      setFormData({
        keyId: "",
        tournamentName: "",
        startDate: "",
        endDate: "",
      });
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating tournament:", error.message);
    }
  };

  const handleDeleteTournament = async () => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/tournament/delete/${selectedTournamentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Delete Tournament Error:", errorData);
        throw new Error(
          `Failed to delete tournament: ${response.status} - ${response.statusText}`
        );
      }

      // Refresh tournament list
      setInitialLoading(true); // Set initial loading to true before fetching data
      await getAllTournaments();

      // Clear form data
      clearFormData();
      setShowDeleteForm(false);
    } catch (error) {
      handleErrors(error, "deleting tournament");
    }
  };

  return (
    <div id="tournament-list-container">
      <h2>Tournament List</h2>
      {/* Buttons for Create, Update, Delete */}
      <div>
        <button className="create-button" onClick={handleShowCreateForm}>
          Create Tournament
        </button>
        <button
          className="update-button"
          onClick={() =>
            selectedTournamentId && handleShowUpdateForm(selectedTournamentId)
          }
          disabled={!selectedTournamentId}
        >
          Update Tournament
        </button>
        <button
          className="delete-button"
          onClick={() =>
            selectedTournamentId && handleShowDeleteForm(selectedTournamentId)
          }
          disabled={!selectedTournamentId}
        >
          Delete Tournament
        </button>
      </div>
      {initialLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tournament Name</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((tournament) => (
              <tr
                key={tournament.id}
                className={tournament.highlighted ? "selected-row" : ""}
                onClick={() => handleFetchTournamentById(tournament.id)}
              >
                <td>{tournament.keyId}</td>
                <td>{tournament.tournamentName}</td>
                <td>{new Date(tournament.startDate).toLocaleDateString()}</td>
                <td>{new Date(tournament.endDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create Tournament Form */}
      {showCreateForm && (
        <div className="popup-form">
          <h3>Create New Tournament</h3>
          <label>KeyId</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />

          <label>Tournament Name:</label>
          <input
            type="text"
            name="tournamentName"
            value={formData.tournamentName}
            onChange={handleInputChange}
          />
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
          <button onClick={handleCreateTournament}>Create Tournament</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Update Tournament Form */}
      {showUpdateForm && (
        <div className="popup-form">
          <h3>Update Tournament</h3>
          <label>KeyId</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Tournament Name:</label>
          <input
            type="text"
            name="tournamentName"
            value={formData.tournamentName}
            onChange={handleInputChange}
          />
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdateTournament}>Update Tournament</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Delete Tournament Confirmation */}
      {showDeleteForm && (
        <div className="popup-form">
          <h3>Delete Tournament</h3>
          <p>Are you sure you want to delete this tournament?</p>
          <button onClick={handleDeleteTournament}>Delete Tournament</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TournamentList;
