import { CandidateProps } from "../../../types/candidate/types";
import parse from "html-react-parser";

function Biography({ candidate }: CandidateProps) {
  return (
    <div className="biography_manifesto">
      <div className="content">
        <div className="background">
          <div className="header">
            <h3>Background</h3>
          </div>
          <div className="text_content">
            <p>{parse(candidate?.about ?? "")}</p>
          </div>
        </div>
        <div className="education">
          <div className="header">
            <h3>
              Education and <span className="green">Early Career</span>
            </h3>
          </div>
          <div className="text_content">
            {" "}
            <p>{parse(candidate?.education ?? "")}</p>
          </div>
        </div>
        <div className="achievement">
          <div className="header">
            <h3>Achievement</h3>
          </div>
          <div className="text_content">
            <p>{parse(candidate?.achievement ?? "")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Biography;
