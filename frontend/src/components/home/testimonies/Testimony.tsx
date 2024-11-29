import "./styles.scss";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Tweet } from "react-tweet";

function Testimony() {
  return (
    <div className="testimony">
      <div className="container">
        <div className="content">
          <div className="head">
            {/* NUMBER OF TWEET ABOUT */}
            <p>1,048 Nigerians have tweeted about us</p>
            <h1>What Nigerians are saying about this platform</h1>
          </div>
          <div className="list">
            <div className="centerContent">
              <div className="selfCenter d_flex">
                <Tweet id="1083592734038929408" />
                <Tweet id="1083592734038929408" />{" "}
              </div>
            </div>
          </div>
          {/* REDIRECT TO TWEETS */}
          <div className="read_more l_flex">
            <span>
              <a
                className="read"
                href="https://twitter.com/search?q=%23@cassidoo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>Read all More Comments</h4>
              </a>
              <div className="icon_down l_flex">
                <a
                  className="read"
                  href="https://twitter.com/search?q=%23@cassidoo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <KeyboardDoubleArrowDownIcon className="icon" />
                </a>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimony;
