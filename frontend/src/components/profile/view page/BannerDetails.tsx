import { CandidateProps } from "../../../types/candidate/types";
import "./styles.scss";

function BannerDetails({ candidate }: CandidateProps) {
  return (
    <div className="candidate_banner_details">
      <div className="content">
        <div className="banner">
          <img
            src={candidate?.banner}
            alt={`${candidate?.title ?? "candidate name"} banner`}
          />
        </div>
        <div className="candidate_running_mate f_flex">
          <div className="candidate_left f_flex">
            <div className="candidate_img">
              <img src={candidate?.image} alt={candidate?.firstName} />
            </div>
            <div className="name_status">
              <div className="name">
                <h3>
                  {candidate?.lastName} {candidate?.firstName}
                </h3>
              </div>
              <div className="status">
                <small>{candidate?.title}</small>
              </div>
            </div>
          </div>
          <div className="candidate_right a_flex">
            <div className="img">
              <img
                src={candidate?.runningMateImage}
                alt={candidate?.runningMateName}
              />
            </div>
            <div className="name_status">
              <div className="name">
                <h3>{candidate?.runningMateName}</h3>
              </div>
              <div className="status">
                <small>{candidate?.runningMateTitle}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerDetails;
