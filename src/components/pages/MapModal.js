import { Alert } from "@mui/material";
import React, { useState } from "react";
import "./Modal.css";

const MapModal = ({
  show,
  onClose,
  onSubmit,
  mapData,
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
          <h2>Update Map</h2>
        ) : actionType === "delete" ? (
          <h2>Delete Map</h2>
        ) : actionType === "create" ? (
          <h2>Create Map</h2>
        ) : null}
        {(actionType === "update" || actionType === "create") && (
          <>
            <div className="input-group">
              <label htmlFor="keyId">Key Id:</label>
              <input
                type="text"
                id="keyId"
                name="keyId"
                value={mapData.keyId}
                onChange={onChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="mapName">Map Name:</label>
              <input
                type="text"
                id="mapName"
                name="mapName"
                value={mapData.mapName}
                onChange={onChange}
              />
            </div>
          </>
        )}
        {actionType === "delete" && (
          <p>Are you sure you want to delete this map?</p>
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

export default MapModal;
