import { ToastContainer } from "react-toastify";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import DashboardScreen from "./screens/dashboardscreen/DashboardScreen";

function App() {
  return (
    <>
      <div className="app">
        <ToastContainer position="bottom-center" limit={1} />

        <Routes>
          <Route path="/" element={<DashboardScreen />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
