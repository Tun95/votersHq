import "./styles.scss";
import logo from "../../../assets/logo/logo.png";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function LandingFooter() {
  return (
    <footer className="landing_footer">
      <div className="upper_box">
        <div className="container">
          <div className="content f_flex">
            <div className="left">
              <div className="logo_text a_flex">
                <div className="logo">
                  <img src={logo} alt="VotersHQ" />
                </div>
                <div className="text">
                  <h1>votersHQ</h1>
                </div>
              </div>
              <div className="description">
                <small>
                  Democratizing access to political information and
                  participation, making it easier for citizens to engage with
                  the legislative process while holding their elected
                  representatives accountable.
                </small>
              </div>
            </div>
            <div className="middle_right f_flex">
              {" "}
              <div className="middle">
                <div className="header">
                  <h4>Navigation</h4>
                </div>
                <div className="list">
                  <ul>
                    <li>
                      <a href="#about">About</a>
                    </li>
                    <li>
                      <a href="#features">Features</a>
                    </li>
                    <li>
                      <a href="#coming-soon">Coming Soon</a>
                    </li>
                    <li>
                      <a href="#subscribe">Get notified</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="right">
                <div className="header">
                  <h4>Contact us</h4>
                </div>
                <div className="details">
                  <small>Email Us</small>
                  <div className="email">
                    <a href="mailto:contact@voterhq.com">contact@voterhq.com</a>
                  </div>
                </div>
                <div className="social_icons">
                  <div className="icons a_flex">
                    <span className="facebook ">
                      <a href="" target="_blank" rel="noopener noreferrer">
                        <FacebookIcon className="icon" />
                      </a>
                    </span>
                    <span className="instagram ">
                      <a
                        href="https://instagram.com/votershq"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramIcon className="icon" />
                      </a>
                    </span>
                    <span className="linkedin ">
                      <a
                        href="https://linkedin.com/company/votershq"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedInIcon className="icon" />
                      </a>
                    </span>
                    <span className="twitter ">
                      <a
                        href="https://x.com/voters_hq"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <XIcon className="icon" />
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
      <div className="lower_box">
        <div className="container c_flex">
          <div className="reserve">
            <small>&copy;2024 VoterHQ. All rights reserved</small>
          </div>
          <div className="language a_flex">
            <span className="">
              <small>English</small>
            </span>
            <span className="arrow_down">
              <KeyboardArrowDownIcon className="icon" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
