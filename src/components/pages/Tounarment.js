import "@mui/lab";
import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
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

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../App.css";
import ActivityModal from "./ActivityModal";
import "./Dashboard.css";
import HighSchoolModal from "./HighSchoolModal";
import MapModal from "./MapModal";
import Modal from "./Modal";
import "./Modal.css";
import RoundModal from "./RoundModal";
import "./Team.css";
import { jwtDecode } from 'jwt-decode';

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
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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
        showAlertMessage("Error fetching activities", "error");
      }
    } catch (error) {
      console.error("Error fetching activities:", error.message);
      showAlertMessage("Error fetching activities: " + error.message, "error");
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
      } else {
        console.error("Error deleting activity");
        showAlertMessage("Failed to delete activity", "error");
      }
    } catch (error) {
      console.error("Error deleting activity:", error.message);
      showAlertMessage(
        "An error occurred while deleting activity: " + error.message,
        "error"
      );
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
        handleSuccessAlert("Activity created successfully");
      } else {
        console.error("Error creating activity");
        showAlertMessage("Failed to create activity", "error");
      }
    } catch (error) {
      console.error("Error creating activity:", error.message);
      showAlertMessage(
        "An error occurred while creating activity: " + error.message,
        "error"
      );
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
        handleSuccessAlert("Activity updated successfully");
      } else {
        console.error("Error updating activity");
        showAlertMessage("Failed to update activity", "error");
      }
    } catch (error) {
      console.error("Error updating activity:", error.message);
      showAlertMessage(
        "An error occurred while updating activity: " + error.message,
        "error"
      );
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
    setAlertMessage(""); // Reset alert message after closing
  };

  const handleSuccessAlert = (message) => {
    setShowSuccessAlert(true);
    setAlertMessage(message);

    setTimeout(() => {
      setShowSuccessAlert(false);
      setAlertMessage("");
    }, 2000); // 2 seconds
  };

  return (
    <div className="tournament-container">
      <div className="team-title">
        <h2>Activity Type</h2>
      </div>
      <div className="line"></div>
      {showSuccessAlert && (
        <Alert severity="success" onClose={handleAlertClose}>
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
      {showModal && (
        <ActivityModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitAction}
          activityData={updatedActivityData}
          onChange={handleInputChange}
          actionType={modalActionType}
          alertMessage={alertMessage}
          alertSeverity={alertSeverity}
          showAlert={showAlert}
          handleAlertClose={handleAlertClose}
          errorMessage={errorMessage}
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
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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
        showAlertMessage("Error fetching high schools", "error");
      }
    } catch (error) {
      console.error("Error fetching high schools:", error.message);
      showAlertMessage(
        "Error fetching high schools: " + error.message,
        "error"
      );
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
        setShowSuccessAlert(true); // Show success alert
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
        setShowSuccessAlert(true); // Show success alert
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
    if (!updatedHighSchoolData.keyId.trim()) {
      showAlertMessage("Please provide a valid keyId", "error");
      return false;
    }
    return true;
  };

  // Function to handle showing success alert
  const showAlertMessage = (message, severity = "success") => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertSeverity("success"); // Reset severity after hiding the alert
    }, 2000); // Hide the alert after 2 seconds
  };

  return (
    <div className="tournament-container">
      <div className="team-title">
        <h2>High Schools</h2>
      </div>
      <div className="line"></div>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>
          {alertMessage}
        </Alert>
      )}
      <div className="tournament-list">
        {highSchools.map((highSchool) => (
          <div key={highSchool.id} className="tournament-container-list">
            <div className="tournament-item">
              <h2 className="tour-title">{highSchool.keyId}</h2>
              <h5 className="">{highSchool.highSchoolName}</h5>
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
        errorMessage={alertMessage}
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
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("success");

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
        showAlertMessage("Error fetching maps", "error");
      }
    } catch (error) {
      console.error("Error fetching maps:", error.message);
      showAlertMessage("Error fetching maps: " + error.message, "error");
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
        showAlertMessage("Map deleted successfully");
      } else {
        console.error("Error deleting map");
        showAlertMessage("Failed to delete map", "error");
      }
    } catch (error) {
      console.error("Error deleting map:", error.message);
      showAlertMessage("An error occurred while deleting map", "error");
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
        showAlertMessage("Map created successfully");
      } else {
        console.error("Error creating map");
        showAlertMessage("Failed to create map", "error");
      }
    } catch (error) {
      console.error("Error creating map:", error.message);
      showAlertMessage("An error occurred while creating map", "error");
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
        showAlertMessage("Map updated successfully");
      } else {
        console.error("Error updating map");
        showAlertMessage("Failed to update map", "error");
      }
    } catch (error) {
      console.error("Error updating map:", error.message);
      showAlertMessage("An error occurred while updating map", "error");
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
    if (!updatedMapData.keyId.trim()) {
      showAlertMessage("Please provide a valid keyId", "error");
      return false;
    }
    if (!updatedMapData.mapName.trim()) {
      showAlertMessage("Please provide a valid map name", "error");
      return false;
    }
    return true;
  };

  const showAlertMessage = (message, severity = "success") => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    if (message !== null) {
      // Check if message is not null before setting a timeout
      setTimeout(() => {
        setAlertMessage(null);
        setAlertSeverity("success"); // Reset severity after hiding the alert
      }, 2000); // Hide the alert after 2 seconds
    }
  };
  return (
    <div className="map-container">
      <div className="team-title">
        <h2>Maps</h2>
      </div>
      <div className="line"></div>
      {alertMessage && alertSeverity === "success" && (
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      )}
      <div className="tournament-list">
        {maps.map((map) => (
          <div key={map.id} className="tournament-container-list">
            <div className="tournament-item">
              <h3 className="tour-title">{map.keyId}</h3>
              <h4 className="">{map.mapName}</h4>
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
        errorMessage={alertMessage} // Pass errorMessage state
      />
    </div>
  );
}

function Match() {
  const token = localStorage.getItem("token");
  const [matches, setMatches] = useState([]);
  const [teamInMatches, setTeamInMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [selectedTeamInMatchId, setSelectedTeamInMatchId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showUpdateFormMatches, setShowUpdateFormMatches] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTeamInMatchForm, setShowTeamInMatchForm] = useState(false);
  const [teamActivities, setTeamActivities] = useState([]);
  const [createTeamInMatchForm, setCreateTeamInMatchForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

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

  const [formDataTeamInMatch, setFormDataTeamInMatch] = useState({
    teamId: "",
    teamName: "",
    matchId: "",
    matchKeyId: "",
    score: 0,
    duration: "",
    result: "",
  });

  const [maps, setMaps] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [teams, setTeams] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(
    () => {
      if (selectedTournamentId) {
        getMatchesByTournament(selectedTournamentId);
      } else {
        getAllMatches();
      }
      fetchMaps();
      fetchRounds();
      fetchTournaments();
      fetchTeams();
    },
    [selectedTournamentId],
    []
  );

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
  const getMatchesByTournament = async (tournamentId) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/match/get-by-tournament-id/${tournamentId}`
      );
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches by tournament:", error.message);
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
  const fetchTeams = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/get-all"
      );
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error("Error fetching teams: ", error.message);
    }
  };

  const handleTournamentFilterChange = (selectedId) => {
    setSelectedTournamentId(selectedId);
  };
  const handleShowUpdateFormMatches = (id) => {
    const selectedMatch = teamInMatches.find(
      (teamInMatch) => teamInMatch.id === id
    );
    setFormDataTeamInMatch({
      ...selectedMatch, // Thêm vào formData từ selectedMatch
      matchDate: new Date(selectedMatch.matchDate),
    });
    setSelectedTeamInMatchId(id);
    setShowUpdateFormMatches(true);
  };
  const handleShowUpdateForm = (id) => {
    const selectedMatch = matches.find((match) => match.id === id);
    setFormData({
      ...selectedMatch,
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
    setShowTeamInMatchForm(false);
    setShowActivityForm(false);
    setAlertMessage("");
  };
  const handleCancelForms = () => {
    setShowUpdateFormMatches(false);
  };
  const handleDeleteTeamInMatch = async (id) => {
    try {
      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team-in-match/delete-team-with-id/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedTeamInMatches = teamInMatches.filter(
        (teamInMatch) => teamInMatch.id !== id
      );
      setTeamInMatches(updatedTeamInMatches);
    } catch (error) {
      console.error("Error deleting teamInMatch:", error);
    }
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
  const handleInputChangeTeamInMatch = (e) => {
    const { name, value } = e.target;
    setFormDataTeamInMatch({
      ...formDataTeamInMatch,
      [name]: value,
    });
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

      if (response.ok) {
        setAlertSeverity("success");
        setAlertMessage("Match created successfully.");
        getAllMatches();
        setFormData({
          keyId: "",
          mapId: "",
          matchDate: new Date(),
          roundId: "",
          tournamentId: "",
        });
        setShowCreateForm(false);
      } else {
        setAlertSeverity("error");
        setAlertMessage("Failed to create match. Please try again.");
      }
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };
  const handleUpdateTeamInMatch = async () => {
    const { ...updatedData } = formDataTeamInMatch;

    try {
      if (!selectedTeamInMatchId) {
        console.error("No team in match selected for update.");
        return;
      }

      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team-in-match/update-result-for-team-in-match-id/${selectedTeamInMatchId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        console.error("Error updating team in match:", response.statusText);
        return;
      }

      const updatedTeamInMatches = [...teamInMatches];
      const index = updatedTeamInMatches.findIndex(
        (teamInMatch) => teamInMatch.id === selectedTeamInMatchId
      );
      updatedTeamInMatches[index] = {
        ...updatedTeamInMatches[index],
        ...formDataTeamInMatch,
      };
      setTeamInMatches(updatedTeamInMatches);
      setShowUpdateFormMatches(false);
    } catch (error) {
      console.error("Error updating team in match:", error.message);
    }
  };

  const validateInput = () => {
    if (!formData.keyId.trim()) {
      setAlertSeverity("error");
      setAlertMessage("Please provide a valid keyId for the match.");
      return false;
    }
    if (!formData.mapId.trim()) {
      setAlertSeverity("error");
      setAlertMessage("Please select a map for the match.");
      return false;
    }
    if (!formData.roundId.trim()) {
      setAlertSeverity("error");
      setAlertMessage("Please select a round for the match.");
      return false;
    }
    if (!formData.tournamentId.trim()) {
      setAlertSeverity("error");
      setAlertMessage("Please select a tournament for the match.");
      return false;
    }
    setAlertSeverity("success");
    setAlertMessage("Input validated successfully.");
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

      if (response.ok) {
        setAlertSeverity("success");
        setAlertMessage("Match updated successfully.");
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
      } else {
        setAlertSeverity("error");
        setAlertMessage("Failed to update match. Please try again.");
      }
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

      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/match/delete/${selectedMatchId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setAlertSeverity("success");
        setAlertMessage("Match deleted successfully.");
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
      } else {
        setAlertSeverity("error");
        setAlertMessage("Failed to delete match. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };
  const handleAddTeamToMatch = async () => {
    try {
      if (!selectedMatch) {
        console.error("No match selected.");
        return;
      }

      const { teamId } = formDataTeamInMatch;
      if (!teamId) {
        console.error("No team selected.");
        return;
      }

      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team-in-match/add-team-to-match",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            matchId: selectedMatch.id,
            teamId: teamId,
          }),
        }
      );

      if (!response.ok) {
        console.error("Error adding team to match:", response.statusText);
        return;
      }

      // Refresh teamInMatches after adding a new team
      const updatedTeamInMatches = await TeamInMatch(
        selectedMatch.id
      ).getAllTeamInMatchByMatchId();
      setTeamInMatches(updatedTeamInMatches);

      // Close the form after adding the team
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error adding team to match:", error.message);
    }
  };

  const handleDoubleClick = async (id) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/match/get-by-id/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Error GET match:", response.statusText);
        return;
      }

      const matchData = await response.json(); // Await the JSON parsing
      setSelectedMatch(matchData); // Set the selected match

      const teamInMatchResponse = await TeamInMatch(
        id
      ).getAllTeamInMatchByMatchId(); // Fetch team details
      setTeamInMatches(teamInMatchResponse); // Set team details
      setShowTeamInMatchForm(true); // Show team details form
    } catch (error) {
      console.error("Error GET match:", error.message);
    }
  };

  const handleDoubleClickTeamInMatch = async (id) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team-activity/get-activities-by-team-in-match-id/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Error fetching teamInMatch details:",
          response.statusText
        );
        return;
      }

      const data = await response.json();
      setTeamActivities(data);
      setShowActivityForm(true);
    } catch (error) {
      console.error(
        "Error handling double click on teamInMatch:",
        error.message
      );
    }
  };

  const TeamInMatch = (idMatch) => {
    const token = localStorage.getItem("token");

    const getAllTeamInMatchByMatchId = async () => {
      try {
        const response = await fetch(
          `https://fptbottournamentweb.azurewebsites.net/api/team-in-match/get-all-teams-in-match-id/${idMatch}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Error updating teamInMatch:", response.statusText);
          return;
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error updating teamInMatch:", error.message);
        return null;
      }
    };

    const getUpdateTeamInMatch = async () => {
      try {
        const response = await fetch(
          `https://fptbottournamentweb.azurewebsites.net/api/team-in-match/update-result-for-team-in-match-id/${selectedTeamInMatchId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(formDataTeamInMatch),
          }
        );

        if (!response.ok) {
          console.error("Error updating team in match:", response.statusText);
          return;
        }

        setShowUpdateFormMatches(false);
      } catch (error) {
        console.error("Error updating team in match:", error.message);
      }
    };

    return { getAllTeamInMatchByMatchId, getUpdateTeamInMatch };
  };
  return (
    <div>
      <div className="team-title">
        <h2>Match</h2>
        <div className="select-filter">
          <select
            onChange={(e) => handleTournamentFilterChange(e.target.value)}
          >
            <option value="">All Tournaments</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.tournamentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {alertMessage && alertSeverity === "success" && (
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      )}
      <table>
        <thead>
          <tr>
            <th>KeyId Match</th>
            <th>Match Date</th>
            <th>Round Name</th>
            <th>Map Name</th>
            <th>Tournament Name</th>
            <th>Action Type</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr
              key={match.id}
              onDoubleClick={() => handleDoubleClick(match.id)}
            >
              <td>{match.keyId}</td>
              <td>{new Date(match.matchDate).toLocaleString("en-GB")} </td>
              <td>{match.roundName}</td>
              <td>{match.mapName}</td>
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
          {alertMessage && alertSeverity === "error" && (
            <Alert severity="error">{alertMessage}</Alert>
          )}
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
            <DatePicker
              selected={formData.matchDate}
              onChange={handleCalendarChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15} // Đặt khoảng thời gian giữa các mốc thời gian
              dateFormat="dd/MM/yyyy HH:mm" // Định dạng ngày và giờ
              onClick={() => setShowCalendar(true)}
              className="date-input"
            />
            {showCalendar && (
              <DatePicker
                selected={formData.matchDate}
                onChange={handleCalendarChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                onClose={() => setShowCalendar(false)}
                className="date-input"
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

      {showTeamInMatchForm && (
        <div className="popup-info">
          <div>
            <h4>TeamInMatch</h4>
            {alertMessage && alertSeverity === "success" && (
              <Alert severity={alertSeverity}>{alertMessage}</Alert>
            )}
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Match Key ID</th>
                  <th>Score</th>
                  <th>Duration</th>
                  <th>Result</th>
                  <th>Action Type</th>
                </tr>
              </thead>
              <tbody>
                {teamInMatches.map((teamInMatch) => (
                  <tr
                    key={teamInMatch.id}
                    onDoubleClick={() =>
                      handleDoubleClickTeamInMatch(teamInMatch.id)
                    }
                  >
                    <td>{teamInMatch.teamName}</td>
                    <td>{teamInMatch.matchKeyId}</td>
                    <td>{teamInMatch.score}</td>
                    <td>{teamInMatch.duration}</td>
                    <td>{teamInMatch.result}</td>
                    <td>
                      <button
                        className="button btn-update"
                        onClick={() =>
                          handleShowUpdateFormMatches(teamInMatch.id)
                        }
                      >
                        Update
                      </button>
                      <button
                        className="button btn-delete"
                        onClick={() => handleDeleteTeamInMatch(teamInMatch.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="button btn-create"
            onClick={() => setCreateTeamInMatchForm(true)}
          >
            Create
          </button>
          <button className="button btn-cancel" onClick={handleCloseForms}>
            Close
          </button>
        </div>
      )}

      {showUpdateFormMatches && (
        <div className="popup-form show">
          <h3>Update Result</h3>
          {alertMessage && alertSeverity === "error" && (
            <Alert severity="error">{alertMessage}</Alert>
          )}
          <label>Score:</label>
          <input
            type="text"
            name="score"
            value={formDataTeamInMatch.score}
            onChange={handleInputChangeTeamInMatch}
          />
          <label>Duration:</label>
          <input
            type="text"
            name="duration"
            value={formDataTeamInMatch.duration}
            onChange={handleInputChangeTeamInMatch}
          />
          <label>Result:</label>
          <select
            name="result"
            value={formDataTeamInMatch.result}
            onChange={handleInputChangeTeamInMatch}
          >
            <option value={""}>Null</option>
            <option value={"Win"}>Win</option>
            <option value={"Lose"}>Lose</option>
          </select>
          <button
            className="button btn-update"
            onClick={handleUpdateTeamInMatch}
          >
            Update
          </button>
          <button className="button btn-cancel" onClick={handleCancelForms}>
            Cancel
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="popup-form show">
          <h3>Create New Match</h3>
          {alertMessage && alertSeverity === "error" && (
            <Alert severity="error">{alertMessage}</Alert>
          )}
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
          <div className="calendar-wrapper">
            <DatePicker
              selected={formData.matchDate}
              onChange={handleCalendarChange}
              showTimeSelect // Hiển thị lựa chọn thời gian
              timeFormat="HH:mm" // Định dạng thời gian
              onClick={() => setShowCalendar(true)}
              className="date-input"
            />
            {showCalendar && (
              <DatePicker
                selected={formData.matchDate}
                onChange={handleCalendarChange}
                showTimeSelect
                timeFormat="HH:mm"
                onClose={() => setShowCalendar(false)}
                className="date-input"
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

      {createTeamInMatchForm && (
        <div className="popup-addTeamInMatch show">
          <h4>Add TeamInMatch</h4>
          {alertMessage && alertSeverity === "error" && (
            <Alert severity="error">{alertMessage}</Alert>
          )}
          <label>Match Name:</label>
          <input
            type="text"
            value={selectedMatch ? selectedMatch.keyId : ""}
            readOnly
          />
          <label>Team:</label>
          <select name="teamId" onChange={handleInputChangeTeamInMatch}>
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
          <button className="button btn-create" onClick={handleAddTeamToMatch}>
            Add
          </button>
          <button
            className="button btn-cancel"
            onClick={() => setCreateTeamInMatchForm(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {showActivityForm && (
        <div className="popup-activity show">
          <h3>Activity Detail:</h3>
          <div className="activity-table-container">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                  <th>Score</th>
                  <th>Violation</th>
                  <th>Activity Type</th>
                </tr>
              </thead>
              <tbody>
                {teamActivities.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.description}</td>
                    <td>
                      {new Date(activity.startTime).toLocaleString("en-GB")}
                    </td>
                    <td>
                      {new Date(activity.endTime).toLocaleString("en-GB")}
                    </td>
                    <td>{activity.duration}</td>
                    <td>{activity.score}</td>
                    <td>{activity.violation}</td>
                    <td>{activity.activityTypeName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="button btn-cancel"
            onClick={() => setShowActivityForm(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {showDeleteForm && (
        <div className="popup-form show">
          <h3>Delete Match</h3>
          <p>Are you sure you want to delete this match?</p>
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
  const [teams, setTeams] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

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
      setTeams(data);
    } catch (error) {
      console.error("Error fetching teams: ", error.message);
    }
  };
  const handleTeamsFilterChange = async (selectedId) => {
    if (selectedId) {
      setSelectedTeamId(selectedId); // Update selected team ID
      try {
        const response = await fetch(
          `https://fptbottournamentweb.azurewebsites.net/api/player/get-by-team-id/${selectedId}`
        );
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players by team: ", error.message);
      }
    } else {
      // If no team is selected, fetch all players
      getAllPlayers();
      setSelectedTeamId(""); // Reset selected team ID
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
      const selectedTeam = teams.find((team) => team.teamName === value);
      setFormData({
        ...formData,
        teamId: selectedTeam ? selectedTeam.id : "",
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
      setAlertMessage("Player created successfully.");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error creating player:", error);
      setAlertMessage("Failed to create player. Please try again.");
      setAlertSeverity("error");
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
      setAlertMessage("Player updated successfully.");
      setAlertSeverity("success");
      setTimeout(() => {
        setAlertSeverity("");
        setAlertMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error updating player:", error.message);
      setAlertMessage("Failed to update player. Please try again.");
      setAlertSeverity("error");
      setTimeout(() => {
        setAlertSeverity("");
        setAlertMessage("");
      }, 2000);
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
      setAlertMessage("Player deleted successfully.");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error deleting player:", error);
      setAlertMessage("Failed to delete player. Please try again.");
      setAlertSeverity("error");
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
    if (
      !formData.name.trim() ||
      !formData.keyId.trim() ||
      !formData.teamId.trim()
    ) {
      setAlertMessage("Please provide valid values for all fields.");
      setAlertSeverity("error");
      return false;
    }
    return true;
  };

  return (
    <div>
      <div className="team-title">
        <h2>Player</h2>{" "}
        <div className="select-filter">
          <select onChange={(e) => handleTeamsFilterChange(e.target.value)}>
            <option value="">All Players</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>
        {/* Display alert if validation fails */}
        {alertMessage && alertSeverity === "success" && (
          <Alert severity="sucess">{alertMessage}</Alert>
        )}{" "}
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
              <td>{new Date(player.dob).toLocaleDateString("en-GB")}</td>
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
          {alertMessage && alertSeverity === "error" && (
            <Alert severity="error">{alertMessage}</Alert>
          )}
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <label>Dob:</label>
          <div className="calendar-wrapper">
            <DatePicker
              selected={formData.dob}
              onChange={handleCalendarChange}
              onClickDay={(date) => handleCalendarChange(date)}
              className="date-input"
            />
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
          {alertMessage && alertSeverity === "error" && (
            <Alert severity="error">{alertMessage}</Alert>
          )}
          <label>Name:</label>
          <input type="text" name="name" onChange={handleInputChange} />
          <label>Dob:</label>
          <div>
            <DatePicker
              selected={formData.dob}
              onChange={handleCalendarChange}
              onClick={() => setShowCalendar(true)}
              dateFormat="MMMM d, yyyy"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={15}
              peekNextMonth
              showMonthDropdown
              dropdownMode="select"
              className="date-input"
            />
            {showCalendar && (
              <div className="calendar-wrapper">
                <DatePicker
                  onChange={handleCalendarChange}
                  selected={formData.dob}
                  onClose={() => setShowCalendar(false)}
                />
              </div>
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
          <p>Are you sure you want to delete this player?</p>
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
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

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
        setAlertSeverity("success");
        setAlertMessage("Round deleted successfully.");
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
      setAlertMessage("Round name cannot be empty");
      setAlertSeverity("error");
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
        setAlertSeverity("success");
        setAlertMessage("Round created successfully.");
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
        setAlertSeverity("success");
        setAlertMessage("Round updated successfully.");
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
        {/* Display alert if there's a success message */}
        {alertMessage && <Alert severity="success">{alertMessage}</Alert>}
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
        Create Round
      </button>
      <RoundModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitAction}
        roundData={updatedRoundData}
        onChange={handleInputChange}
        actionType={modalActionType}
        errorMessage={alertMessage} // Pass the errorMessage here
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
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  useEffect(() => {
    getAllTeams();
    fetchHighSchools();
  }, []);
  useEffect(() => {
    if (alertMessage) {
      const timeout = setTimeout(() => {
        setAlertMessage("");
        setAlertSeverity("error");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [alertMessage]);

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
        "https://fptbottournamentweb.azurewebsites.net/api/highschool/get-all",
        {
          method: "GET",
        }
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
    setAlertMessage("");
    setAlertSeverity("error");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateInput = () => {
    if (!formData.keyId || !formData.teamName || !formData.highSchoolId) {
      setAlertMessage("All fields are required");
      setAlertSeverity("error");
      return false;
    }
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
        setAlertMessage("Team created successfully");
        setAlertSeverity("success");
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
        setAlertMessage("Team updated successfully");
        setAlertSeverity("success");
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
        setAlertMessage("Team deleted successfully");
        setAlertSeverity("success");
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
          {error && <Alert severity="error">{error}</Alert>}
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
          {alertMessage && (
            <Alert severity={alertSeverity}>{alertMessage}</Alert>
          )}
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
          {error && <Alert severity="error">{error}</Alert>}
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
          {alertMessage && (
            <Alert severity={alertSeverity}>{alertMessage}</Alert>
          )}
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
  const [matches, setMatches] = useState([]);
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
  const [createFormError, setCreateFormError] = useState("");
  const [updateFormError, setUpdateFormError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  useEffect(() => {
    fetchTournaments();
  }, []);
  useEffect(() => {
    if (alertMessage) {
      const timeout = setTimeout(() => {
        setAlertMessage("");
        setAlertSeverity("error");
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [alertMessage]);
  useEffect(() => {
    if (selectedTournamentId) {
      fetchMatchesByTournamentId(selectedTournamentId);
    }
  }, [selectedTournamentId]);

  useEffect(() => {
    if (alertMessage) {
      const timeout = setTimeout(() => {
        setAlertMessage("");
        setAlertSeverity("error");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [alertMessage]);

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

  const fetchMatchesByTournamentId = async (tournamentId) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/match/get-by-tournament-id/${tournamentId}`
      );

      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      } else {
        console.error("Error fetching matches");
      }
    } catch (error) {
      console.error("Error fetching matches:", error.message);
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
    setUpdateFormError(""); // Clear update form error when opening the modal
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
        setAlertMessage("Tournament deleted successfully");
        setAlertSeverity("success");
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
    setCreateFormError(""); // Clear create form error when opening the modal
  };

  const handleCreateSubmit = async () => {
    if (!validateInput(updatedTournamentData)) {
      setCreateFormError("All fields are required");
      return;
    }

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
        setAlertMessage("Tournament created successfully");
        setAlertSeverity("success");
      } else {
        console.error("Error creating tournament");
      }
    } catch (error) {
      console.error("Error creating tournament:", error.message);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateInput(updatedTournamentData)) {
      setUpdateFormError("All fields are required");
      return;
    }

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
        setAlertMessage("Tournament updated successfully");
        setAlertSeverity("success");
      } else {
        console.error("Error updating tournament");
      }
    } catch (error) {
      console.error("Error updating tournament:", error.message);
    }
  };

  const validateInput = (data) => {
    return (
      data.keyId.trim() !== "" &&
      data.tournamentName.trim() !== "" &&
      data.startDate.trim() !== "" &&
      data.endDate.trim() !== ""
    );
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
        {/* Error alert for main screen */}
        {alertMessage && alertSeverity === "success" && (
          <Alert severity={alertSeverity}>{alertMessage}</Alert>
        )}
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
                {new Date(tournament.startDate).toLocaleDateString("en-GB")}
              </p>
              <p>
                End Date:{" "}
                {new Date(tournament.endDate).toLocaleDateString("en-GB")}
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
        createFormError={createFormError}
        updateFormError={updateFormError}
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
  // const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const decodedToken = jwtDecode(token); // Decoding the JWT token
  const userRole = decodedToken.role; // Assuming 'role' is the key for role information in the token payload
  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (alertMessage) {
      const timeout = setTimeout(() => {
        setAlertMessage("");
        setAlertSeverity("error");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [alertMessage]);

  
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
    const userToDelete = users.find((user) => user.id === id);

    if (userToDelete.role === "Organizer") {
      setAlertMessage("You cannot delete an organizer user.");
      setAlertSeverity("error");
    } else {
      setSelectedUserId(id);
      setShowDeleteForm(true);
    }
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
    setAlertMessage("");
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
          setAlertMessage(errorData.errors.userRequestModel[0]);
        } else if (errorData.errors && errorData.errors["$.role"]) {
          setAlertMessage(errorData.errors["$.role"][0]);
        } else {
          setAlertMessage("An error occurred while creating the user.");
        }
        setAlertSeverity("error");
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
      setAlertMessage("User created successfully");
      setAlertSeverity("success");
    } catch (error) {
      setAlertMessage("Error creating user: " + error.message);
      setAlertSeverity("error");
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
      setAlertMessage("User updated successfully");
      setAlertSeverity("success");
    } catch (error) {
      setAlertMessage("Error updating user: " + error.message);
      setAlertSeverity("error");
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
      setAlertMessage("User deleted successfully");
      setAlertSeverity("success");
    } catch (error) {
      setAlertMessage("Error deleting user: " + error.message);
      setAlertSeverity("error");
    }
  };

  const validateInput = () => {
    if (
      !formData.userName ||
      !formData.userEmail ||
      !formData.fullName ||
      !formData.password
    ) {
      setAlertMessage("All fields are required");
      setAlertSeverity("error");
      return false;
    }
    return true;
  };

  return (
    <div>
      <div className="user-title">
        <h2>User</h2>
        {alertMessage && alertSeverity === "success" && (
          <Alert severity={alertSeverity}>{alertMessage}</Alert>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
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
              <td>{user.role}</td>
              <td>
              {userRole == "Organizer" ? (
                  <>
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
                  </>
                ) : (
                  <span style={{ color: "red" }}>Not Permitted</span>
                )}
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
          {error && <Alert severity="error">{error}</Alert>}
          {alertMessage && (
            <Alert severity={alertSeverity}>{alertMessage}</Alert>
          )}
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
            type="password"
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
          {/* <label>
            Show Password:
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
          </label> */}

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
          {error && <Alert severity="error">{error}</Alert>}
          {alertMessage && (
            <Alert severity={alertSeverity}>{alertMessage}</Alert>
          )}
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
            type="password"
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
          {/* <label>
            Show Password:
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
          </label> */}

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
