import React, { useEffect, useState } from "react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    userName: "",
    userEmail: "",
    password: "",
    fullName: "",
    role: 0,
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    // Fetch the list of users on component mount
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentweb.azurewebsites.net/api/user/get-all"
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch users. Server returned ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const fetchUserById = async (id) => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/user/get-by-id/${id}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch user. Server returned ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user by ID:", error.message);
    }
  };

  const handleCreateUser = async () => {
    try {
      // Check if all required fields are filled
      if (
        !newUser.userName ||
        !newUser.userEmail ||
        !newUser.password ||
        !newUser.fullName
      ) {
        console.error("Please fill in all required fields.");
        return;
      }

      const response = await fetch(
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
        role: 0,
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `https://fptbottournamentweb.azurewebsites.net/api/user/update/${selectedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
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
        role: 0,
      });
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
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
        role: 0,
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
    <div>
      <div className="button-function">
        <button onClick={() => setShowCreateForm(true)}>Create User</button>
        <button
          onClick={() => setShowUpdateForm(true)}
          disabled={!selectedUserId}
        >
          Update User
        </button>
        <button
          onClick={() => setShowDeleteForm(true)}
          disabled={!selectedUserId}
        >
          Delete User
        </button>
      </div>

      {/* Create User Form Popup */}
      {showCreateForm && (
        <div className="popup-form">
          <h2>Create User</h2>
          <label>User Name:</label>
          <input
            type="text"
            name="userName"
            value={newUser.userName}
            onChange={handleInputChange}
          />
          <label>Email:</label>
          <input
            type="email"
            name="userEmail"
            value={newUser.userEmail}
            onChange={handleInputChange}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
          />
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={newUser.fullName}
            onChange={handleInputChange}
          />
          <label>Role:</label>
          <input
            type="number"
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
          />
          <button onClick={handleCreateUser}>Create User</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </div>
      )}

      {/* Update User Form Popup */}
      {showUpdateForm && (
        <div className="popup-form">
          <h2>Update User</h2>
          <label>User Name:</label>
          <input
            type="text"
            name="userName"
            value={newUser.userName}
            onChange={handleInputChange}
          />
          <label>Email:</label>
          <input
            type="email"
            name="userEmail"
            value={newUser.userEmail}
            onChange={handleInputChange}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
          />
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={newUser.fullName}
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
          <button onClick={() => setShowUpdateForm(false)}>Cancel</button>
        </div>
      )}

      {/* Delete User Form Popup */}
      {showDeleteForm && (
        <div className="popup-form">
          <h2>Delete User</h2>
          <p>Are you sure you want to delete this user?</p>
          <button onClick={handleDeleteUser}>Delete User</button>
          <button onClick={() => setShowDeleteForm(false)}>Cancel</button>
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
