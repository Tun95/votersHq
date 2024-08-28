import "./styles.scss";
import winbanner from "../../../assets/home/winbanner.png";
import mobbanner from "../../../assets/home/mobbanner.png";

function Introduction() {
  return (
    <section className="intro_section" id="about">
      <div className="section">
        <div className="content p_flex">
          <div className="container">
            <div className="top">
              <div className="main_header">
                <h1>
                  Simplifying politics and empowering{" "}
                  <span className="yellow_text">citizen's</span> participation
                  in government.
                </h1>
              </div>
              <div className="text">
                <p>
                  We provide summaries of legislative bills, and issues,
                  empowering citizens to vote on these bills and share their
                  opinions. This ensures that citizens' voices are heard and
                  accounted for in the decision-making process, promoting
                  inclusive governance.
                </p>
              </div>
              <div className="btn">
                <a href="#subscribe" className="main_btn">
                  Get Notified
                </a>
              </div>
            </div>
          </div>
          <div className="bottom_container">
            <div className="bottom ">
              <div className="img">
                <img
                  src={winbanner}
                  alt="Window Banner"
                  className="desktop_banner"
                />
                <img
                  src={mobbanner}
                  alt="Mobile Banner"
                  className="mobile_banner"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="white">
        <div className="bottom_white"></div>
      </div>
      <div className="yellow">
        <div className="bottom_yellow"></div>
      </div>
    </section>
  );
}

export default Introduction;
