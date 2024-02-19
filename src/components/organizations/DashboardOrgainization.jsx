import MapList from "./MapList";
import MatchList from "./MatchList";
import RoundList from "./RoundList";
import TournamentList from "./TournamentList";

function DashboardOrgainization() {
  return (
    <div>DashboardOrgainization
 
      <h2>Organizations Management List</h2>
      <div>
      <h1>Organization Dashboard</h1>

      {/* Map List */}
      <div>
        <h2>Maps</h2>
        <MapList />
      </div>

      {/* Round List */}
      <div>
        <h2>Rounds</h2>
        <RoundList />
      </div>

      {/* Match List */}
      <div>
        <h2>Matches</h2>
        <MatchList />
      </div>

      {/* Tournament List */}
      <div>
        <h2>Tournaments</h2>
        <TournamentList />
      </div>
    </div>
  );
    </div>
  );
}


export default DashboardOrgainization;
