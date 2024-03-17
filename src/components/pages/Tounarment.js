import React, { useState, useEffect } from "react";
import "../../App.css";
import "./Dashboard.css";
import "./Modal.css";
import { BsFlag } from "react-icons/bs";
import { TbSchool } from "react-icons/tb";
import { FaRegMap } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import {
  AiOutlineTeam,
  AiOutlineUser,
  AiOutlineApartment,
  AiOutlineGroup,
} from "react-icons/ai";
import { TfiCup } from "react-icons/tfi";
import { FaRegUserCircle } from "react-icons/fa";
import Modal from "./Modal";
import ActivityModal from "./ActivityModal";
import HighSchoolModal from "./HighSchoolModal";
import RoundModal from "./RoundModal";
import MapModal from "./MapModal";
import "./Team.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ActivityType() {
  const token = localStorage.getItem("token");
  const [activities, setActivities] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [updatedActivityData, setUpdatedActivityData] = useState({
    typeName: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalActionType, setModalActionType] = useState("update");

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
      } else {
        console.error("Error deleting activity");
      }
    } catch (error) {
      console.error("Error deleting activity:", error.message);
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
      } else {
        console.error("Error creating activity");
      }
    } catch (error) {
      console.error("Error creating activity:", error.message);
    }
  };

  const handleUpdateSubmit = async () => {
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
      } else {
        console.error("Error updating activity");
      }
    } catch (error) {
      console.error("Error updating activity:", error.message);
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

  return (
    <div className="tournament-container">
      <div className="team-title">
        <h2>
          <BsFlag />
          Activity Type
        </h2>
      </div>
      <div className="line"></div>
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
        `https://fptbottournamentweb.azurewebsites.net/api/highSchool/delete/${highSchoolId}`, // Replace this with your API endpoint
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
      } else {
        console.error("Error deleting high school");
      }
    } catch (error) {
      console.error("Error deleting high school:", error.message);
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
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/highSchool/create", // Replace this with your API endpoint
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
      } else {
        console.error("Error creating high school");
      }
    } catch (error) {
      console.error("Error creating high school:", error.message);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/highSchool/update/${selectedHighSchoolId}`, // Replace this with your API endpoint
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
      } else {
        console.error("Error updating high school");
      }
    } catch (error) {
      console.error("Error updating high school:", error.message);
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
    setUpdatedHighSchoolData({
      ...updatedHighSchoolData,
      [name]: value,
    });
  };

  return (
    <div className="tournament-container">
      <div className="team-title">
        <h2>High Schools</h2>
      </div>
      <div className="line"></div>
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
        "https://fptbottournamentweb.azurewebsites.net/api/map/get-all" // Replace "your-api-url" with your actual API endpoint
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
        `https://fptbottournamentweb.azurewebsites.net/api/map/delete/${mapId}`, // Replace "your-api-url" with your actual API endpoint
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
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/map/create", // Replace "your-api-url" with your actual API endpoint
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
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/map/update/${selectedMapId}`, // Replace "your-api-url" with your actual API endpoint
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

  useEffect(() => {
    if (selectedTournamentId) {
      getMatchesByTournament(selectedTournamentId);
    } else {
      getAllMatches();
    }
    fetchMaps();
    fetchRounds();
    fetchTournaments();
    fetchTeams();
  }, [selectedTournamentId]);

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


  const handleShowUpdateForm = (id) => {
    const selectedMatch = matches.find((match) => match.id === id);
    setFormData({
      ...selectedMatch, // Thêm vào formData từ selectedMatch
      matchDate: new Date(selectedMatch.matchDate),
    });
    setSelectedMatchId(id);
    setShowUpdateForm(true);
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

  const handleShowDeleteForm = (id) => {
    setSelectedMatchId(id);
    setShowDeleteForm(true);
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

  const handleCloseForms = () => {
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setShowCreateForm(false);
    setSelectedMatchId(null);
    setShowTeamInMatchForm(false);
    setShowActivityForm(false);
  };

  const handleCancelForms = () => {
    setShowUpdateFormMatches(false);

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputChangeTeamInMatch = (e) => {
    const { name, value } = e.target;
    setFormDataTeamInMatch({
      ...formDataTeamInMatch,
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

  const handleUpdateMatch = async () => {
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

  const handleUpdateTeamInMatch = async () => {
  const { result, ...updatedData } = formDataTeamInMatch;

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
            <tr
              key={match.id}
              onDoubleClick={() => handleDoubleClick(match.id)}
            >
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
          </div>
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
            Add Team
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
                    <td>{new Date(activity.startTime).toLocaleString()}</td>
                    <td>{new Date(activity.endTime).toLocaleString()}</td>
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
    dob: new Date(), // Set default value to current date
    keyId: "",
    teamId: "",
    teamName: "",
  });

  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teams, setTeams] = useState([]);


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
      dob: new Date(selectedPlayer.dob), // Convert dob to Date object
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreatePlayer = async () => {
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
        dob: new Date(), // Reset dob to default value
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
        dob: new Date(), // Reset dob to default value
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
        dob: new Date(), // Reset dob to default value
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
  };

  return (
    <div>
      <div className="team-title">
        <h2>Player</h2>
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
          <label>Name:</label>
          <input type="text" name="name" onChange={handleInputChange} />
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

  const handleCreateSubmit = async () => {
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

  useEffect(() => {
    getAllTeams();
    fetchHighSchools();
  }, []);

  const getAllTeams = async () => {
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

  const fetchHighSchools = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/highschool/get-all",
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setHighSchools(data);
    } catch (error) {
      console.error("Error fetching high schools: ", error.message);
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

  const handleCreateTeam = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/create",
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

      getAllTeams();
      setFormData({
        keyId: "",
        teamName: "",
        highSchoolId: "",
      });

      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleUpdateTeam = async () => {
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

      if (!response.ok) {
        console.error("Error updating team:", response.statusText);
        return;
      }

      getAllTeams();

      setFormData({
        keyId: "",
        teamName: "",
        highSchoolId: "",
      });
      setSelectedTeamId(null);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating team:", error.message);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      if (!selectedTeamId) {
        console.error("No team selected for deletion.");
        return;
      }

      await fetch(
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
      getAllTeams();
      setFormData({
        keyId: "",
        teamName: "",
        highSchoolId: "",
      });
      setShowDeleteForm(false);
    } catch (error) {
      console.error("Error deleting team:", error);
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
        <h2>
        TOURNAMENT</h2>
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

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/user/get-all"
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users: ", error.message);
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateUser = async () => {
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
          alert(errorData.errors.userRequestModel[0]);
        } else if (errorData.errors && errorData.errors["$.role"]) {
          alert(errorData.errors["$.role"][0]);
        } else {
          alert("An error occurred while creating the user.");
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
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async () => {
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
      console.error("Error updating user:", error.message);
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
      console.error("Error deleting user:", error);
    }
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
            type={showPassword ? "text" : "password"}
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
            type={showPassword ? "text" : "password"}
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
