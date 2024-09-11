import { Helmet } from "react-helmet-async";
import MainNavBar from "../../common/main navbar/MainNavBar";
import Dashboard from "../../components/home/Dashboard";

function DashboardScreen() {
  return (
    <div className="dashboard_screen">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <MainNavBar />
      <div className="container page_background">
        <div className="content">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
