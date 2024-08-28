import { CandidateProps } from "../../../types/candidate/types";

function Biography({ candidate }: CandidateProps) {
  return (
    <div className="biography_manifesto">
      <div className="content">
        <div className="text_content">
          <p>{candidate?.biography}</p>
        </div>
        {/* <div className="background">
          <div className="header">
            <h3>Background</h3>
          </div>
          <div className="text_content">
            <p>
              Born and raised in Kano State, Amina Bello has always been
              passionate about public service and community development. From a
              young age, she was inspired by the leaders in her community who
              worked tirelessly to improve the lives of the people. This
              inspiration led her to pursue a career in politics, where she has
              made significant strides in advocating for her constituents. Born
              and raised in Kano State, Amina Bello has always been passionate
              about public service and community development. From a young age,
              she was inspired by the leaders in her community who worked
              tirelessly to improve the lives of the people. This inspiration
              led her to pursue a career in politics, where she has made
              significant strides in advocating for her constituents.
            </p>
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
            <p>
              Born and raised in Kano State, Amina Bello has always been
              passionate about public service and community development. From a
              young age, she was inspired by the leaders in her community who
              worked tirelessly to improve the lives of the people. This
              inspiration led her to pursue a career in politics, where she has
              made significant strides in advocating for her constituents. Born
              and raised in Kano State, Amina Bello has always been passionate
              about public service and community development. From a young age,
              she was inspired by the leaders in her community who worked
              tirelessly to improve the lives of the people. This inspiration
              led her to pursue a career in politics, where she has made
              significant strides in advocating for her constituents.
            </p>
          </div>
        </div>
        <div className="achievement">
          <div className="header">
            <h3>Achievement</h3>
          </div>
          <div className="text_content">
            <p>
              Born and raised in Kano State, Amina Bello has always been
              passionate about public service and community development. From a
              young age, she was inspired by the leaders in her community who
              worked tirelessly to improve the lives of the people. This
              inspiration led her to pursue a career in politics, where she has
              made significant strides in advocating for her constituents. Born
              and raised in Kano State, Amina Bello has always been passionate
              about public service and community development. From a young age,
              she was inspired by the leaders in her community who worked
              tirelessly to improve the lives of the people. This inspiration
              led her to pursue a career in politics, where she has made
              significant strides in advocating for her constituents.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Biography;
