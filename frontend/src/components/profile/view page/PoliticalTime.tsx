import { CandidateProps } from "../../../types/candidate/types";

function PoliticalTime({ candidate }: CandidateProps) {
  return (
    <div className="political_timeline">
      <div className="main_header">
        <h2>Political Timeline</h2>
      </div>
      <div className="content">
        <div className="current">
          <div className="header">
            <h3>Current Political Office</h3>
          </div>
          {candidate?.timeline?.length === 0 && (
            <div className="no_review l_flex">
              <p>No Timeline Activities Found</p>
            </div>
          )}
          <div className="list">
            <ul>
              {candidate?.timeline?.slice(0, 3).map((item, index) => (
                <li key={index}>
                  <div className="year_text_details">
                    <div className="year">
                      <h4 className="green">{item?.timelineYear}</h4>
                    </div>
                    <div className="text">
                      <div className="text_header">
                        <h4>{item?.timelineTitle}</h4>
                      </div>
                      <div className="text_details">
                        <small>{item?.timelineDetails}</small>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="previous">
          <div className="header">
            <h3>Previous Portfolio</h3>
          </div>
          {candidate?.timeline?.length === 0 && (
            <div className="no_review l_flex">
              <p>No Timeline Activities Found</p>
            </div>
          )}
          <div className="list">
            <ul>
              {candidate?.timeline?.map((item, index) => (
                <li key={index}>
                  <div className="year_text_details">
                    <div className="year">
                      <h4 className="green">{item?.timelineYear}</h4>
                    </div>
                    <div className="text">
                      <div className="text_header">
                        <h4>{item?.timelineTitle}</h4>
                      </div>
                      <div className="text_details">
                        <small>{item?.timelineDetails}</small>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoliticalTime;
