import { toHaveErrorMessage } from '@testing-library/jest-dom/dist/matchers';
import React, { useEffect, useState } from 'react';

const MapList = () => {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    keyId: '',
    mapName: '',
  });

// Fetch all maps on component mount
useEffect(() => {
  getAllMaps();
}, []);

const getAllMaps = async () => {
  try {
    //local host api
    const response = await fetch('https://localhost:7053/api/Map/get-all-maps');
    const data = await response.text();

    // Check if the response data is a valid JSON object
    if (data.length > 0) {
      const jsonData = JSON.parse(data);
      console.log('Response Data:', jsonData);
      setMaps(jsonData);
      setLoading(false);
    } else {
      console.error('Invalid response format. Expected JSON.');
      setError('Error fetching maps. Please try again.'); // Set error state
      setLoading(false);
    }
  } catch (error) {
    console.error('Error fetching maps:', error.message);
    setError('Error fetching maps. Please try again.', toHaveErrorMessage); // Set error state
    setLoading(false);
  }
};
  const handleInputChange = (e) => {
    // Update form data when input fields change
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateMap = async () => {
    try {
      // Make API call to create a new map
      await fetch('https://fptbottournamentweb.azurewebsites.net/api/Map/create-new-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Refresh map list
      getAllMaps();
      // Clear form data
      setFormData({
        keyId: '',
        mapName: '',
      });
    } catch (error) {
      console.error('Error creating map:', error);
    }
  };

  const handleUpdateMap = async (id) => {
    try {
      // Make API call to update a map by ID
      await fetch(`https://fptbottournamentweb.azurewebsites.net/api/Map/update-map/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Refresh map list
      getAllMaps();
      // Clear form data
      setFormData({
        keyId: '',
        mapName: '',
      });
    } catch (error) {
      console.error('Error updating map:', error);
    }
  };

  const handleDeleteMap = async (id) => {
    try {
      // Make API call to delete a map by ID
      await fetch(`https://fptbottournamentweb.azurewebsites.net/api/Map/delete-map/${id}`, {
        method: 'DELETE',
      });

      // Refresh map list
      getAllMaps();
    } catch (error) {
      console.error('Error deleting map:', error);
    }
  };

  return (
    <div>
      <h2>Map List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>KeyID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {maps.map((map) => (
              <tr key={map.id}>
                <td>{map.id}</td>
                <td>{map.keyId}</td>
                <td>{map.mapName}</td>
                <td>
                  <button onClick={() => handleUpdateMap(map.id)}>Update</button>
                  <button onClick={() => handleDeleteMap(map.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Form for creating new maps */}
      <h3>Create New Map</h3>
      <label>KeyID:</label>
      <input type="text" name="keyId" value={formData.keyId} onChange={handleInputChange} />
      <label>Name:</label>
      <input type="text" name="mapName" value={formData.mapName} onChange={handleInputChange} />
      <button onClick={handleCreateMap}>Create Map</button>
    </div>
  );  
};

export default MapList;