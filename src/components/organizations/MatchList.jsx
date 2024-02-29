import React, { useEffect, useState } from 'react';
import './css/MapList.css';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    mapId: '',
    matchDate: '',
    roundId: '',
    tournamentId: '',
  });

  // State for handling pop-up forms
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleShowUpdateForm = (id) => {
    // Find the selected match based on the ID
    const selectedMatch = matches.find((match) => match.id === id);

    // Set form data with the selected match's data
    setFormData({
      mapId: selectedMatch.mapId,
      matchDate: selectedMatch.matchDate,
      roundId: selectedMatch.roundId,
      tournamentId: selectedMatch.tournamentId,
    });

    setShowUpdateForm(true);
    setSelectedMatchId(id);
  };

  const handleShowDeleteForm = (id) => {
    // Find the selected match based on the ID
    const selectedMatch = matches.find((match) => match.id === id);

    // Set form data with the selected match's data
    setFormData({
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
    // Update form data when input fields change
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch all matches on component mount
  useEffect(() => {
    getAllMatches();
  }, []);

  const getAllMatches = async () => {
    try {
      const response = await fetch('https://fptbottournamentweb.azurewebsites.net/api/Match/get-all-matches');
      const data = await response.json();
      setMatches(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error.message);
      setError('Error fetching matches. Please try again.');
      setLoading(false);
    }
  };

  const handleFetchMatchById = async (id) => {
    try {
      const response = await fetch(`https://fptbottournamentweb.azurewebsites.net/api/Match/get-a-match-by-id?id=${id}`);
      const data = await response.json();
      console.log('Match by ID:', data);
    } catch (error) {
      console.error('Error fetching match by ID:', error.message);
    }
  };

  const handleCreateMatch = async () => {
    try {
       if (!formData.mapId || !formData.matchDate || !formData.roundId || !formData.tournamentId) {
      console.error('Please fill in all required fields.');
      return;
    }
      await fetch('https://fptbottournamentweb.azurewebsites.net/api/Match/create-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Refresh match list
      getAllMatches();
      // Clear form data
      setFormData({
        mapId: '',
        matchDate: '',
        roundId: '',
        tournamentId: '',
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const handleUpdateMatch = async (id) => {
    try {
       if (!formData.mapId || !formData.matchDate || !formData.roundId || !formData.tournamentId) {
      console.error('Please fill in all required fields.');
      return;
    }
      await fetch(`https://fptbottournamentweb.azurewebsites.net/api/Match/update-match/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Refresh match list
      getAllMatches();
      // Clear form data
      setFormData({
        mapId: '',
        matchDate: '',
        roundId: '',
        tournamentId: '',
      });
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const handleDeleteMatch = async (id) => {
    try {
      await fetch(`https://fptbottournamentweb.azurewebsites.net/api/Match/delete-match?id=${id}`, {
        method: 'DELETE',
      });

      // Refresh match list
      getAllMatches();
      // Clear form data
      setFormData({
        mapId: '',
        matchDate: '',
        roundId: '',
        tournamentId: '',
      });
      setShowDeleteForm(false);
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  return (
    <div>
      <h2>Match List</h2>
      {/* Buttons for Create, Update, Delete */}
      <div>
        <button className="create-button" onClick={handleShowCreateForm}>
          Create Match
        </button>
        <button
          className="update-button"
          onClick={() => selectedMatchId && handleShowUpdateForm(selectedMatchId)}
          disabled={!selectedMatchId}
        >
          Update Match
        </button>
        <button
          className="delete-button"
          onClick={() => selectedMatchId && handleShowDeleteForm(selectedMatchId)}
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
              <th>ID</th>
              <th>Map ID</th>
              <th>Match Date</th>
              <th>Round ID</th>
              <th>Tournament ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr
                key={match.id}
                style={{ backgroundColor: match.highlighted ? 'gray' : 'transparent' }}
                onClick={() => handleFetchMatchById(match.id)}
              >
                <td>{match.id}</td>
                <td>{match.mapId}</td>
                <td>{match.matchDate}</td>
                <td>{match.roundId}</td>
                <td>{match.tournamentId}</td>
                <td>
                  <button onClick={() => handleFetchMatchById(match.id)}>Fetch by ID</button>
                  <button onClick={() => setSelectedMatchId(match.id)}>Update</button>
                  <button onClick={() => handleDeleteMatch(match.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create Match Form */}
      {showCreateForm && (
        <div className="popup-form">
          <h3>Create New Match</h3>
          <label>Map ID:</label>
          <input type="text" name="mapId" value={formData.mapId} onChange={handleInputChange} />
          <label>Match Date:</label>
          <input type="datetime-local" name="matchDate" value={formData.matchDate} onChange={handleInputChange} />
          <label>Round ID:</label>
          <input type="text" name="roundId" value={formData.roundId} onChange={handleInputChange} />
          <label>Tournament ID:</label>
          <input type="text" name="tournamentId" value={formData.tournamentId} onChange={handleInputChange} />
          <button onClick={handleCreateMatch}>Create Match</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Update Match Form */}
      {showUpdateForm && (
        <div className="popup-form">
          <h3>Update Match</h3>
          <label>Map ID:</label>
          <input type="text" name="mapId" value={formData.mapId} onChange={handleInputChange} />
          <label>Match Date:</label>
          <input type="datetime-local" name="matchDate" value={formData.matchDate} onChange={handleInputChange} />
          <label>Round ID:</label>
          <input type="text" name="roundId" value={formData.roundId} onChange={handleInputChange} />
          <label>Tournament ID:</label>
          <input type="text" name="tournamentId" value={formData.tournamentId} onChange={handleInputChange} />
          <button onClick={() => handleUpdateMatch(selectedMatchId)}>Update Match</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Delete Match Confirmation */}
      {showDeleteForm && (
        <div className="popup-form">
          <h3>Delete Match</h3>
          <p>Are you sure you want to delete this match?</p>
          <button onClick={() => handleDeleteMatch(selectedMatchId)}>Delete Match</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MatchList;
