import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './css/MapList.css';
const MapList = () => {
  const [maps, setMaps] = useState([]);
  const [newMap, setNewMap] = useState({
    MapName: '',
     
  });

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await axios.get('http://localhost:3000/maps');
        setMaps(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMaps();
  }, []);

  const handleCreateMap = async () => {
    try {
      await axios.post('http://localhost:3000/maps', newMap);
      const response = await axios.get('http://localhost:3000/maps');
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
      await axios.put(`http://localhost:3000/maps/${mapId}`, updatedMapData);
      const response = await axios.get('http://localhost:3000/maps');
      setMaps(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMap = async (mapId) => {
    try {
      await axios.delete(`http://localhost:3000/maps/${mapId}`);
      const response = await axios.get('http://localhost:3000/maps');
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
              <th>Map Name</th>
               <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {maps.map((map) => (
              <tr key={map.id}>
                <td>{map.id}</td>
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
