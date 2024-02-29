import React, { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    userName: '',
    userEmail: '',
    password: '',
    fullName: '',
    role: 0,
  });

  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getAllUsers = async () => {
    try {
      const response = await fetch('https://fptbottournamentweb.azurewebsites.net/api/User/get-all-user');
      const data = await response.json();

      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      setError('Error fetching users. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      await fetch('https://fptbottournamentweb.azurewebsites.net/api/User/create-new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Refresh user list
      getAllUsers();
      // Clear form data
      setFormData({
        id: '',
        userName: '',
        userEmail: '',
        password: '',
        fullName: '',
        role: 0,
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      await fetch(`https://fptbottournamentweb.azurewebsites.net/api/User/update-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Refresh user list
      getAllUsers();
      // Clear form data
      setFormData({
        id: '',
        userName: '',
        userEmail: '',
        password: '',
        fullName: '',
        role: 0,
      });
      // Deselect user
      setSelectedUserId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`https://fptbottournamentweb.azurewebsites.net/api/User/delete-user?Id=${userId}`, {
        method: 'DELETE',
      });

      // Refresh user list
      getAllUsers();
      // Clear form data
      setFormData({
        id: '',
        userName: '',
        userEmail: '',
        password: '',
        fullName: '',
        role: 0,
      });
      // Deselect user
      setSelectedUserId(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUserSelection = (userId) => {
    // Set selected user ID
    setSelectedUserId(userId);

    // Fetch user details based on the selected user ID
    const selectedUser = users.find((user) => user.id === userId);
    setFormData({
      id: selectedUser.id,
      userName: selectedUser.userName,
      userEmail: selectedUser.userEmail,
      password: '', // Exclude password for security reasons
      fullName: selectedUser.fullName,
      role: selectedUser.role,
    });
  };

  return (
    <div>
      <h2>User List</h2>
      {/* Display user data in a table or another suitable format */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          {/* Table headers */}
          <thead>
            <tr>
              <th>ID</th>
              <th>UserName</th>
              <th>UserEmail</th>
              <th>FullName</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={user.id === selectedUserId ? 'selected' : ''} onClick={() => handleUserSelection(user.id)}>
                <td>{user.id}</td>
                <td>{user.userName}</td>
                <td>{user.userEmail}</td>
                <td>{user.fullName}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={handleDeleteUser} disabled={!selectedUserId}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create User Form */}
      <div>
        <h3>Create New User</h3>
        {/* Add input fields for user data */}
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      {/* Update User Form */}
      <div>
        <h3>Update User</h3>
        {/* Add input fields for user data */}
        <button onClick={handleUpdateUser} disabled={!selectedUserId}>
          Update User
        </button>
      </div>
    </div>
  );
};

export default UserList;
