import { useEffect, useState } from "react";
import "./styles.scss";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { TwitterTweetEmbed } from "react-twitter-embed";

function Testimony() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set to true once the component is mounted on the client-side
    setIsClient(true);
  }, []);
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
                {isClient && (
                  <>
                    <TwitterTweetEmbed
                      onLoad={function noRefCheck() {}}
                      tweetId="1861104262282887297"
                      placeholder="Loading..."
                      options={{ height: 200, width: "100%" }}
                    />{" "}
                    <TwitterTweetEmbed
                      onLoad={function noRefCheck() {}}
                      tweetId="1083592734038929408"
                      placeholder="Loading..."
                      options={{ height: 200, width: "100%" }}
                    />{" "}
                    <TwitterTweetEmbed
                      onLoad={function noRefCheck() {}}
                      tweetId="1083592734038929408"
                      placeholder="Loading..."
                      options={{ height: 200, width: "100%" }}
                    />{" "}
                    <TwitterTweetEmbed
                      onLoad={function noRefCheck() {}}
                      tweetId="1083592734038929408"
                      placeholder="Loading..."
                      options={{ height: 200, width: "100%" }}
                    />
                  </>
                )}
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
