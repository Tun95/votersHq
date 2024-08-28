import "./styles.scss";
import logo from "../../../assets/logo/logo.png";
import { Link } from "react-router-dom";
import Sidebar from "../../sidebar/Sidebar";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import p1 from "../../../assets/nav/p.png";
import EastIcon from "@mui/icons-material/East";
import { useAppContext } from "../../../utilities/utils/Utils";

function MainNavBar() {
  const { state, showDrawer, setMenu } = useAppContext();
  const { userInfo } = state;

  //Login Menu
  const navigateToLogin = () => {
    setMenu("login");
    showDrawer();
  };

  //Register Menu
  const navigateToRegister = () => {
    setMenu("register");
    showDrawer();
  };
  return (
    <div className="nav_bar main_nav">
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
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/bills">Bills</Link>
              </li>
              <li>
                <Link to="/elections">Election Poll</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/news">News</Link>
              </li>
            </ul>
          </div>
          {!userInfo ? (
            <div className="btn a_flex">
              <div className="login">
                <span onClick={navigateToLogin} className="onClick_span">
                  Login
                </span>
              </div>
              <div className="register">
                <button
                  className="main_btn l_flex"
                  onClick={navigateToRegister}
                >
                  <p className="btn_text">Register</p>
                  <span className="icon_span">
                    <EastIcon className="icon" />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="user_info a_flex">
              <div className="creative">
                <small>Creative Box</small>
              </div>
              <div className="alarm_icon">
                <NotificationsActiveOutlinedIcon className="icon" />
              </div>
              <Link
                to={`/profile-dashboard/${userInfo._id}`}
                className="user_img_icon a_flex"
              >
                <div className="img">
                  <img src={p1} alt="user image" />
                </div>
                <div className="down_icon">
                  <KeyboardArrowDownOutlinedIcon className="icon" />
                </div>
              </Link>
            </div>
          )}
          <div className="main_sidebar">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainNavBar;
