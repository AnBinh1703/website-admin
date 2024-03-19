import { Alert } from "@mui/material";
import React, { useState } from "react";
import "./Modal.css";

const RoundModal = ({
  show,
  onClose,
  onSubmit,
  roundData,
  onChange,
  actionType,
  errorMessage,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);

  if (!show) {
    return null;
  }

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleSubmit = () => {
    setAlertVisible(true);
    onSubmit();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {alertVisible && errorMessage && (
          <Alert severity="error" onClose={handleCloseAlert}>
            {errorMessage}
          </Alert>
        )}
        {actionType === "update" ? (
          <h2>Update Round</h2>
        ) : actionType === "delete" ? (
          <h2>Delete Round</h2>
        ) : actionType === "create" ? (
          <h2>Create Round</h2>
        ) : null}
        {(actionType === "update" || actionType === "create") && (
          <>
            <div className="input-group">
              <label htmlFor="roundName">Round Name:</label>
              <input
                type="text"
                id="roundName"
                name="roundName"
                value={roundData.roundName}
                onChange={onChange}
              />
            </div>
          </>
        )}
        {actionType === "delete" && (
          <p>Are you sure you want to delete this round?</p>
        )}
        <div className="modal-buttons">
          <button onClick={handleSubmit}>
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

export default RoundModal;
