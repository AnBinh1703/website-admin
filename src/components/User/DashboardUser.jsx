import React, { useState } from 'react';
import UserList from "../User/UserList";

function DashboardUser() {
  const [selectedComponent] = useState('users'); // Set the default component

  return (
    <div>
      <h2>User Management</h2>
      {selectedComponent === 'users' && <UserList />}
     </div>
  );
}

export default DashboardUser;
