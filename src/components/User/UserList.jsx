import React, { useEffect, useState } from "react";
import "./UserList.css"; // Make sure to update the import path based on your project structure

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formValid, setFormValid] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    userName: "",
    userEmail: "",
    password: "",
    fullName: "",
    role: "",
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleShowUpdateForm = (id) => {
    const selectedUser = users.find((user) => user.id === id);

    setFormData({
      id: selectedUser.id,
      userName: selectedUser.userName,
      userEmail: selectedUser.userEmail,
      password: "",
      fullName: selectedUser.fullName,
      role: selectedUser.role,
    });

    setSelectedUserId(id); // Set the selectedUserId here
    setShowUpdateForm(true);
  };

  const handleShowDeleteForm = (id) => {
    const selectedUser = users.find((user) => user.id === id);

    setFormData({
      id: selectedUser.id,
      userName: selectedUser.userName,
      userEmail: selectedUser.userEmail,
      password: "",
      fullName: selectedUser.fullName,
      role: selectedUser.role,
    });

    setSelectedUserId(id); // Set the selectedUserId here
    setShowDeleteForm(true);
  };

  const handleCloseForms = () => {
    setShowCreateForm(false);
    setShowUpdateForm(false);
    setShowDeleteForm(false);
    setSelectedUserId(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/user/get-all"
      );
      const data = await response.json();

      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setError("Error fetching users. Please try again.");
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (
        !formData.userName ||
        !formData.userEmail ||
        !formData.password ||
        !formData.fullName ||
        !formData.role
      ) {
        console.error("Please fill in all fields.");
        setFormValid(false);
        return;
      }

      await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/user/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      getAllUsers();
      setFormData({
        id: "",
        userName: "",
        userEmail: "",
        password: "",
        fullName: "",
        role: 0,
      });
      setFormValid(true);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (
        !formData.userName ||
        !formData.userEmail ||
        !formData.fullName ||
        !formData.role
      ) {
        console.error("Please fill in all fields.");
        setFormValid(false);
        return;
      }

      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/user/update/${selectedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      getAllUsers();
      setFormData({
        id: "",
        userName: "",
        userEmail: "",
        password: "",
        fullName: "",
        role: 0,
      });
      setFormValid(true);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/user/delete/${selectedUserId}`,
        {
          method: "DELETE",
        }
      );

      getAllUsers();
      setFormData({
        id: "",
        userName: "",
        userEmail: "",
        password: "",
        fullName: "",
        role: 0,
      });
      setShowDeleteForm(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div id="user-list-container">
      <h2>User List</h2>
      <div>
        <button className="create-button" onClick={handleShowCreateForm}>
          Create User
        </button>
        <button
          className="update-button"
          onClick={() => selectedUserId && handleShowUpdateForm(selectedUserId)}
          disabled={!selectedUserId}
        >
          Update User
        </button>
        <button
          className="delete-button"
          onClick={() => selectedUserId && handleShowDeleteForm(selectedUserId)}
          disabled={!selectedUserId}
        >
          Delete User
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>UserName</th>
              <th>UserEmail</th>
              <th>FullName</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  backgroundColor:
                    user.id === selectedUserId ? "gray" : "transparent",
                }}
                onClick={() => setSelectedUserId(user.id)}
              >
                <td>{user.keyId}</td>
                <td>{user.userName}</td>
                <td>{user.userEmail}</td>
                <td>{user.fullName}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showCreateForm && (
        <div className="popup-form">
          <h3>Create New User</h3>
          <label>UserName:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
          />
          <label>UserEmail:</label>
          <input
            type="text"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleInputChange}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <label>FullName:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <label>Role:</label>
          <input
            type="number"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          />
          <button onClick={handleCreateUser}>Create User</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}
      {showUpdateForm && (
        <div className="popup-form">
          <h3>Update User</h3>
          <label>UserName:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
          />
          <label>UserEmail:</label>
          <input
            type="text"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleInputChange}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <label>FullName:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <label>Role:</label>
          <input
            type="number"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdateUser}>Update User</button>
          <button onClick={handleCloseForms}>Close</button>
        </div>
      )}
      {showDeleteForm && (
        <div className="popup-form">
          <h3>Delete User</h3>
          <p>Are you sure you want to delete this user?</p>
          <button onClick={handleDeleteUser}>Delete User</button>
          <button onClick={handleCloseForms}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default UserList;
