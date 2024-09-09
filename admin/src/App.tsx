import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import DashboardScreen from "./screens/dashboardscreen/DashboardScreen";
import UserListScreen from "./screens/userscreen/listscreen/UserListScreen";
import BillsListScreen from "./screens/billscreen/listscreen/BillsListScreen";

function App() {
  return (
    <>
      <div className="app">
        <ToastContainer position="bottom-center" limit={1} />{" "}
        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/users" element={<UserListScreen />} />
          <Route path="/bills" element={<BillsListScreen />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
