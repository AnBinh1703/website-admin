import React from "react";

const TeamModal = ({
  show,
  onClose,
  onSubmit,
  teamData,
  onChange,
  actionType,
  highSchools,
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
                {highSchools.map((school) => (
                  <option key={school.highSchoolId} value={school.highSchoolId}>
                    {school.highSchoolName}
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
