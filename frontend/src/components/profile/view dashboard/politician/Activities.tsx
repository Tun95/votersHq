import { DetailsProps } from "./Details";

function Activities({ user }: DetailsProps) {
  return (
    <>
      <div className="political_timeline dashboard_political_timeline">
        <div className="content">
          <div className="current">
            <div className="header c_flex">
              <div className="left">
                <h4>Current Political Office</h4>
              </div>
            </div>
            {user?.timeline?.length === 0 && (
              <div className="no_review l_flex">
                <p>No Timeline Activities Found</p>
              </div>
            )}
            <div className="list">
              <ul>
                {user?.timeline?.slice(0, 3).map((item, index) => (
                  <li key={index}>
                    <div className="year_text_details">
                      <div className="year">
                        <h4 className="green">{item.timelineYear}</h4>
                      </div>
                      <div className="text">
                        <div className="text_header">
                          <h4>{item.timelineTitle}</h4>
                        </div>
                        <div className="text_details">
                          <small>{item.timelineDetails}</small>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="previous">
            <div className="header c_flex">
              <div className="left">
                <h4>Political Timeline</h4>
              </div>
            </div>
            {user?.timeline?.length === 0 && (
              <div className="no_review l_flex">
                <p>No Timeline Activities Found</p>
              </div>
            )}
            <div className="list">
              <ul>
                {user?.timeline?.slice(0, 9).map((item, index) => (
                  <li key={index}>
                    <div className="year_text_details">
                      <div className="year">
                        <h4 className="green">{item.timelineYear}</h4>
                      </div>
                      <div className="text">
                        <div className="text_header">
                          <h4>{item.timelineTitle}</h4>
                        </div>
                        <div className="text_details">
                          <small>{item.timelineDetails}</small>
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
    </>
  );
}

export default Activities;
