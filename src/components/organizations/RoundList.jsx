import React, { useEffect, useState } from "react";
import "./css/RoundList.css"; // Make sure to adjust the import based on your actual file structure

const RoundList = () => {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    roundName: "",
    highlighted: false,
  });

  // State for handling pop-up forms
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState(null);

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleShowUpdateForm = (id) => {
    // Find the selected round based on the ID
    const selectedRound = rounds.find((round) => round.id === id);

    // Set form data with the selected round's data
    setFormData({
      roundName: selectedRound.roundName,
    });

    setShowUpdateForm(true);
    setSelectedRoundId(id);
  };

  const handleShowDeleteForm = (id) => {
    // Find the selected round based on the ID
    const selectedRound = rounds.find((round) => round.id === id);

    // Set form data with the selected round's data
    setFormData({
      roundName: selectedRound.roundName,
    });

    setShowDeleteForm(true);
    setSelectedRoundId(id);
  };

  const handleCloseForms = () => {
    setShowCreateForm(false);
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setSelectedRoundId(null);
  };

  const handleInputChange = (e) => {
    // Update form data when input fields change
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch all rounds on component mount
  useEffect(() => {
    getAllRounds();
  }, []);

  const getAllRounds = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/round/get-all"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRounds(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rounds:", error.message);
      setError("Error fetching rounds. Please try again.");
      setLoading(false);
    }
  };

  const handleFetchRoundById = (id) => {
    const updatedRounds = rounds.map((round) =>
      round.id === id
        ? { ...round, highlighted: !round.highlighted }
        : { ...round, highlighted: false }
    );

    const selectedRound = updatedRounds.find((round) => round.id === id);

    setFormData({
      roundName: selectedRound.roundName,
      highlighted: selectedRound.highlighted,
    });
    setSelectedRoundId(id);
    setRounds(updatedRounds);
  };

  const handleCreateRound = async () => {
    try {
      await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/round/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Refresh round list
      getAllRounds();
      // Clear form data
      setFormData({
        roundName: "",
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating round:", error);
    }
  };

  const handleUpdateRound = async (id) => {
    try {
      if (!formData.roundName) {
        console.error("Please fill in all required fields.");
        return;
      }
      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/round/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Refresh round list
      getAllRounds();
      // Clear form data
      setFormData({
        roundName: "",
      });
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating round:", error);
    }
  };

  const handleDeleteRound = async (id) => {
    try {
      if (!formData.roundName) {
        console.error("Please fill in all required fields.");
        return;
      }
      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/round/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      // Refresh round list
      getAllRounds();
      // Clear form data
      setFormData({
        roundName: "",
      });
      setShowDeleteForm(false);
    } catch (error) {
      console.error("Error deleting round:", error);
    }
  };

  return (
    <div id="round-list-container">
      <h2>Round List</h2>
      {/* Buttons for Create, Update, Delete */}
      <div>
        <button className="create-button" onClick={handleShowCreateForm}>
          Create Round
        </button>
        <button
          className="update-button"
          onClick={() =>
            selectedRoundId && handleShowUpdateForm(selectedRoundId)
          }
          disabled={!selectedRoundId}
        >
          Update Round
        </button>
        <button
          className="delete-button"
          onClick={() =>
            selectedRoundId && handleShowDeleteForm(selectedRoundId)
          }
          disabled={!selectedRoundId}
        >
          Delete Round
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
              <th>Round Name</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round) => (
              <tr
                key={round.id}
                style={{
                  backgroundColor: round.highlighted ? "gray" : "transparent",
                }}
                onClick={() => handleFetchRoundById(round.id)}
              >
                <td>{round.roundName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create Round Form */}
      {showCreateForm && (
        <div className="popup-form">
          <h3>Create New Round</h3>
          <label>Round Name:</label>
          <input type="text" name="roundName" onChange={handleInputChange} />
          <button onClick={handleCreateRound}>Create Round</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Update Round Form */}
      {showUpdateForm && (
        <div className="popup-form">
          <h3>Update Round</h3>
          <label>Round Name:</label>
          <input
            type="text"
            name="roundName"
            value={formData.roundName}
            onChange={handleInputChange}
          />
          <button onClick={() => handleUpdateRound(selectedRoundId)}>
            Update Round
          </button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Delete Round Confirmation */}
      {showDeleteForm && (
        <div className="popup-form">
          <h3>Delete Round</h3>
          <p>Are you sure you want to delete this round?</p>
          <button onClick={() => handleDeleteRound(selectedRoundId)}>
            Delete Round
          </button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default RoundList;
