import "./styles.scss";
import logo from "../../../assets/logo/logo.png";
import { Link } from "react-router-dom";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";

function Navbar() {
  return (
    <div className="nav_bar">
      <div className="container">
        <div className="content c_flex">
          <div className="logo_box">
            <Link to="/" className="logo a_flex">
              <div className="img">
                <img src={logo} alt="voters logo" />
              </div>
              <div className="logo_text">
                <h2>votersHQ</h2>
              </div>
            </Link>
          </div>
          <div className="list">
            <ul className="a_flex">
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#subscribe">Coming soon</a>
              </li>
            </ul>
          </div>
          <div className="btn">
            <a href="#subscribe" className="main_btn l_flex">
              <span className="icon_span">
                <NotificationsActiveOutlinedIcon className="icon" />
              </span>
              <p className="btn_text">Get Notified</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
