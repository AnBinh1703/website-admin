import React, { useState } from 'react';
import './css/TournamentList.css'; // Make sure to adjust the import based on your actual file structure

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
          keyId: '',

    tournamentName: '',
    startDate: '',
    endDate: '',
  });

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
    // Update form data when input fields change
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getAllTournaments = async () => {
    try {
      const response = await fetch('https://fptbottournamentweb.azurewebsites.net/api/tournament/get-all');
      const data = await response.json();

      setTournaments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tournaments:', error.message);
      setError('Error fetching tournaments. Please try again.');
      setLoading(false);
    }
  };
const handleFetchTournamentById = (id) => {
  // Fetch tournament by ID and highlight the selected tournament
  const updatedTournaments = tournaments.map((tournament) => ({
    ...tournament,
    highlighted: tournament.id === id,
  }));

  setTournaments(updatedTournaments);
  setSelectedTournamentId(id);
};
const handleCreateTournament = async () => {
  try {
    await fetch('https://fptbottournamentweb.azurewebsites.net/api/tournament/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Refresh tournament list
    getAllTournaments();
    // Clear form data
    setFormData({
      tournamentName: '',
      startDate: '',
      endDate: '',
    });
    setShowCreateForm(false);
  } catch (error) {
    console.error('Error creating tournament:', error);
  }
};


 const handleUpdateTournament = async () => {
  try {
    await fetch(`https://fptbottournamentweb.azurewebsites.net/api/tournament/update/${selectedTournamentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Refresh tournament list
    getAllTournaments();
    // Clear form data
    setFormData({
      keyId: '',
      tournamentName: '',
      startDate: '',
      endDate: '',
    });
    setShowUpdateForm(false);
  } catch (error) {
    console.error('Error updating tournament:', error);
  }
};

  const handleDeleteTournament = async (id) => {
  try {
    const response = await fetch(`https://fptbottournamentweb.azurewebsites.net/api/tournament/delete/${selectedTournamentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete tournament: ${response.status} - ${response.statusText}`);
    }

    // Refresh tournament list
    getAllTournaments();
    // Clear form data
    setFormData({
      tournamentName: '',
      startDate: '',
      endDate: '',
    });
    setShowDeleteForm(false);
  } catch (error) {
    console.error('Error deleting tournament:', error);
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
          onClick={() => selectedTournamentId && handleShowUpdateForm(selectedTournamentId)}
          disabled={!selectedTournamentId}
        >
          Update Tournament
        </button>
        <button
          className="delete-button"
          onClick={() => selectedTournamentId && handleShowDeleteForm(selectedTournamentId)}
          disabled={!selectedTournamentId}
        >
          Delete Tournament
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
              className={tournament.highlighted ? 'selected-row' : ''}
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
          <input type="text" name="keyId" value={formData.keyId} onChange={handleInputChange} />

          <label>Tournament Name:</label>
          <input type="text" name="tournamentName" value={formData.tournamentName} onChange={handleInputChange} />
          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
          <label>End Date:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
          <button onClick={handleCreateTournament}>Create Tournament</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Update Tournament Form */}
      {showUpdateForm && (
        <div className="popup-form">
          <h3>Update Tournament</h3>
          <label>KeyId</label>
          <input type="text" name="keyId" value={formData.keyId} onChange={handleInputChange} />
          <label>Tournament Name:</label>
          <input type="text" name="tournamentName" value={formData.tournamentName} onChange={handleInputChange} />
          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
          <label>End Date:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
          <button onClick={() => handleUpdateTournament(selectedTournamentId)}>Update Tournament</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Delete Tournament Confirmation */}
      {showDeleteForm && (
        <div className="popup-form">
          <h3>Delete Tournament</h3>
          <p>Are you sure you want to delete this tournament?</p>
          <button onClick={() => handleDeleteTournament(selectedTournamentId)}>Delete Tournament</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TournamentList;
