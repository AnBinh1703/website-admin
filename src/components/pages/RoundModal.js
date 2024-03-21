import { Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Modal.css";

const RoundModal = ({
  show,
  onClose,
  onSubmit,
  roundData,
  onChange,
  actionType,
  errorMessage,
  successMessage,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setIsError(true);
      setAlertVisible(true);
    } else if (successMessage) {
      setIsError(false);
      setAlertVisible(true);
    }

    const timer = setTimeout(() => {
      setAlertVisible(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  if (!show) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {alertVisible && (
          <Alert severity={isError ? "error" : "success"}>
            {isError ? errorMessage : successMessage}
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
