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

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

function App() {
  return (
    <>
      <div className="app">
        <ToastContainer position="bottom-center" limit={1} />{" "}
        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/users" element={<UserListScreen />} />
          <Route path="/bills" element={<BillsListScreen />} />
          <Route path="/elections" element={<ElectionListScreen />} />
          <Route path="/news" element={<PoliticalNewScreen />} />
          <Route path="/bills/:id" element={<BillsEditScreen />} />{" "}
          <Route path="/elections/:id" element={<ElectionEditScreen />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
