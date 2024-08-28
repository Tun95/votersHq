import { ElectionResponse } from "../../types/election/election details/types";
import "./styles.scss";



function Banner({ election }: ElectionResponse) {
  return (
    <div className="election_banner">
      <div className="container">
        <div className="content">
          <div className="img_window">
            <img src={election.banner} alt="election banner" />
          </div>
          <div className="img_mobile">
            <img src={election.banner} alt="election banner" />
          </div>
          <div className="header">
            <h1>{election.title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
