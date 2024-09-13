import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import DashboardScreen from "./screens/dashboardscreen/DashboardScreen";
import UserListScreen from "./screens/userscreen/listscreen/UserListScreen";
import BillsListScreen from "./screens/billscreen/listscreen/BillsListScreen";
import ElectionListScreen from "./screens/electionscreen/listscreen/ElectionListScreen";
import PoliticalNewScreen from "./screens/politicalnewscreen/PoliticalNewScreen";
import BillsEditScreen from "./screens/billscreen/editscreen/BillsEditScreen";
import ElectionEditScreen from "./screens/electionscreen/editscreen/ElectionEditScreen";
import LoginScreen from "./screens/formscreens/loginscreen/LoginScreen";
import RegisterScreen from "./screens/formscreens/registerscreen/RegisterScreen";
import AdminRoute from "./utilities/protectedRoute/AdminRoute";
import OtpScreen from "./screens/formscreens/otpscreen/OtpScreen";
import CreatedScreen from "./screens/formscreens/createdscreen/CreatedScreen";
import SubscriberScreen from "./screens/messagescreens/subscriberscreen/SubscriberScreen";
import UserEditScreen from "./screens/userscreen/editscreen/UserEditScreen";
import AddNewUserScreen from "./screens/userscreen/addscreen/AddNewUserScreen";
import AddNewBillScreen from "./screens/billscreen/addscreen/AddNewBillScreen";
import AddElectionScreen from "./screens/electionscreen/addscreen/AddElectionScreen";
import MessageScreen from "./screens/messagescreens/messagesmscreen/MessageScreen";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

function App() {
  return (
    <>
      <div className="app">
        <ToastContainer position="bottom-center" limit={1} />{" "}
        <Routes>
          {/* VALIDATION */}
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />{" "}
          <Route path="/otp" element={<OtpScreen />} />{" "}
          <Route path="/created" element={<CreatedScreen />} />
          {/* VALIDATION */}
          <Route
            path="/"
            element={
              <AdminRoute>
                <DashboardScreen />
              </AdminRoute>
            }
          />
          {/* USER */}
          <Route
            path="/users"
            element={
              <AdminRoute>
                <UserListScreen />
              </AdminRoute>
            }
          />{" "}
          <Route
            path="/user/new"
            element={
              <AdminRoute>
                <AddNewUserScreen />
              </AdminRoute>
            }
          />{" "}
          <Route
            path="/user/:id"
            element={
              <AdminRoute>
                <UserEditScreen />
              </AdminRoute>
            }
          />
          {/* BILLS */}
          <Route
            path="/bills"
            element={
              <AdminRoute>
                <BillsListScreen />
              </AdminRoute>
            }
          />{" "}
          <Route
            path="/bill/new"
            element={
              <AdminRoute>
                <AddNewBillScreen />
              </AdminRoute>
            }
          />{" "}
          <Route
            path="/bills/:id"
            element={
              <AdminRoute>
                <BillsEditScreen />
              </AdminRoute>
            }
          />{" "}
          {/* ELECTION */}
          <Route
            path="/elections"
            element={
              <AdminRoute>
                <ElectionListScreen />
              </AdminRoute>
            }
          />{" "}
          <Route
            path="/elections/new"
            element={
              <AdminRoute>
                <AddElectionScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/elections/:id"
            element={
              <AdminRoute>
                <ElectionEditScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/news"
            element={
              <AdminRoute>
                <PoliticalNewScreen />
              </AdminRoute>
            }
          />
          {/* MESSAGE */}
          <Route
            path="/subscribers"
            element={
              <AdminRoute>
                <SubscriberScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/message"
            element={
              <AdminRoute>
                <MessageScreen />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
