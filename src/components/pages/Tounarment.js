import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  AiOutlineApartment,
  AiOutlineGroup,
  AiOutlineTeam,
  AiOutlineUser,
} from "react-icons/ai";
import { BsFlag } from "react-icons/bs";
import { FaRegMap, FaRegUserCircle } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { TbSchool } from "react-icons/tb";
import { TfiCup } from "react-icons/tfi";
import "../../App.css";
import ActivityModal from "./ActivityModal";
import "./AlertPopup"; // Assuming you have created the alert popup component
import AlertPopup from "./AlertPopup";
import "./Dashboard.css";
import HighSchoolModal from "./HighSchoolModal";
import MapModal from "./MapModal";
import Modal from "./Modal";
import "./Modal.css";
import RoundModal from "./RoundModal";
import "./Team.css";

function ActivityType() {
  const token = localStorage.getItem("token");
  const [activities, setActivities] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [updatedActivityData, setUpdatedActivityData] = useState({
    typeName: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalActionType, setModalActionType] = useState("update");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/activity-type/get-all"
      );

      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      } else {
        console.error("Error fetching activities");
      }
    } catch (error) {
      console.error("Error fetching activities:", error.message);
    }
  };

  const handleUpdate = (activity) => {
    setSelectedActivityId(activity.id);
    setUpdatedActivityData({
      typeName: activity.typeName,
    });
    setShowModal(true);
    setModalActionType("update");
  };

  const handleDelete = async (activityId) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/activity-type/delete/${activityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchActivities();
        showAlertMessage("Activity deleted successfully", "success");
      } else {
        console.error("Error deleting activity");
        showAlertMessage("Failed to delete activity", "error");
      }
    } catch (error) {
      console.error("Error deleting activity:", error.message);
      showAlertMessage("An error occurred while deleting activity", "error");
    }
  };

  const handleCreate = () => {
    setUpdatedActivityData({
      typeName: "",
    });
    setShowModal(true);
    setModalActionType("create");
  };

  const handleCreateSubmit = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/activity-type/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedActivityData),
        }
      );

      if (response.ok) {
        fetchActivities();
        setShowModal(false);
        showAlertMessage("Activity created successfully", "success");
      } else {
        console.error("Error creating activity");
        showAlertMessage("Failed to create activity", "error");
      }
    } catch (error) {
      console.error("Error creating activity:", error.message);
      showAlertMessage("An error occurred while creating activity", "error");
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/activity-type/update/${selectedActivityId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedActivityData),
        }
      );

      if (response.ok) {
        fetchActivities();
        setShowModal(false);
        showAlertMessage("Activity updated successfully", "success");
      } else {
        console.error("Error updating activity");
        showAlertMessage("Failed to update activity", "error");
      }
    } catch (error) {
      console.error("Error updating activity:", error.message);
      showAlertMessage("An error occurred while updating activity", "error");
    }
  };

  const handleSubmitAction = () => {
    if (modalActionType === "update") {
      handleUpdateSubmit();
    } else if (modalActionType === "create") {
      handleCreateSubmit();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedActivityData({
      ...updatedActivityData,
      [name]: value,
    });
  };

  const validateInput = () => {
    if (!updatedActivityData.typeName.trim()) {
      showAlertMessage("Please provide a valid activity type name", "error");
      return false;
    }
    return true;
  };

  const showAlertMessage = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <div className="tournament-container">
      <div className="team-title">
        <h2>Activity Type</h2>
      </div>
      <div className="line"></div>
      {showAlert && (
        <Alert severity={alertSeverity} onClose={handleAlertClose}>
          {alertMessage}
        </Alert>
      )}
      <div className="tournament-list">
        {activities.map((activity) => (
          <div key={activity.id} className="tournament-container-list">
            <div className="tournament-item">
              <h4>{activity.typeName}</h4>
              <div>
                <button
                  className="update-button"
                  onClick={() => handleUpdate(activity)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(activity.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="create-button" onClick={handleCreate}>
        <div className="btn-add">
          <IoAdd />
        </div>
      </button>
      <ActivityModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitAction}
        activityData={updatedActivityData}
        onChange={handleInputChange}
        actionType={modalActionType}
      />
      {showAlert && (
        <AlertPopup
          message={alertMessage}
          severity={alertSeverity}
          onClose={handleAlertClose}
        />
      )}
    </div>
  );
}

function HighSchool() {
  const token = localStorage.getItem("token");
  const [highSchools, setHighSchools] = useState([]);
  const [selectedHighSchoolId, setSelectedHighSchoolId] = useState(null);
  const [updatedHighSchoolData, setUpdatedHighSchoolData] = useState({
    keyId: "",
    highSchoolName: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalActionType, setModalActionType] = useState("update");
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    fetchHighSchools();
  }, []);

  const fetchHighSchools = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/highSchool/get-all"
      );

      if (response.ok) {
        const data = await response.json();
        setHighSchools(data);
      } else {
        console.error("Error fetching high schools");
      }
    } catch (error) {
      console.error("Error fetching high schools:", error.message);
    }
  };

  const handleUpdate = (highSchool) => {
    setSelectedHighSchoolId(highSchool.id);
    setUpdatedHighSchoolData({
      keyId: highSchool.keyId,
      highSchoolName: highSchool.highSchoolName,
    });
    setShowModal(true);
    setModalActionType("update");
  };

  const handleDelete = async (highSchoolId) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/highSchool/delete/${highSchoolId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchHighSchools();
        showAlertMessage("High school deleted successfully");
      } else {
        console.error("Error deleting high school");
        showAlertMessage("Failed to delete high school", "error");
      }
    } catch (error) {
      console.error("Error deleting high school:", error.message);
      showAlertMessage("An error occurred while deleting high school", "error");
    }
  };

  const handleCreate = () => {
    setUpdatedHighSchoolData({
      keyId: "",
      highSchoolName: "",
    });
    setShowModal(true);
    setModalActionType("create");
  };

  const handleCreateSubmit = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/highSchool/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedHighSchoolData),
        }
      );

      if (response.ok) {
        fetchHighSchools();
        setShowModal(false);
        showAlertMessage("High school created successfully");
      } else {
        console.error("Error creating high school");
        showAlertMessage("Failed to create high school", "error");
      }
    } catch (error) {
      console.error("Error creating high school:", error.message);
      showAlertMessage("An error occurred while creating high school", "error");
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/highSchool/update/${selectedHighSchoolId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedHighSchoolData),
        }
      );

      if (response.ok) {
        fetchHighSchools();
        setShowModal(false);
        showAlertMessage("High school updated successfully");
      } else {
        console.error("Error updating high school");
        showAlertMessage("Failed to update high school", "error");
      }
    } catch (error) {
      console.error("Error updating high school:", error.message);
      showAlertMessage("An error occurred while updating high school", "error");
    }
  };

  const handleSubmitAction = () => {
    if (!updatedHighSchoolData.highSchoolName.trim()) {
      showAlertMessage("Please provide a valid high school name", "error");
      return;
    }

    if (modalActionType === "update") {
      handleUpdateSubmit();
    } else if (modalActionType === "create") {
      handleCreateSubmit();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedHighSchoolData({
      ...updatedHighSchoolData,
      [name]: value,
    });
  };

  const validateInput = () => {
    if (!updatedHighSchoolData.highSchoolName.trim()) {
      showAlertMessage("Please provide a valid high school name", "error");
      return false;
    }
    return true;
  };

  const showAlertMessage = (message, severity = "success") => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000); // Hide the alert after 5 seconds
  };

  return (
    <div className="tournament-container">
      <div className="team-title">
        <h2>High Schools</h2>
      </div>
      <div className="line"></div>
      {alertMessage && <div className="alert">{alertMessage}</div>}
      <div className="tournament-list">
        {highSchools.map((highSchool) => (
          <div key={highSchool.id} className="tournament-container-list">
            <div className="tournament-item">
              <p className="tour-title">{highSchool.keyId}</p>
              <h4 className="tour-title">{highSchool.highSchoolName}</h4>
              <div>
                <button
                  className="update-button"
                  onClick={() => handleUpdate(highSchool)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(highSchool.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="create-button" onClick={handleCreate}>
        <div className="btn-add">
          <IoAdd />
        </div>
      </button>
      <HighSchoolModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitAction}
        highSchoolData={updatedHighSchoolData}
        onChange={handleInputChange}
        actionType={modalActionType}
      />
    </div>
  );
}

function Map() {
  const token = localStorage.getItem("token");
  const [maps, setMaps] = useState([]);
  const [selectedMapId, setSelectedMapId] = useState(null);
  const [updatedMapData, setUpdatedMapData] = useState({
    mapName: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalActionType, setModalActionType] = useState("update");

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/map/get-all"
      );

      if (response.ok) {
        const data = await response.json();
        setMaps(data);
      } else {
        console.error("Error fetching maps");
      }
    } catch (error) {
      console.error("Error fetching maps:", error.message);
    }
  };

  const handleUpdate = (map) => {
    setSelectedMapId(map.id);
    setUpdatedMapData({
      keyId: map.keyId,
      mapName: map.mapName,
    });
    setShowModal(true);
    setModalActionType("update");
  };

  const handleDelete = async (mapId) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/map/delete/${mapId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchMaps();
      } else {
        console.error("Error deleting map");
      }
    } catch (error) {
      console.error("Error deleting map:", error.message);
    }
  };

  const handleCreate = () => {
    setUpdatedMapData({
      keyId: "",
      mapName: "",
    });
    setShowModal(true);
    setModalActionType("create");
  };

  const handleCreateSubmit = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/map/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMapData),
        }
      );

      if (response.ok) {
        fetchMaps();
        setShowModal(false);
      } else {
        console.error("Error creating map");
      }
    } catch (error) {
      console.error("Error creating map:", error.message);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/map/update/${selectedMapId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMapData),
        }
      );

      if (response.ok) {
        fetchMaps();
        setShowModal(false);
      } else {
        console.error("Error updating map");
      }
    } catch (error) {
      console.error("Error updating map:", error.message);
    }
  };

  const handleSubmitAction = () => {
    if (modalActionType === "update") {
      handleUpdateSubmit();
    } else if (modalActionType === "create") {
      handleCreateSubmit();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMapData({
      ...updatedMapData,
      [name]: value,
    });
  };

  const validateInput = () => {
    if (!updatedMapData.mapName.trim()) {
      console.error("Please provide a valid map name");
      return false;
    }
    return true;
  };

  return (
    <div className="map-container">
      <div className="team-title">
        <h2>Maps</h2>
      </div>
      <div className="line"></div>
      <div className="tournament-list">
        {maps.map((map) => (
          <div key={map.id} className="tournament-container-list">
            <div className="tournament-item">
              <p className="tour-title">{map.keyId}</p>
              <h4 className="tour-title">{map.mapName}</h4>
              <div>
                <button
                  className="update-button"
                  onClick={() => handleUpdate(map)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(map.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="create-button" onClick={handleCreate}>
        <div className="btn-add">
          <IoAdd />
        </div>
      </button>
      <MapModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitAction}
        mapData={updatedMapData}
        onChange={handleInputChange}
        actionType={modalActionType}
      />
    </div>
  );
}

function Match() {
  const token = localStorage.getItem("token");
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    keyId: "",
    mapId: "",
    mapName: "",
    matchDate: new Date(),
    roundId: "",
    roundName: "",
    tournamentId: "",
    tournamentName: "",
  });
  const [maps, setMaps] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    getAllMatches();
    fetchMaps();
    fetchRounds();
    fetchTournaments();
  }, []);

  const getAllMatches = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/match/get-all"
      );
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches: ", error.message);
    }
  };

  const fetchMaps = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/map/get-all"
      );
      const data = await response.json();
      setMaps(data);
    } catch (error) {
      console.error("Error fetching maps: ", error.message);
    }
  };

  const fetchRounds = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/round/get-all"
      );
      const data = await response.json();
      setRounds(data);
    } catch (error) {
      console.error("Error fetching rounds: ", error.message);
    }
  };

  const fetchTournaments = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/tournament/get-all"
      );
      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      console.error("Error fetching tournaments: ", error.message);
    }
  };

  const handleShowUpdateForm = (id) => {
    const selectedMatch = matches.find((match) => match.id === id);
    setFormData({
      ...selectedMatch, // Thêm vào formData từ selectedMatch
      matchDate: new Date(selectedMatch.matchDate),
    });
    setSelectedMatchId(id);
    setShowUpdateForm(true);
  };

  const handleShowDeleteForm = (id) => {
    setSelectedMatchId(id);
    setShowDeleteForm(true);
  };

  const handleCloseForms = () => {
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setShowCreateForm(false);
    setSelectedMatchId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCalendarChange = (date) => {
    setFormData({
      ...formData,
      matchDate: date,
    });
    setShowCalendar(false);
  };

  const handleCreateMatch = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/match/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(data);

      getAllMatches();
      setFormData({
        mapId: "",
        matchDate: new Date(),
        roundId: "",
        tournamentId: "",
      });

      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };
  const validateInput = () => {
    if (!formData.keyId.trim()) {
      console.error("Please provide a valid keyId for the match.");
      return false;
    }
    if (!formData.mapId.trim()) {
      console.error("Please select a map for the match.");
      return false;
    }
    if (!formData.roundId.trim()) {
      console.error("Please select a round for the match.");
      return false;
    }
    if (!formData.tournamentId.trim()) {
      console.error("Please select a tournament for the match.");
      return false;
    }
    return true;
  };

  const handleUpdateMatch = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/match/update/${selectedMatchId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        console.error("Error updating match:", response.statusText);
        return;
      }

      getAllMatches();

      setFormData({
        keyId: "",
        mapId: "",
        mapName: "",
        matchDate: new Date(),
        roundId: "",
        roundName: "",
        tournamentId: "",
        tournamentName: "",
      });
      setSelectedMatchId(null);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating match:", error.message);
    }
  };

  const handleDeleteMatch = async () => {
    try {
      if (!selectedMatchId) {
        console.error("No match selected for deletion.");
        return;
      }

      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/match/delete/${selectedMatchId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      getAllMatches();
      setFormData({
        keyId: "",
        mapId: "",
        mapName: "",
        matchDate: new Date(),
        roundId: "",
        roundName: "",
        tournamentId: "",
        tournamentName: "",
      });
      setShowDeleteForm(false);
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  return (
    <div>
      <div className="team-title">
        <h2>Match</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>KeyId Match</th>
            <th>Match Date</th>
            <th>Round Name</th>
            <th>Tournament Name</th>
            <th>Action Type</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td>{match.keyId}</td>
              <td>{new Date(match.matchDate).toLocaleString()}</td>
              <td>{match.roundName}</td>
              <td>{match.tournamentName}</td>
              <td>
                <button
                  className="button btn-update"
                  onClick={() => handleShowUpdateForm(match.id)}
                >
                  Update
                </button>
                <button
                  className="button btn-delete"
                  onClick={() => handleShowDeleteForm(match.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="create-button" onClick={() => setShowCreateForm(true)}>
        Create Match
      </button>

      {showUpdateForm && (
        <div className="popup-form show">
          <h3>Update Match</h3>
          <label>KeyId Match:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Map Name:</label>
          <select
            name="mapId"
            value={formData.mapId}
            onChange={handleInputChange}
          >
            <option value="">Select Map</option>
            {maps.map((map) => (
              <option key={map.id} value={map.id}>
                {map.mapName}
              </option>
            ))}
          </select>
          <label>Match Date:</label>
          <div className="calendar-wrapper">
            <input
              type="text"
              className="date-input"
              value={formData.matchDate.toLocaleString()}
              readOnly
              onClick={() => setShowCalendar(true)}
            />
            {showCalendar && (
              <Calendar
                onChange={handleCalendarChange}
                value={formData.matchDate}
                onClose={() => setShowCalendar(false)}
                className="custom-calendar"
              />
            )}
          </div>
          <label>Round Name:</label>
          <select
            name="roundId"
            value={formData.roundId}
            onChange={handleInputChange}
          >
            <option value="">Select Round</option>
            {rounds.map((round) => (
              <option key={round.id} value={round.id}>
                {round.roundName}
              </option>
            ))}
          </select>
          <label>Tournament Name:</label>
          <select
            name="tournamentId"
            value={formData.tournamentId}
            onChange={handleInputChange}
          >
            <option value="">Select Tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.tournamentName}
              </option>
            ))}
          </select>
          <button className="button btn-update" onClick={handleUpdateMatch}>
            Update
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Close
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="popup-form show">
          <h3>Create New Match</h3>
          <label>KeyId Match:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Map ID:</label>
          <select name="mapId" onChange={handleInputChange}>
            <option value="">Select Map</option>
            {maps.map((map) => (
              <option key={map.id} value={map.id}>
                {map.mapName}
              </option>
            ))}
          </select>
          <label>Match Date:</label>
          <div>
            <input
              type="text"
              value={formData.matchDate.toLocaleString()}
              onClick={() => setShowCalendar(true)}
            />
            {showCalendar && (
              <Calendar
                onChange={handleCalendarChange}
                value={formData.matchDate}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </div>
          <label>Round ID:</label>
          <select name="roundId" onChange={handleInputChange}>
            <option value="">Select Round</option>
            {rounds.map((round) => (
              <option key={round.id} value={round.id}>
                {round.roundName}
              </option>
            ))}
          </select>
          <label>Tournament ID:</label>
          <select name="tournamentId" onChange={handleInputChange}>
            <option value="">Select Tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.tournamentName}
              </option>
            ))}
          </select>
          <button className="button btn-create" onClick={handleCreateMatch}>
            Create
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Close
          </button>
        </div>
      )}

      {showDeleteForm && (
        <div className="popup-form show">
          <h3>Delete Player</h3>
          <p>Are you sure you want to delete this team?</p>
          <button className="button btn-delete" onClick={handleDeleteMatch}>
            Delete
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function Player() {
  const token = localStorage.getItem("token");
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: new Date(),
    keyId: "",
    teamId: "",
    teamName: "",
  });
  const [teams, setteams] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    getAllPlayers();
    fetchTeams();
  }, []);

  const getAllPlayers = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/player/get-all"
      );
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching players: ", error.message);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/get-all",
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setteams(data);
    } catch (error) {
      console.error("Error fetching teams: ", error.message);
    }
  };

  const handleShowUpdateForm = (id) => {
    const selectedPlayer = players.find((player) => player.id === id);
    setFormData({
      name: selectedPlayer.name,
      dob: new Date(selectedPlayer.dob),
      keyId: selectedPlayer.keyId,
      teamId: selectedPlayer.teamId,
      teamName: selectedPlayer.teamName,
    });
    setSelectedPlayerId(id);
    setShowUpdateForm(true);
  };

  const handleShowDeleteForm = (id) => {
    setSelectedPlayerId(id);
    setShowDeleteForm(true);
  };

  const handleCloseForms = () => {
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setShowCreateForm(false);
    setSelectedPlayerId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "teamName") {
      // Tìm teamId dựa trên teamName và cập nhật giá trị cho teamId
      const selectedTeam = teams.find((team) => team.teamName === value);
      setFormData({
        ...formData,
        teamId: selectedTeam ? selectedTeam.id : "", // Nếu tìm thấy, lấy teamId, nếu không, gán giá trị rỗng
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCreatePlayer = async () => {
    if (!validateInput()) return;
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/player/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(data);

      getAllPlayers();
      setFormData({
        name: "",
        dob: new Date(),
        keyId: "",
        teamId: "",
        teamName: "",
      });

      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating player:", error);
    }
  };

  const handleUpdatePlayer = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/player/update/${selectedPlayerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        console.error("Error updating player:", response.statusText);
        return;
      }

      getAllPlayers();

      setFormData({
        name: "",
        dob: new Date(),
        keyId: "",
        teamId: "",
        teamName: "",
      });
      setSelectedPlayerId(null);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating player:", error.message);
    }
  };

  const handleDeletePlayer = async () => {
    try {
      if (!selectedPlayerId) {
        console.error("No team selected for deletion.");
        return;
      }

      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/player/delete/${selectedPlayerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedPlayerId,
          }),
        }
      );
      getAllPlayers();
      setFormData({
        name: "",
        dob: new Date(),
        keyId: "",
        teamId: "",
        teamName: "",
      });
      setShowDeleteForm(false);
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const handleCalendarChange = (date) => {
    setFormData({
      ...formData,
      dob: date,
    });
    setShowCalendar(false);
  };
  const validateInput = () => {
    if (!formData.name.trim()) {
      console.error("Please provide a valid name for the player.");
      return false;
    }
    if (!formData.keyId.trim()) {
      console.error("Please provide a valid keyId for the player.");
      return false;
    }
    if (!formData.teamId.trim()) {
      console.error("Please select a team for the player.");
      return false;
    }
    return true;
  };
  return (
    <div>
      <div className="team-title">
        <h2>Player</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Dob</th>
            <th>KeyId</th>
            <th>TeamName</th>
            <th>Action Type</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.dob}</td>
              <td>{player.keyId}</td>
              <td>{player.teamName}</td>
              <td>
                <button
                  className="button btn-update"
                  onClick={() => handleShowUpdateForm(player.id)}
                >
                  Update
                </button>
                <button
                  className="button btn-delete"
                  onClick={() => handleShowDeleteForm(player.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="create-button" onClick={() => setShowCreateForm(true)}>
        Create Player
      </button>

      {showUpdateForm && (
        <div className="popup-form show">
          <h3>Update Player</h3>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <label>Dob:</label>
          <div className="calendar-wrapper">
            <input
              type="text"
              className="date-input"
              value={formData.dob.toDateString()}
              readOnly // Không cho phép chỉnh sửa trực tiếp giá trị ngày
              onClick={() => setShowCalendar(true)}
            />
            {showCalendar && (
              <Calendar
                onChange={handleCalendarChange}
                value={formData.dob}
                onClose={() => setShowCalendar(false)}
                className="custom-calendar"
              />
            )}
          </div>
          <label>KeyId:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Team:</label>
          <select
            name="teamId"
            value={formData.teamId}
            onChange={handleInputChange}
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
          <button className="button btn-update" onClick={handleUpdatePlayer}>
            Update
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Close
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="popup-form show">
          <h3>Create New Player</h3>
          <label>Name:</label>
          <input type="text" name="name" onChange={handleInputChange} />
          <label>Dob:</label>
          <div>
            <input
              type="text"
              value={formData.dob.toDateString()}
              onClick={() => setShowCalendar(true)}
            />
            {showCalendar && (
              <Calendar
                onChange={handleCalendarChange}
                value={formData.dob}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </div>
          <label>KeyId:</label>
          <input type="text" name="keyId" onChange={handleInputChange} />
          <label>Team:</label>
          <select
            name="teamId"
            value={formData.teamId}
            onChange={handleInputChange}
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
          <button className="button btn-create" onClick={handleCreatePlayer}>
            Create
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Close
          </button>
        </div>
      )}

      {showDeleteForm && (
        <div className="popup-form show">
          <h3>Delete Player</h3>
          <p>Are you sure you want to delete this team?</p>
          <button className="button btn-delete" onClick={handleDeletePlayer}>
            Delete
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function Round() {
  const token = localStorage.getItem("token");
  const [rounds, setRounds] = useState([]);
  const [selectedRoundId, setSelectedRoundId] = useState(null);
  const [updatedRoundData, setUpdatedRoundData] = useState({
    roundName: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalActionType, setModalActionType] = useState("update");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/round/get-all"
      );

      if (response.ok) {
        const data = await response.json();
        setRounds(data);
      } else {
        console.error("Error fetching rounds");
      }
    } catch (error) {
      console.error("Error fetching rounds:", error.message);
    }
  };

  const handleUpdate = (round) => {
    setSelectedRoundId(round.id);
    setUpdatedRoundData({
      roundName: round.roundName,
    });
    setShowModal(true);
    setModalActionType("update");
  };

  const handleDelete = async (roundId) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/round/delete/${roundId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchRounds();
      } else {
        console.error("Error deleting round");
      }
    } catch (error) {
      console.error("Error deleting round:", error.message);
    }
  };

  const handleCreate = () => {
    setUpdatedRoundData({
      roundName: "",
    });
    setShowModal(true);
    setModalActionType("create");
  };
  const validateInput = () => {
    if (!updatedRoundData.roundName.trim()) {
      setError("Round name cannot be empty");
      return false;
    }
    return true;
  };
  const handleCreateSubmit = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/round/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRoundData),
        }
      );

      if (response.ok) {
        fetchRounds();
        setShowModal(false);
      } else {
        console.error("Error creating round");
      }
    } catch (error) {
      console.error("Error creating round:", error.message);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/round/update/${selectedRoundId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRoundData),
        }
      );

      if (response.ok) {
        fetchRounds();
        setShowModal(false);
      } else {
        console.error("Error updating round");
      }
    } catch (error) {
      console.error("Error updating round:", error.message);
    }
  };

  const handleSubmitAction = () => {
    if (modalActionType === "update") {
      handleUpdateSubmit();
    } else if (modalActionType === "create") {
      handleCreateSubmit();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRoundData({
      ...updatedRoundData,
      [name]: value,
    });
  };

  return (
    <div className="tournament-container">
      <div className="team-title">
        <h2>Round</h2>
      </div>
      <div className="line"></div>
      <div className="tournament-list">
        {rounds.map((round) => (
          <div key={round.id} className="tournament-container-list">
            <div className="tournament-item">
              <h4>{round.roundName}</h4>
              <div>
                <button
                  className="update-button"
                  onClick={() => handleUpdate(round)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(round.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="create-button" onClick={handleCreate}>
        <div className="btn-add">
          <IoAdd />
        </div>
      </button>
      <RoundModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitAction}
        roundData={updatedRoundData}
        onChange={handleInputChange}
        actionType={modalActionType}
      />
    </div>
  );
}

function Team() {
  const token = localStorage.getItem("token");
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    keyId: "",
    teamName: "",
    highSchoolId: "",
  });
  const [highSchools, setHighSchools] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllTeams();
    fetchHighSchools();
  }, []);

  const getAllTeams = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/get-all"
      );
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      } else {
        setError("Error fetching teams");
      }
    } catch (error) {
      setError("Error fetching teams: " + error.message);
    }
  };

  const fetchHighSchools = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/highschool/get-all"
      );
      if (response.ok) {
        const data = await response.json();
        setHighSchools(data);
      } else {
        setError("Error fetching high schools");
      }
    } catch (error) {
      setError("Error fetching high schools: " + error.message);
    }
  };

  const handleShowUpdateForm = (id) => {
    const selectedTeam = teams.find((team) => team.id === id);
    setFormData({
      keyId: selectedTeam.keyId,
      teamName: selectedTeam.teamName,
      highSchoolId: selectedTeam.highSchoolId,
    });
    setSelectedTeamId(id);
    setShowUpdateForm(true);
  };

  const handleShowDeleteForm = (id) => {
    setSelectedTeamId(id);
    setShowDeleteForm(true);
  };

  const handleCloseForms = () => {
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setShowCreateForm(false);
    setSelectedTeamId(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateInput = () => {
    if (!formData.keyId || !formData.teamName || !formData.highSchoolId) {
      setError("All fields are required");
      return false;
    }
    // Add more validation rules if needed
    return true;
  };

  const handleCreateTeam = async () => {
    if (!validateInput()) return;
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        getAllTeams();
        setFormData({
          keyId: "",
          teamName: "",
          highSchoolId: "",
        });
        setShowCreateForm(false);
      } else {
        setError("Error creating team");
      }
    } catch (error) {
      setError("Error creating team: " + error.message);
    }
  };

  const handleUpdateTeam = async () => {
    if (!validateInput()) return;
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team/update/${selectedTeamId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        getAllTeams();
        setFormData({
          keyId: "",
          teamName: "",
          highSchoolId: "",
        });
        setSelectedTeamId(null);
        setShowUpdateForm(false);
      } else {
        setError("Error updating team");
      }
    } catch (error) {
      setError("Error updating team: " + error.message);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      if (!selectedTeamId) {
        setError("No team selected for deletion.");
        return;
      }

      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team/delete/${selectedTeamId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedTeamId,
          }),
        }
      );

      if (response.ok) {
        getAllTeams();
        setFormData({
          keyId: "",
          teamName: "",
          highSchoolId: "",
        });
        setShowDeleteForm(false);
      } else {
        setError("Error deleting team");
      }
    } catch (error) {
      setError("Error deleting team: " + error.message);
    }
  };

  return (
    <div>
      <div className="team-title">
        <h2>Teams</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>High School Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td>{team.keyId}</td>
              <td>{team.teamName}</td>
              <td>{team.highSchoolName}</td>
              <td>
                <button
                  className="button btn-update"
                  onClick={() => handleShowUpdateForm(team.id)}
                >
                  Update
                </button>
                <button
                  className="button btn-delete"
                  onClick={() => handleShowDeleteForm(team.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="create-button" onClick={() => setShowCreateForm(true)}>
        Create Team
      </button>

      {showUpdateForm && (
        <div className="popup-form show">
          <h3>Update Team</h3>
          <label>ID:</label>
          <input
            type="text"
            name="keyId"
            value={formData.keyId}
            onChange={handleInputChange}
          />
          <label>Name:</label>
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleInputChange}
          />
          <label>High School:</label>
          <select
            name="highSchoolId"
            value={formData.highSchoolId}
            onChange={handleInputChange}
          >
            <option value="">Select High School</option>
            {highSchools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.highSchoolName}
              </option>
            ))}
          </select>
          <button className="button btn-update" onClick={handleUpdateTeam}>
            Update
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Close
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="popup-form show">
          <h3>Create New Team</h3>
          <label>ID:</label>
          <input type="text" name="keyId" onChange={handleInputChange} />
          <label>Name:</label>
          <input type="text" name="teamName" onChange={handleInputChange} />
          <label>High School:</label>
          <select
            name="highSchoolId"
            value={formData.highSchoolId}
            onChange={handleInputChange}
          >
            <option value="">Select High School</option>
            {highSchools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.highSchoolName}
              </option>
            ))}
          </select>
          <button className="button btn-create" onClick={handleCreateTeam}>
            Create
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Close
          </button>
        </div>
      )}

      {showDeleteForm && (
        <div className="popup-form show">
          <h3>Delete Team</h3>
          <p>Are you sure you want to delete this team?</p>
          <button className="button btn-delete" onClick={handleDeleteTeam}>
            Delete
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function Tournament() {
  const token = localStorage.getItem("token");
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [updatedTournamentData, setUpdatedTournamentData] = useState({
    keyId: "",
    tournamentName: "",
    startDate: "",
    endDate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalActionType, setModalActionType] = useState("update");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/tournament/get-all"
      );

      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
      } else {
        console.error("Error fetching tournaments");
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error.message);
    }
  };

  const handleUpdate = (tournament) => {
    setSelectedTournamentId(tournament.id);
    setUpdatedTournamentData({
      keyId: tournament.keyId,
      tournamentName: tournament.tournamentName,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
    });
    setShowModal(true);
    setModalActionType("update");
  };

  const handleDelete = async (tournamentId) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/tournament/delete/${tournamentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchTournaments();
      } else {
        console.error("Error deleting tournament");
      }
    } catch (error) {
      console.error("Error deleting tournament:", error.message);
    }
  };

  const handleCreate = () => {
    setUpdatedTournamentData({
      keyId: "",
      tournamentName: "",
      startDate: "",
      endDate: "",
    });
    setShowModal(true);
    setModalActionType("create");
  };

  const handleCreateSubmit = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/tournament/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTournamentData),
        }
      );

      if (response.ok) {
        fetchTournaments();
        setShowModal(false);
      } else {
        console.error("Error creating tournament");
      }
    } catch (error) {
      console.error("Error creating tournament:", error.message);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateInput()) return;

    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/tournament/update/${selectedTournamentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTournamentData),
        }
      );

      if (response.ok) {
        fetchTournaments();
        setShowModal(false);
      } else {
        console.error("Error updating tournament");
      }
    } catch (error) {
      console.error("Error updating tournament:", error.message);
    }
  };
  const validateInput = () => {
    if (
      !updatedTournamentData.keyId ||
      !updatedTournamentData.tournamentName ||
      !updatedTournamentData.startDate ||
      !updatedTournamentData.endDate
    ) {
      setError("All fields are required");
      return false;
    }
    // Additional validation logic if needed
    return true;
  };
  const handleSubmitAction = () => {
    if (modalActionType === "update") {
      handleUpdateSubmit();
    } else if (modalActionType === "create") {
      handleCreateSubmit();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTournamentData({
      ...updatedTournamentData,
      [name]: value,
    });
  };

  return (
    <div className="tournament-container">
      <div className="team-title">
        <h2>TOURNAMENT</h2>
      </div>
      <div className="line"></div>
      <div className="tournament-list">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="tournament-container-list">
            <div className="tournament-item">
              <p className="tour-title">{tournament.keyId}</p>
              <p className="">{tournament.tournamentName}</p>
              <p>
                Start Date:{" "}
                {new Date(tournament.startDate).toLocaleDateString()}
              </p>
              <p>
                End Date: {new Date(tournament.endDate).toLocaleDateString()}
              </p>
              <div>
                <button
                  className="update-button"
                  onClick={() => handleUpdate(tournament)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(tournament.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="create-button" onClick={handleCreate}>
        <div className="btn-add">
          <IoAdd />
        </div>
      </button>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitAction}
        tournamentData={updatedTournamentData}
        onChange={handleInputChange}
        actionType={modalActionType}
      />
    </div>
  );
}

function User() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    fullName: "",
    role: "Organizer",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/user/get-all"
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError("Error fetching users");
      }
    } catch (error) {
      setError("Error fetching users: " + error.message);
    }
  };

  const handleShowUpdateForm = (id) => {
    const selectedUser = users.find((user) => user.id === id);
    setFormData({
      userName: selectedUser.userName,
      userEmail: selectedUser.userEmail,
      fullName: selectedUser.fullName,
      role: selectedUser.role,
      password: selectedUser.password,
    });
    setSelectedUserId(id);
    setShowUpdateForm(true);
  };

  const handleShowDeleteForm = (id) => {
    setSelectedUserId(id);
    setShowDeleteForm(true);
  };

  const handleCloseForms = () => {
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setShowCreateForm(false);
    setSelectedUserId(null);
    setFormData({
      userName: "",
      userEmail: "",
      fullName: "",
      role: "Organizer",
      password: "",
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateUser = async () => {
    if (!validateInput()) return;
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/user/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ ...formData, role: formData.role }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors && errorData.errors.userRequestModel) {
          setError(errorData.errors.userRequestModel[0]);
        } else if (errorData.errors && errorData.errors["$.role"]) {
          setError(errorData.errors["$.role"][0]);
        } else {
          setError("An error occurred while creating the user.");
        }
        return;
      }

      const data = await response.json();
      console.log(data);

      getAllUsers();
      setFormData({
        userName: "",
        userEmail: "",
        fullName: "",
        role: "Organizer",
        password: "",
      });

      setShowCreateForm(false);
    } catch (error) {
      setError("Error creating user: " + error.message);
    }
  };

  const handleUpdateUser = async () => {
    if (!validateInput()) return;
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/user/update/${selectedUserId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, role: formData.role }),
        }
      );

      if (!response.ok) {
        console.error("Error updating user:", response.statusText);
        return;
      }

      getAllUsers();

      setFormData({
        userName: "",
        userEmail: "",
        fullName: "",
        role: "Organizer",
        password: "",
      });
      setSelectedUserId(null);
      setShowUpdateForm(false);
    } catch (error) {
      setError("Error updating user: " + error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!selectedUserId) {
        console.error("No user selected for deletion.");
        return;
      }

      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/user/delete/${selectedUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      getAllUsers();
      setFormData({
        userName: "",
        userEmail: "",
        fullName: "",
        role: "Organizer",
        password: "",
      });
      setShowDeleteForm(false);
    } catch (error) {
      setError("Error deleting user: " + error.message);
    }
  };

  const validateInput = () => {
    if (
      !formData.userName ||
      !formData.userEmail ||
      !formData.fullName ||
      !formData.password
    ) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  return (
    <div>
      <div className="user-title">
        <h2>User</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Password</th>
            <th>Role</th>
            <th>Action Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.userEmail}</td>
              <td>{user.fullName}</td>
              <td>{showPassword ? user.password : "********"}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="button btn-update"
                  onClick={() => handleShowUpdateForm(user.id)}
                >
                  Update
                </button>
                <button
                  className="button btn-delete"
                  onClick={() => handleShowDeleteForm(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="create-button" onClick={() => setShowCreateForm(true)}>
        Create User
      </button>

      {showUpdateForm && (
        <div className="popup-form show">
          <h3>Update User</h3>
          <label>Username:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
          />
          <label>Email:</label>
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleInputChange}
          />
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <label>Password:</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="Organizer">Organizer</option>
            <option value="Head Referee">Head Referee</option>
            <option value="Referee">Referee</option>
          </select>
          <label>
            Show Password:
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
          </label>

          <button className="button btn-update" onClick={handleUpdateUser}>
            Update
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Close
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="popup-form show">
          <h3>Create New User</h3>
          <label>Username:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
          />
          <label>Email:</label>
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleInputChange}
          />
          <label>Password:</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="Organizer">Organizer</option>
            <option value="Head Referee">Head Referee</option>
            <option value="Referee">Referee</option>
          </select>
          <label>
            Show Password:
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
          </label>

          <button className="button btn-create" onClick={handleCreateUser}>
            Create
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Close
          </button>
        </div>
      )}

      {showDeleteForm && (
        <div className="popup-form show">
          <h3>Delete User</h3>
          <p>Are you sure you want to delete this user?</p>
          <button className="button btn-delete" onClick={handleDeleteUser}>
            Delete
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function MainContent() {
  const [selectedTab, setSelectedTab] = useState("activity");

  const renderContent = () => {
    switch (selectedTab) {
      case "activity":
        return <ActivityType />;
      case "highschool":
        return <HighSchool />;
      case "map":
        return <Map />;
      case "match":
        return <Match />;
      case "player":
        return <Player />;
      case "round":
        return <Round />;
      case "team":
        return <Team />;
      case "tournament":
        return <Tournament />;
      case "user":
        return <User />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <ul className="sidebar-list">
          <li>
            <button onClick={() => setSelectedTab("activity")}>
              <span>
                <BsFlag />
              </span>
              ActivityType
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab("highschool")}>
              <span>
                <TbSchool />
              </span>
              HighSchool
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab("map")}>
              <span>
                <FaRegMap />
              </span>
              Map
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab("match")}>
              <span>
                <AiOutlineApartment />
              </span>
              Match
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab("player")}>
              <span>
                <AiOutlineUser />
              </span>
              Player
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab("round")}>
              <span>
                <AiOutlineGroup />
              </span>
              Round
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab("team")}>
              <span>
                <AiOutlineTeam />
              </span>
              Team
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab("tournament")}>
              <span>
                <TfiCup />
              </span>
              Tournament
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab("user")}>
              <span>
                <FaRegUserCircle />
              </span>
              User
            </button>
          </li>
        </ul>
      </nav>
      <div className="main-content">{renderContent()}</div>
    </div>
  );
}

export default MainContent;
