import { DetailsProps } from "./Details";
import "./styles.scss";

function About({ user }: DetailsProps) {
  return (
    <>
      {user?.about && (
        <div className="user_candidate_profile about_user_view">
          <div className="content">
            {/* About Section */}

            <div className="about">
              <div className="header c_flex">
                <div className="left">
                  <h4>About</h4>
                </div>
                <div className="right"></div>
              </div>
              <div className="form_box">
                <div className="inner_form">
                  <div className="split_form">
                    <div className="form_group">
                      <small className="value">{user?.about}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default About;
