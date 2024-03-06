import axios from "axios";
import React, { useEffect, useState } from "react";
import "./css/MapList.css";

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
    getAllMaps();
  }, []);

  const getAllMaps = async () => {
    try {
      const response = await axios.get(
        "https://fptbottournamentweb.azurewebsites.net/api/map/get-all"
      );
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

      await axios.get(
        "https://fptbottournamentweb.azurewebsites.net/api/map/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Refresh map list
      getAllMaps();
      // Clear form data
      setFormData({
        keyId: "",
        mapName: "",
      });
      setFormValid(true);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating map:", error);
    }
  };

  const handleUpdateMap = async () => {
    try {
      // Kiểm tra xem các trường đã được điền đầy đủ hay không
      if (!formData.keyId || !formData.mapName) {
        console.error("Please fill in all fields.");
        setFormValid(false);
        return;
      }

      console.log("Updating map:", selectedMapId, formData);
      await axios.get(
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
      setFormData({
        id: "",
        keyId: "",
        mapName: "",
      });
      setFormValid(true);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating map:", error);
    }
  };

  // ...

  const handleDeleteMap = async () => {
    try {
      console.log("Deleting map:", selectedMapId);
      await axios.get(
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

  // ...

  return (
    <div id="map-list-container">
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

      {/* Create Map Form */}
      {showCreateForm && (
        <div className="popup-form">
          <h3>Create New Map</h3>
          <label>KeyID:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Name:</label>
          <input
            type="text"
            name="mapName"
            value={formData.mapName}
            onChange={handleInputChange}
          />
          <button onClick={handleCreateMap}>Create Map</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Update Map Form */}
      {showUpdateForm && (
        <div className="popup-form">
          <h3>Update Map</h3>
          <label>KeyID:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Name:</label>
          <input
            type="text"
            name="mapName"
            value={formData.mapName}
            onChange={handleInputChange}
          />
          <button onClick={() => handleUpdateMap(selectedMapId)}>
            Update Map
          </button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}

      {/* Delete Map Confirmation */}
      {showDeleteForm && (
        <div className="popup-form">
          <h3>Delete Map</h3>
          <p>Are you sure you want to delete this map?</p>
          <button onClick={() => handleDeleteMap(selectedMapId)}>
            Delete Map
          </button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MapList;
