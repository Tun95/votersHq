import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NotFoundScreen from "./utilities/404 error/PageNotFound";
//import LadingPageScreen from "./screens/landingpagescreen/LadingPageScreen";
import HomeScreen from "./screens/homescreen/HomeScreen";
import BillScreen from "./screens/billscreen/BillScreen";
import ElectionScreen from "./screens/electionscreen/ElectionScreen";
import BillsDetailScreen from "./screens/billsdetailscreen/BillsDetailScreen";
import ElectionViewScreen from "./screens/electionviewscreen/ElectionViewScreen";
import CandidateProfileViewScreen from "./screens/profilescreen/viewscreen/CandidateProfileViewScreen";
import DashboardScreen from "./screens/profilescreen/dashboardcreen/DashboardScreen";
import ViewUserDashboardScreen from "./screens/profilescreen/viewdashboardscreen/ViewUserDashboardScreen";
import ViewPoliticianDashboardScreen from "./screens/profilescreen/viewdashboardscreen/ViewPoliticianDashboardScreen";
import { GradientDefs } from "./utilities/component/Component";
import { AuthFlowMenu } from "./common/menus/Menus";
import ProtectedRoute from "./utilities/protectedRoute/ProtectedRoute";
import ContactScreen from "./screens/formscreens/contactscreen/ContactScreen";

function App() {
  return (
    <>
      <div className="app">
        <ToastContainer position="bottom-center" limit={1} />
        <GradientDefs />
        <AuthFlowMenu />
        <Routes>
          <Route path="*" element={<NotFoundScreen />} />
          {/* <Route path="/" element={<LadingPageScreen />} /> */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/bills" element={<BillScreen />} />
          <Route path="/bills/:slug" element={<BillsDetailScreen />} />
          <Route path="/elections" element={<ElectionScreen />} />
          <Route path="/elections/:slug" element={<ElectionViewScreen />} />

          {/* FORMS */}
          <Route path="/contact" element={<ContactScreen />} />
          {/* FORMS */}

          {/* PROFILE */}
          <Route
            path="/candidate-profile/:slug"
            element={<CandidateProfileViewScreen />}
          />
          <Route
            path="/profile-dashboard/:id"
            element={
              <ProtectedRoute>
                <DashboardScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile-view/:id"
            element={
              // <ProtectedRoute>
              <ViewUserDashboardScreen />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/politician-profile-view/:id"
            element={<ViewPoliticianDashboardScreen />}
          />
        </Routes>
      </div>{" "}
    </>
  );
}

export default App;
