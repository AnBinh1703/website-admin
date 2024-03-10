import React from "react";
import "./Modal.css";

const Modal = ({
  show,
  onClose,
  onSubmit,
  tournamentData,
  onChange,
  actionType,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          ×
        </span>
        {actionType === "update" ? (
          <h2>Update Tournament</h2>
        ) : actionType === "delete" ? (
          <h2>Delete Tournament</h2>
        ) : actionType === "create" ? (
          <h2>Create Tournament</h2>
        ) : null}
        {(actionType === "update" || actionType === "create") && (
          <>
            <div className="input-group">
              <label htmlFor="keyId">Key ID:</label>
              <input
                type="text"
                id="keyId"
                name="keyId"
                value={tournamentData.keyId}
                onChange={onChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="tournamentName">Tournament Name:</label>
              <input
                type="text"
                id="tournamentName"
                name="tournamentName"
                value={tournamentData.tournamentName}
                onChange={onChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={tournamentData.startDate}
                onChange={onChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={tournamentData.endDate}
                onChange={onChange}
              />
            </div>
          </>
        )}
        {actionType === "delete" && (
          <p>Are you sure you want to delete this tournament?</p>
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



export default Modal;
