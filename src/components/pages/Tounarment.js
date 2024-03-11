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
import ActivityModal from "./ActivityModal"
import HighSchoolModal from "./HighSchoolModal"
import RoundModal from "./RoundModal";
import MapModal from "./MapModal";
import TeamModal from "./TeamModal"

function ActivityType() {
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
      <div className="tournament-title">
        <h2>Activity Type</h2>
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
      <div className="tournament-title">
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
      keyId : map.keyId,
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
      <div className="map-title">
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
  return <div>Match Content</div>;
}

function Player() {
  return <div>Player Content</div>;
}

function Round() {
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
      <div className="tournament-title">
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

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [updatedTeamData, setUpdatedTeamData] = useState({
    keyId: "",
    teamName: "",
    highSchoolId: "",
    highSchoolName: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalActionType, setModalActionType] = useState("update");
  const [highSchools, setHighSchools] = useState([]);
  const [highSchoolIds, setHighSchoolIds] = useState([]); // Danh sách các ID của trường học

  useEffect(() => {
    fetchTeams();
    fetchHighSchools();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/get-all"
      );

      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      } else {
        console.error("Error fetching teams");
      }
    } catch (error) {
      console.error("Error fetching teams:", error.message);
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
        setHighSchoolIds(data.map((school) => school.highSchoolId)); // Tạo danh sách các ID của trường học
      } else {
        console.error("Error fetching high schools");
      }
    } catch (error) {
      console.error("Error fetching high schools:", error.message);
    }
  };

  const handleUpdate = (team) => {
    setSelectedTeamId(team.id);
    setUpdatedTeamData({
      keyId: team.keyId,
      teamName: team.teamName,
      highSchoolId: team.highSchoolId,
      highSchoolName: team.highSchoolName,
    });
    setShowModal(true);
    setModalActionType("update");
  };

  const handleDelete = async (teamId) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team/delete/${teamId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchTeams();
      } else {
        console.error("Error deleting team");
      }
    } catch (error) {
      console.error("Error deleting team:", error.message);
    }
  };

  const handleCreate = () => {
    setUpdatedTeamData({
      keyId: "",
      teamName: "",
      highSchoolName: "",
      highSchoolId: "",
    });
    setShowModal(true);
    setModalActionType("create");
  };

  const handleCreateSubmit = async () => {
    try {
      if (!updatedTeamData.highSchoolId) {
        console.error("HighSchoolId is required.");
        return;
      }

      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/team/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keyId: updatedTeamData.keyId,
            teamName: updatedTeamData.teamName,
            highSchoolId: updatedTeamData.highSchoolId,
          }),
        }
      );

      if (response.ok) {
        fetchTeams();
        setShowModal(false);
      } else {
        console.error("Error creating team");
      }
    } catch (error) {
      console.error("Error creating team:", error.message);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      if (!selectedTeamId) {
        console.error("No team selected for update");
        return;
      }

      if (!updatedTeamData.highSchoolId) {
        console.error("HighSchoolId is required.");
        return;
      }

      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/team/update/${selectedTeamId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keyId: updatedTeamData.keyId,
            teamName: updatedTeamData.teamName,
            highSchoolId: updatedTeamData.highSchoolId,
          }),
        }
      );

      if (response.ok) {
        fetchTeams();
        setShowModal(false);
      } else {
        console.error("Error updating team");
      }
    } catch (error) {
      console.error("Error updating team:", error.message);
    }
  };

  const handleSubmitAction = () => {
    if (modalActionType === "update") {
      handleUpdateSubmit();
    } else if (modalActionType === "create") {
      handleCreateSubmit();
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === "highSchoolName") {
      const selectedHighSchool = highSchools.find(
        (school) => school.highSchoolName === value
      );
      if (selectedHighSchool) {
        setUpdatedTeamData({
          ...updatedTeamData,
          highSchoolName: selectedHighSchool.highSchoolName,
          highSchoolId: selectedHighSchool.highSchoolId,
        });
      } else {
        setUpdatedTeamData({
          ...updatedTeamData,
          highSchoolName: "",
          highSchoolId: "", // Reset highSchoolId if no school is selected
        });
        console.error(updatedTeamData.highSchoolId);
      }
    } else {
      setUpdatedTeamData({
        ...updatedTeamData,
        [name]: value,
      });
    }
  };

  return (
    <div className="team-container">
      <div className="team-title">
        <h2>Team</h2>
      </div>
      <div className="team-list">
        {teams.map((team) => (
          <div key={team.id} className="team-item">
            <h4>{team.teamName}</h4>
            <p>Key ID: {team.keyId}</p>
            <p>High School Name: {team.highSchoolName}</p>
            <div>
              <button
                className="update-button"
                onClick={() => handleUpdate(team)}
              >
                Update
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(team.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="create-button" onClick={handleCreate}>
        Create Team
      </button>
      {showModal && (
        <TeamModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitAction}
          teamData={updatedTeamData}
          onChange={handleInputChange}
          actionType={modalActionType}
          highSchoolsUrl="https://fptbottournamentweb.azurewebsites.net/api/highSchool/get-all"
          highSchoolIds={highSchoolIds} // Truyền danh sách highSchoolIds vào modal
        />
      )}
    </div>
  );
};





function Tournament() {
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
      <div className="tournament-title">
        <h2>TOURNAMENT</h2>
      </div>
      <div className="line"></div>
      <div className="tournament-list">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="tournament-container-list">
            <div className="tournament-item">
              <p className="tour-title">{tournament.keyId}</p>
              <p className="tour-title">{tournament.tournamentName}</p>
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
  return <div>User Content</div>;
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
