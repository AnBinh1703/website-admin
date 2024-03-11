import React, { useEffect, useState } from 'react';

const MapList = () => {
  const [maps, setMaps] = useState([]);
  const [formData, setFormData] = useState({
    keyId: '',
    mapName: '',
  });

  useEffect(() => {
    // Fetch all maps on component mount
    getAllMaps();
  }, []);

  const getAllMaps = async () => {
  try {
    const response = await fetch('/api/Map/get-all-maps');
    console.log('Full response:', response);

    if (!response.ok) {
      throw new Error(`Failed to fetch maps: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    setMaps(data);
    console.log('Successfully got list of maps', data);
  } catch (error) {
    // console.error('Error fetching maps:', error);
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
      await fetch('/api/Map/create-new-map', {
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
      await fetch(`/api/Map/update-map/${id}`, {
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
      await fetch(`/api/Map/delete-map/${id}`, {
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
