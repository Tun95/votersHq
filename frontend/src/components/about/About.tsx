import "./styles.scss";
import banner from "../../assets/others/banner.png";

function About() {
  return (
    <div className="about_con">
      <div className="container">
        <div className="banner">
          <div className="img">
            <img src={banner} alt="banner" />
          </div>
        </div>
        <div className="sub_sections l_flex">
          <div className="header l_flex">
            <div className="title">
              <h1>
                Who We <span className="green">Are</span>
              </h1>
            </div>
            <div className="text">
              <p>
                VotersHQ is an innovative platform dedicated to making
                governance accessible, transparent, and inclusive. We believe
                that every citizen has the right to understand and influence the
                decisions shaping their lives. By leveraging the power of AI, we
                simplify complex legislative bills, policies, and issues,
                transforming them into clear, actionable insights that empower
                citizens to make informed decisions and hold their leaders
                accountable.
              </p>
            </div>
          </div>
        </div>{" "}
        <div className="sub_sections l_flex">
          <div className="header l_flex">
            <div className="title">
              <h1>
                Our <span className="green">Mission</span>
              </h1>
            </div>
            <div className="text">
              <p>
                To foster a more inclusive democracy by bridging the gap between
                citizens and their governments through transparency, simplicity,
                and active participation.
              </p>
            </div>
          </div>
        </div>{" "}
        <div className="sub_sections l_flex">
          <div className="header l_flex">
            <div className="title">
              <h1>
                Our <span className="green">Vision</span>
              </h1>
            </div>
            <div className="text">
              <p>
                A world where every citizen has the knowledge, tools, and voice
                to shape the governance that affects their lives.
              </p>
            </div>
          </div>
        </div>{" "}
        <div className="sub_sections mb l_flex">
          <div className="header l_flex">
            <div className="title">
              <h1>
                Why <span className="green">VotersHQ</span>
              </h1>
            </div>
            <div className="text">
              <p>
                We are more than a platform—we are a movement for accessible
                democracy. VotersHQ was created to address the challenges of
                political apathy and complexity, empowering citizens to take an
                active role in shaping their governments with clarity and
                confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
