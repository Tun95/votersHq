import "./styles.scss";
import t1 from "../../../assets/home/t1.png";
import t2 from "../../../assets/home/t2.png";
import check from "../../../assets/home/check.png";
import { Link } from "react-router-dom";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import TruncateMarkup from "react-truncate-markup";

function Testimony() {
  const list = [
    {
      name: "Clement Daisi",
      mention: "@Klemento",
      image: t1,
      tweet:
        "I used to find it really difficult to understand what was happening in our government, but VotersHQ has made it so much easier. The summaries of bills and policies are clear and straightforward, and I love that I can vote and comment on issues that matter to me. It's great to finally feel like my voice is being heard!",
      premium: true,
    },
    {
      name: "Emunike Chioma",
      mention: "@chidim",
      image: t2,
      tweet:
        "As a community organizer, VotersHQ has been an invaluable tool. The platform not only keeps me updated on the latest political news but also provides a space for community engagement and discussion. It's amazing to see more people getting involved and holding our elected officials accountable. This is exactly what we needed!",
      premium: false,
    },
  ];
  return (
    <div className="testimony">
      <div className="container">
        <div className="content">
          <div className="head">
            <p>1,048 Nigerians have tweeted about us</p>
            <h1>What Nigerians are saying about this platform</h1>
          </div>
          <div className="list">
            {list?.map((item, index) => (
              <div className="cards f_flex" key={index}>
                <div className="img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="details">
                  <div className="top a_flex">
                    <div className="name">
                      <h4>{item.name}</h4>
                    </div>
                    <div className="premium">
                      {item.premium && <img src={check} alt="checked" />}
                    </div>
                    <div className="mention">
                      <small>{item.mention}</small>
                    </div>
                  </div>
                  <div className="bottom">
                    <div className="tweet">
                      <TruncateMarkup lines={7}>
                        <p>{item.tweet}</p>
                      </TruncateMarkup>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="read_more l_flex">
            <span>
              <Link className="read" to="">
                <h4>Read all More Comments</h4>
              </Link>
              <div className="icon_down l_flex">
                <Link to="">
                  <KeyboardDoubleArrowDownIcon className="icon" />
                </Link>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimony;
