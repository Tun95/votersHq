import "./styles.scss";
import logo from "../../assets/logo/logo.png";
import { Link } from "react-router-dom";
import { useAppContext } from "../../utilities/utils/Utils";
import Sidebar from "../sidebar/Sidebar";
import p1 from "../../assets/nav/p.png";

function MainNavBar() {
  const { state } = useAppContext();
  const { userInfo } = state;

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

          {userInfo && (
            <span className="a_flex span_gap">
              <div className="user_info a_flex">
                <span className="user_img_icon a_flex">
                  <div className="img">
                    <img
                      src={userInfo?.image ? userInfo?.image : p1}
                      alt="user image"
                    />
                  </div>
                </span>
              </div>

              <div className="main_sidebar">
                <Sidebar />
              </div>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainNavBar;
