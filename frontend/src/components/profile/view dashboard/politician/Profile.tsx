import { DetailsProps } from "./Details";

function Profile({ user }: DetailsProps) {
  return (
    <div className="user_candidate_profile about_user_view">
      <div className="content">
        {/* About Section */}
        <div className="about">
          <div className="header c_flex">
            <div className="left">
              <h4>Background</h4>
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
        <div className="about">
          <div className="header c_flex">
            <div className="left">
              <h4>Education and Early Career</h4>
            </div>
            <div className="right"></div>
          </div>
          <div className="form_box">
            <div className="inner_form">
              <div className="split_form">
                <div className="form_group">
                  <small className="value">{user?.education}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="about">
          <div className="header c_flex">
            <div className="left">
              <h4>Achievement</h4>
            </div>
            <div className="right"></div>
          </div>
          <div className="form_box">
            <div className="inner_form">
              <div className="split_form">
                <div className="form_group">
                  <small className="value">{user?.achievement}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
