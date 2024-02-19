import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Dashboard />
    </Router>
  );
}

export default App;
