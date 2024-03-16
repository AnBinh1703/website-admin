import React, { useEffect, useState } from 'react';

const MapList = () => {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formValid, setFormValid] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    keyId: "",
    mapName: "",
  });

  // State for handling pop-up forms
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedMapId, setSelectedMapId] = useState(null);

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleShowUpdateForm = (id) => {
    // Find the selected map based on the ID
    const selectedMap = maps.find((map) => map.id === id);

    // Set form data with the selected map's data
    setFormData({
      id: selectedMap.id,
      keyId: selectedMap.keyId,
      mapName: selectedMap.mapName,
    });

    setShowUpdateForm(true);
    setSelectedMapId(id);
  };

  const handleShowDeleteForm = (id) => {
    // Find the selected map based on the ID
    const selectedMap = maps.find((map) => map.id === id);

    // Set form data with the selected map's data
    setFormData({
      id: selectedMap.id,
      keyId: selectedMap.keyId,
      mapName: selectedMap.mapName,
    });

    setShowDeleteForm(true);
    setSelectedMapId(id);
  };

  const handleCloseForms = () => {
    setShowCreateForm(false);
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setSelectedMapId(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching maps:", error.message);
      setError("Error fetching maps. Please try again.");
      setLoading(false);
    }
  };

  const handleFetchMapById = (id) => {
    // Fetch map by ID and highlight the selected map
    const updatedMaps = maps.map((map) => ({
      ...map,
      highlighted: map.id === id,
    }));

    setMaps(updatedMaps);
    setSelectedMapId(id);
  };

  const handleCreateMap = async () => {
    try {
      // Kiểm tra xem các trường đã được điền đầy đủ hay không
      if (!formData.keyId || !formData.mapName) {
        console.error("Please fill in all fields.");
        setFormValid(false);
        return;
      }

      await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/map/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      getAllMaps();
      setFormData({
        keyId: '',
        mapName: '',
      });
      setFormValid(true);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating map:", error);
    }
  };

  const handleUpdateMap = async (id) => {
    try {
      // Kiểm tra xem các trường đã được điền đầy đủ hay không
      if (!formData.keyId || !formData.mapName) {
        console.error("Please fill in all fields.");
        setFormValid(false);
        return;
      }

      console.log("Updating map:", selectedMapId, formData);
      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/map/update/${selectedMapId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedMapId,
            keyId: formData.keyId,
            mapName: formData.mapName,
          }),
        }
      );

      getAllMaps();
      // Clear form data
      setFormData({
        keyId: '',
        mapName: '',
      });
      setFormValid(true);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating map:", error);
    }
  };

  const handleDeleteMap = async (id) => {
    try {
      console.log("Deleting map:", selectedMapId);
      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/map/delete/${selectedMapId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedMapId,
          }),
        }
      );

      getAllMaps();
      setFormData({
        id: "",
        keyId: "",
        mapName: "",
      });
      setShowDeleteForm(false);
    } catch (error) {
      console.error("Error deleting map:", error);
    }
  };

  return (
    <div>
      <h2>Map List</h2>
      {/* Buttons for Create, Update, Delete */}
      <div>
        <button className="create-button" onClick={handleShowCreateForm}>
          Create Map
        </button>
        <button
          className="update-button"
          onClick={() => selectedMapId && handleShowUpdateForm(selectedMapId)}
          disabled={!selectedMapId}
        >
          Update Map
        </button>
        <button
          className="delete-button"
          onClick={() => selectedMapId && handleShowDeleteForm(selectedMapId)}
          disabled={!selectedMapId}
        >
          Delete Map
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
              <th>KeyID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {maps.map((map) => (
              <tr
                key={map.id}
                style={{
                  backgroundColor: map.highlighted ? "gray" : "transparent",
                }}
                onClick={() => handleFetchMapById(map.id)}
              >
                <td>{map.keyId}</td>
                <td>{map.mapName}</td>
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
