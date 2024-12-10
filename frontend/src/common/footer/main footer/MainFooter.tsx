import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./styles.scss";
import { Link } from "react-router-dom";
import logo1 from "../../../assets/logo/logo1.png";

function MainFooter() {
  return (
    <div className="main_footer">
      <footer className="landing_footer">
        <div className="upper_box">
          <div className="container">
            <div className="content f_flex">
              <div className="left">
                <div className="logo_text a_flex">
                  <div className="logo">
                    <img src={logo1} alt="votersHq" />
                  </div>
                  <div className="text">
                    <h1>votersHQ</h1>
                  </div>
                </div>
              </div>
              <div className="middle_right f_flex">
                {" "}
                <div className="span_middle f_flex">
                  <div className="middle">
                    <div className="header">
                      <h4>Quick Links</h4>
                    </div>
                    <div className="list">
                      <ul>
                        <li>
                          <Link to="/">Home</Link>
                        </li>
                        <li>
                          <Link to="/bills">Bills & Issues</Link>
                        </li>
                        <li>
                          <Link to="/elections">E-Election</Link>
                        </li>
                        <li>
                          <Link to="/news">News</Link>
                        </li>
                        <li>
                          <Link to="/about">About Us</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="middle">
                    <div className="header">
                      <h4>Support</h4>
                    </div>
                    <div className="list">
                      <ul>
                        <li>
                          <Link to="/contact">Help Center</Link>
                        </li>
                        <li>
                          <a href="/contact/#faq">
                            FAQs
                          </a>
                        </li>

                        <li>
                          <Link to="/news">News</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="details">
                    <small>Call Us</small>
                    <div className="email number">
                      <a href="tel:+2348012345678">+234 (801) 234 5678</a>
                    </div>
                  </div>
                  <div className="details">
                    <small>Email Us</small>
                    <div className="email">
                      <a href="mailto:contact@voterhq.com">
                        contact@voterhq.com
                      </a>
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
    </div>
  );
}

export default MainFooter;
