import { Alert } from "@mui/material";
import React, { useEffect, useState } from "react";

const TeamModal = ({
  show,
  onClose,
  onSubmit,
  teamData,
  onChange,
  actionType,
  highSchoolsUrl = "https://fptbottournamentmanagement-2e9b0b503b66.herokuapp.com/api/highSchool/get-all",
}) => {
  const [highSchoolIds, setHighSchoolIds] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null); // Alert state

  useEffect(() => {
    const fetchHighSchoolId = async () => {
      try {
        const response = await fetch(highSchoolsUrl);

        if (response.ok) {
          const data = await response.json();
          setHighSchoolIds(data);
        } else {
          console.error("Error fetching high school IDs");
          showAlert("Failed to fetch high school IDs", "error"); // Show alert on error
        }
      } catch (error) {
        console.error("Error fetching high school IDs:", error.message);
        showAlert("An error occurred while fetching high school IDs", "error"); // Show alert on error
      }
    };

    fetchHighSchoolId();
  }, [highSchoolsUrl]);

  // Function to show alert
  const showAlert = (message, severity = "success") => {
    setAlertMessage({ message, severity });
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000); // Hide the alert after 5 seconds
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {/* Render alert message if exists */}
        {alertMessage && (
          <Alert severity={alertMessage.severity}>{alertMessage.message}</Alert>
        )}
        {actionType === "update" ? (
          <h2>Update Team</h2>
        ) : actionType === "delete" ? (
          <h2>Delete Team</h2>
        ) : actionType === "create" ? (
          <h2>Create Team</h2>
        ) : null}
        {(actionType === "update" || actionType === "create") && (
          <>
            <div className="input-group">
              <label htmlFor="teamName">Team Name:</label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={teamData.teamName}
                onChange={onChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="keyId">Key ID:</label>
              <input
                type="text"
                id="keyId"
                name="keyId"
                value={teamData.keyId}
                onChange={onChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="highSchoolName">High School Name:</label>
              <select
                id="highSchoolName"
                name="highSchoolName"
                value={teamData.highSchoolName}
                onChange={onChange}
              >
                <option value="">Select a high school</option>
                {highSchoolIds.map((highSchoolId) => (
                  <option key={highSchoolId} value={highSchoolId}>
                    {highSchoolId}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        {actionType === "delete" && (
          <p>Are you sure you want to delete this team?</p>
        )}
        <div className="modal-buttons">
          <button onClick={onSubmit}>
            {actionType === "update"
              ? "Update"
              : actionType === "create"
              ? "Create"
              : "Delete"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
