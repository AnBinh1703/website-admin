import { Alert } from "@mui/material";
import React from "react";
import "./Modal.css";

const HighSchoolModal = ({
  show,
  onClose,
  onSubmit,
  highSchoolData,
  onChange,
  actionType,
  errorMessage,
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
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {actionType === "update" ? (
          <h2>Update High School</h2>
        ) : actionType === "delete" ? (
          <h2>Delete High School</h2>
        ) : actionType === "create" ? (
          <h2>Create High School</h2>
        ) : null}
        {(actionType === "update" || actionType === "create") && (
          <>
            <div className="input-group">
              <label htmlFor="keyId">Key ID:</label>
              <input
                type="text"
                id="keyId"
                name="keyId"
                value={highSchoolData.keyId}
                onChange={onChange}
              />
              <label htmlFor="highSchoolName">High School Name:</label>
              <input
                type="text"
                id="highSchoolName"
                name="highSchoolName"
                value={highSchoolData.highSchoolName}
                onChange={onChange}
              />
            </div>
          </>
        )}
        {actionType === "delete" && (
          <p>Are you sure you want to delete this high school?</p>
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

export default HighSchoolModal;
