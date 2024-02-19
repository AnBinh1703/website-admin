import axios from 'axios';
import React, { useEffect, useState } from 'react';

const MapList = () => {
  const [maps, setMaps] = useState([]);
  const [newMap, setNewMap] = useState({
    keyId: '',
    MapName: '',
  });

  const apiUrl = 'https://fptbottournamentweb.azurewebsites.net/api';

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await axios.get(`${apiUrl}/Map/get-all-maps`);
        setMaps(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMaps();
  }, [apiUrl]);

  const handleCreateMap = async () => {
    try {
      await axios.post(`${apiUrl}/Map/create-new-map`, newMap);
      const response = await axios.get(`${apiUrl}/Map/create-new-map`);
      setMaps(response.data);
      setNewMap({
        MapName: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateMap = async (mapId, updatedMapData) => {
    try {
      await axios.put(`${apiUrl}/Map/update-map/${mapId}`, updatedMapData);
      const response = await axios.get(`${apiUrl}/Map/update-map`);
      setMaps(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMap = async (mapId) => {
    try {
      await axios.delete(`${apiUrl}/Map/delete-map/${mapId}`);
      const response = await axios.get(`${apiUrl}/Map/delete-map`);
      setMaps(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Create Map */}
      <div>
        
        <h3>Create Map</h3>
        <label>Key ID:</label>
        <input
          type="text"
          value={newMap.keyId}
          onChange={(e) => setNewMap({ ...newMap, keyId: e.target.value })}
        />
        <label>Map Name:</label>
        <input
          type="text"
          value={newMap.MapName}
          onChange={(e) => setNewMap({ ...newMap, MapName: e.target.value })}
        />
        <button onClick={handleCreateMap}>Create Map</button>
      </div>

      
      {/* Display Maps */}
      <div>
        <h3>Maps</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Key ID</th>
              <th>Map Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {maps.map((map) => (
              <tr key={map.id}>
                <td>{map.id}</td>
                <td>{map.keyId}</td>
                <td>{map.MapName}</td>
                <td>
                  <button onClick={() => handleUpdateMap(map.id, { MapName: 'Updated Map Name' })}>
                    Update
                  </button>
                  <button onClick={() => handleDeleteMap(map.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MapList;