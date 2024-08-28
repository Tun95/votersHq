import "./styles.scss";
import { CandidateProps } from "../../../types/candidate/types";

function CandidateDetails({ candidate }: CandidateProps) {
  return (
    <div className="candidate_view_details">
      <div className="content f_flex">
        <div className="age">
          <h3>Age</h3>
          <small>{candidate?.age} Years Old</small>
        </div>
        <div className="position">
          <h3>Contesting For</h3>
          <small>{candidate?.contestingFor}</small>
        </div>
        <div className="party">
          <h3>Political Party</h3>
          <div className="party_img_text a_flex">
            <div className="img">
              <img src={candidate?.partyImage} alt="party logo" />
            </div>
            <small className="text">{candidate?.partyName}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetails;
