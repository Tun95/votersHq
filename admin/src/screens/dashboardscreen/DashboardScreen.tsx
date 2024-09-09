import MainNavBar from "../../common/main navbar/MainNavBar";
import Dashboard from "../../components/home/Dashboard";

function DashboardScreen() {
  return (
    <div className="dashboard_screen">
      <MainNavBar />
      <div className="container">
        <div className="content">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
