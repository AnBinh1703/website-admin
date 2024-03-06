import React, { useEffect, useState } from 'react';

const PlayerList = () => {
    const [teamOptions, setTeamOptions] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);    
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
      name:"",
      dob:"",
      keyId:"",
      teamId:"",
    });

    const[showCreateForm, setShowCreateForm] = useState(false);
    const[showUpdateForm, setShowUpdateForm] = useState(false);
    const[showDeleteForm, setShowDeleteForm] = useState(false);
    const[selectedPlayerId, setSelectedPlayerId] = useState(false);
    
    const handleShowCreateForm = () => {
      setShowCreateForm(true);
    };
    const handleShowUpdateForm = (id) => {
      setFormData({...players.find((player) => player.id === id)});
      setShowUpdateForm(true);
      setSelectedPlayerId(id);
    };
    const handleShowDeleteForm = (id) => {
      setFormData({...players.find((player) => player.id === id)});
      setShowDeleteForm(true);
      setSelectedPlayerId(id);
    };
    const handleCloseForms = () => {
      setShowCreateForm(false);
      setShowUpdateForm(false);
      setShowDeleteForm(false);
      setSelectedPlayerId(null);
    };
    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
    const getAllPlayers = async () => {
      try{
        const response = await fetch(
          "https://fptbottournamentweb.azurewebsites.net/api/player/get-all"
        );
        const data = await response.json();
        setPlayers(data);
        setLoading(false);
      } 
      catch(error){
        console.error("Error fetching players:", error.message);
        setError("Error fetching players. Please try again.");
        setLoading(false);
      }
    };
    const handleFetchPlayerById = async (id) => {
      try{
        const response = await fetch(
          `https://fptbottournamentweb.azurewebsites.net/api/player/get-by-id/${id}`
        );
        const data = await response.json();
        const updatePlayers = players.map((player) => ({
          ...player,
          hightlighted: player.id === id,
        }));
        setPlayers(updatePlayers);
        setSelectedPlayerId(id);
        setFormData(data);
      }
      catch (error)
      {
        console.error("Error fetching player by ID:", error.message);
      }
    }
    const fetchDropdownOptions = async () => {
      try{
        const response = await fetch(
          'https://fptbottournamentweb.azurewebsites.net/api/team/get-all'
        );
        const data = await response.json();
        setTeamOptions(data);
      }
      catch (error){
        console.error(`Error fetching Team options:`, error.message);
      }
    }
    useEffect(() => {
      fetchDropdownOptions();
    }, []);
    const handleCreatePlayer = async() => {
      try{
        const response = await fetch(
          `https://fptbottournamentweb.azurewebsites.net/api/player/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        console.log("Create Tournament Response:", response);
        const responseText = await response.text();
        console.log("Response Text:", responseText);
        // Refresh tournament list
        getAllPlayers();
        // Clear form data
        setFormData({
          name:"",
          dob:"",
          keyId: "",
          teamId: "",
        });
        setShowCreateForm(false);
      }catch (error){
        console.error("Error creating player:", error);
      }
    };
    const handleUpdatePlayer = async () => {
      try {
        // Kiểm tra xem các trường đã được điền đầy đủ hay không
        // if (!formData.keyId || !formData.mapName) {
        //   console.error("Please fill in all fields.");
        //   setFormValid(false);
        //   return;
        // }
  
        console.log("Updating player:", selectedPlayerId, formData);
        await fetch(
          `https://fptbottournamentweb.azurewebsites.net/api/player/update/${selectedPlayerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: selectedPlayerId,
              keyId: formData.keyId,
              name: formData.name,
              dob: formData.dob,
              teamId: formData.teamId,
            }),
          }
        );
        getAllPlayers();
        setFormData({
          id: "",
          keyId: "",
          name: "",
          dob: "",
          teamId: "",
        })
        // setFormValid(true);
        setShowUpdateForm(false);
      } catch (error) {
        console.error("Error updating player:", error);
      }
    };
    const handleDeletePlayer = async () => {
      try {
        console.log("Deleting player:", selectedPlayerId);
        await fetch(
          `https://fptbottournamentweb.azurewebsites.net/api/player/delete/${selectedPlayerId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: selectedPlayerId,
            }),
          }
        );
        getAllPlayers();
        setFormData({
          id: "",
          keyId: "",
          name: "",
          dob: "",
          teamId: "",
        })
        setShowDeleteForm(false);
      } catch (error) {
        console.error("Error deleting player:", error);
      }
    };
    useEffect(() => {
      getAllPlayers();
    }, []);
    return (   
      <div>
        <div>
          <button className="create-button" onClick={handleShowCreateForm}>
            Create Player
          </button>
          <button className="update-button" 
          onClick={() => 
            selectedPlayerId && handleShowUpdateForm(selectedPlayerId)
          } disabled = {!selectedPlayerId}>
            Update Player
          </button>
          <button className="delete-button" onClick={() => selectedPlayerId && handleShowDeleteForm(selectedPlayerId)} disabled={!selectedPlayerId}>
            Delete Player
          </button>
        </div>
        {/* Display Teams */}
        <div>
          <h3>Players</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr 
                  key={player.id} className={player.hightlighted ? "selected-row": ""} 
                  onClick={()=> handleFetchPlayerById(player.id)}
                >
                  <td>{player.keyId}</td>
                  <td>{player.name}</td>
                  <td>{new Date(player.dob).toLocaleDateString('en-GB')}</td>
                  <td>{player.teamName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {showCreateForm && (
            <div className="popup-form">
              <h3>Create New Player</h3>
              <label>Name: </label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange}/>
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange}/>
              <label>Id:</label>
              <input type="text" name="keyId" value={formData.keyId} onChange={handleInputChange}/>
              <label>Team:</label>
              <select name="teamId" value={selectedTeamId} onChange={handleInputChange}>
                <option value="">Select Team</option>
                {teamOptions.map((team) => (
                  <option key={team.id} value={team.id}>{team.teamName}</option>
                ))}
              </select>
              <button onClick={handleCreatePlayer}>Create Player</button>
              <button onClick={handleCloseForms}>Close</button>
            </div>
          )}

          {showUpdateForm && (
            <div className="popup-form">
              <h3>Update Player</h3>
              <label>Name: </label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange}/>
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange}/>
              <label>Id:</label>
              <input type="text" name="KeyId" value={formData.keyId} onChange={handleInputChange}/>
              <label>Team:</label>
              <select name="teamId" value={selectedTeamId} onChange={handleInputChange}>
                <option value="">Select Team</option>
                {teamOptions.map((team) => (
                  <option key={team.id} value={team.id}>{team.teamName}</option>
                ))}
              </select>
              <button onClick={handleUpdatePlayer}>Update Player</button>
              <button onClick={handleCloseForms}>Close</button>
            </div>
          )}

          {showDeleteForm && (
          <div className="popup-form">
            <h3>Delete Player</h3>
            <p>Are you sure you want to delete this player?</p>
            <button onClick={() => handleDeletePlayer(selectedPlayerId)} >
              Delete Player
            </button>
            <button onClick={handleCloseForms}>Cancel</button>
          </div>
      )}

        </div>
      </div>
    );   
};
export default PlayerList;    
    