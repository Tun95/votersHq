import "./styles.scss";
import banner1 from "../../../assets/home/banner1.png";
import EastIcon from "@mui/icons-material/East";
import { useAppContext } from "../../../utilities/utils/Utils";

function IntroBanner() {
  const { state, showDrawer, setMenu } = useAppContext();
  const { userInfo } = state;
  //Register Menu
  const navigateToRegister = () => {
    setMenu("register");
    showDrawer();
  };

  return (
    <section className="intro_section intro_banner" id="about">
      <div className="section">
        <div className="content p_flex">
          <div className="container">
            <div className="top top_intro">
              <div className="main_header">
                <h1>
                  Simplifying <span className="yellow_text">politics</span> and
                  empowering citizen participation in government.
                </h1>
              </div>
              <div className="text">
                <p>
                  Stay updated with bills, participate in votes, and see how
                  your representatives align with your views. Your voice shapes
                  our democracy
                </p>
              </div>
              {!userInfo && (
                <div className="btn">
                  <button
                    onClick={navigateToRegister}
                    className="main_btn l_flex"
                  >
                    <p className="btn_text">Register</p>
                    <span className="icon_span">
                      <EastIcon className="icon" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="bottom ">
            <div className="img">
              <img src={banner1} alt="Window Banner" className="" />
            </div>
          </div>
        </div>
      </div>
      <div className="white">
        <div className="bottom_white"></div>
      </div>
      <div className="yellow">
        <div className="bottom_yellow"></div>
      </div>
    </section>
  );
}

export default IntroBanner;
