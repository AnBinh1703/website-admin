import { Route, Routes } from "react-router-dom";
import TeamList from "./TeamList";

function DashboardTeam() {
  return (
    <div>
      <h2>Team Management</h2>
      <Routes>
        <Route exact path="/teams" component={TeamList} />
      </Routes>
    </div>
  );
}

export default DashboardTeam;
