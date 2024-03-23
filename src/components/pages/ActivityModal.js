import { Alert } from "@mui/material";
import React from "react";
import "./Modal.css";

const ActivityModal = ({
  show,
  onClose,
  onSubmit,
  activityData,
  onChange,
  actionType,
  alertMessage,
  alertSeverity,
  showAlert,
  handleAlertClose,
  errorMessage, // Thêm state để lưu trữ thông báo lỗi
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {showAlert && ( // Hiển thị thông báo lỗi
          <Alert severity="error" onClose={handleAlertClose}>
            {alertMessage}
          </Alert>
        )}
        {actionType === "update" ? (
          <h2>Update Activity</h2>
        ) : actionType === "delete" ? (
          <h2>Delete Activity</h2>
        ) : actionType === "create" ? (
          <h2>Create Activity</h2>
        ) : null}
        {(actionType === "update" || actionType === "create") && (
          <>
            <div className="input-group">
              <label htmlFor="typeName">Activity Name:</label>
              <input
                type="text"
                id="typeName"
                name="typeName"
                value={activityData.typeName}
                onChange={onChange}
              />
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
          </>
        )}

        {actionType === "delete" && (
          <p>Are you sure you want to delete this activity?</p>
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

export default ActivityModal;
