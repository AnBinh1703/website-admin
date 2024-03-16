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

  useEffect(() => {
    getAllUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/user/get-all?searchKey=${searchKey}`
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
          body: JSON.stringify({
            userRequestModel: {
              userName: newUser.userName,
              userEmail: newUser.userEmail,
              password: newUser.password,
              fullName: newUser.fullName,
            },
            role: newUser.role,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to create user. Server returned ${response.status} ${response.statusText}: ${errorText}`
        );
        throw new Error(
          `Failed to create user. Server returned ${response.status} ${response.statusText}: ${errorText}`
        );
      }

      await fetchUsers();
      setNewUser({
        userName: "",
        userEmail: "",
        password: "",
        fullName: "",
        role: "",
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

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          console.error("Validation Errors:", errorData);
        }
        throw new Error(
          `Failed to update user. Server returned ${response.status} ${response.statusText}`
        );
      }

      await fetchUsers();
      setNewUser({
        userName: "",
        userEmail: "",
        password: "",
        fullName: "",
        role: "",
      });
      setFormValid(true);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating user:", error.message);
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

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          console.error("Validation Errors:", errorData);
        }
        throw new Error(
          `Failed to delete user. Server returned ${response.status} ${response.statusText}`
        );
      }

      await fetchUsers();
      setNewUser({
        userName: "",
        userEmail: "",
        password: "",
        fullName: "",
        role: "",
      });
      setShowDeleteForm(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRowClick = async (id) => {
    try {
      const data = await fetchUserById(id);

      const updatedUsers = users.map((user) => ({
        ...user,
        highlighted: user.id === id,
      }));

      setUsers(updatedUsers);
      setSelectedUserId(id);
      setNewUser({
        userName: data.userName,
        userEmail: data.userEmail,
        password: data.password,
        fullName: data.fullName,
        role: data.role,
      });
    } catch (error) {
      console.error("Error handling row click:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
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
        <div className="search-bar">
          <label>Search:</label>
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button onClick={() => fetchUsers(searchKey)}>Search</button>
        </div>
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
            value={newUser.role}
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

      <h1>User List</h1>
      <table border="1">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => handleRowClick(user.id)}
              className={user.highlighted ? "selected-row" : ""}
            >
              <td>{user.userName}</td>
              <td>{user.fullName}</td>
              <td>{user.userEmail}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
