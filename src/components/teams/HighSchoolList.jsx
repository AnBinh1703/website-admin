import React, { useEffect, useState } from "react";

const LoadingIndicator = () => <p>Loading...</p>;

const ErrorDisplay = ({ error }) => <p style={{ color: "red" }}>{error}</p>;

const HighSchoolList = () => {
  const [highSchools, setHighSchools] = useState([]);
  const [newHighSchool, setNewHighSchool] = useState({
    keyId: "",
    highSchoolName: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedHighSchoolId, setSelectedHighSchoolId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllHighSchools();
  }, []);

  const getAllHighSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/highSchool/get-all"
      );
      const data = await response.json();
      setHighSchools(data);
    } catch (error) {
      console.error("Error fetching high schools:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleShowUpdateForm = (id) => {
    const selectedHighSchool = highSchools.find((school) => school.id === id);

    setNewHighSchool({
      keyId: selectedHighSchool.keyId,
      highSchoolName: selectedHighSchool.highSchoolName,
    });

    setShowUpdateForm(true);
    setSelectedHighSchoolId(id);
  };

  const handleShowDeleteForm = (id) => {
    setShowDeleteForm(true);
    setSelectedHighSchoolId(id);
  };

  const handleCloseForms = () => {
    setShowCreateForm(false);
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setSelectedHighSchoolId(null);
  };

  const handleInputChange = (e) => {
    setNewHighSchool({
      ...newHighSchool,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateHighSchool = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/highSchool/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newHighSchool),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to create high school. Server returned ${response.status} ${response.statusText}`
        );
      }

      // Refetch the list of high schools
      await getAllHighSchools();

      setNewHighSchool({
        keyId: "",
        highSchoolName: "",
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating high school:", error.message);
      setError("Error creating high school. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHighSchool = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/highSchool/update/${selectedHighSchoolId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newHighSchool),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update high school. Server returned ${response.status} ${response.statusText}`
        );
      }

      // Refetch the list of high schools
      await getAllHighSchools();

      setNewHighSchool({
        keyId: "",
        highSchoolName: "",
      });
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating high school:", error.message);
      setError("Error updating high school. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHighSchool = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/highSchool/delete/${selectedHighSchoolId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete high school. Server returned ${response.status} ${response.statusText}`
        );
      }

      // Refetch the list of high schools
      await getAllHighSchools();

      setNewHighSchool({
        keyId: "",
        highSchoolName: "",
      });
      setShowDeleteForm(false);
    } catch (error) {
      console.error("Error deleting high school:", error.message);
      setError("Error deleting high school. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="button-function">
        <button onClick={handleShowCreateForm}>Create High School</button>
        <button
          onClick={() =>
            selectedHighSchoolId && handleShowUpdateForm(selectedHighSchoolId)
          }
          disabled={!selectedHighSchoolId}
        >
          Update High School
        </button>
        <button
          onClick={() =>
            selectedHighSchoolId && handleShowDeleteForm(selectedHighSchoolId)
          }
          disabled={!selectedHighSchoolId}
        >
          Delete High School
        </button>
      </div>

      {loading && <LoadingIndicator />}
      {error && <ErrorDisplay error={error} />}

      {showCreateForm && (
        <div className="popup-form">
          <h2>Create High School</h2>
          <label>Key ID:</label>
          <input
            type="text"
            name="keyId"
            value={newHighSchool.keyId}
            onChange={handleInputChange}
          />
          <label>High School Name:</label>
          <input
            type="text"
            name="highSchoolName"
            value={newHighSchool.highSchoolName}
            onChange={handleInputChange}
          />
          <button onClick={handleCreateHighSchool}>Create High School</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}

      {showUpdateForm && (
        <div className="popup-form">
          <h2>Update High School</h2>
          <label>Key ID:</label>
          <input
            type="text"
            name="keyId"
            value={newHighSchool.keyId}
            onChange={handleInputChange}
          />
          <label>High School Name:</label>
          <input
            type="text"
            name="highSchoolName"
            value={newHighSchool.highSchoolName}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdateHighSchool}>Update High School</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}

      {showDeleteForm && (
        <div className="popup-form">
          <h2>Delete High School</h2>
          <p>Are you sure you want to delete this high school?</p>
          <button onClick={handleDeleteHighSchool}>Delete High School</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}

      <h1>High School List</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Key ID</th>
            <th>High School Name</th>
          </tr>
        </thead>
        <tbody>
          {highSchools.map((highSchool) => (
            <tr
              key={highSchool.id}
              onClick={() => setSelectedHighSchoolId(highSchool.id)}
              className={
                highSchool.id === selectedHighSchoolId ? "selected-row" : ""
              }
            >
              <td>{highSchool.keyId}</td>
              <td>{highSchool.highSchoolName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HighSchoolList;
