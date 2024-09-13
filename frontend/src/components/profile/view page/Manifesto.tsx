import { CandidateProps } from "../../../types/candidate/types";
import parse from "html-react-parser";

function Manifesto({ candidate }: CandidateProps) {
  return (
    <div className="biography_manifesto">
      {/* <div className="manifest_header">
        <h3>Renewed Hope 2023: Action Plan for a Better Nigeria</h3>
      </div> */}
      <div className="content">
        <div className="text_content">
          <p>{parse(candidate?.manifesto ?? "")}</p>
        </div>
        {/* <div className="introduction">
          <div className="header">
            <h3>Introduction</h3>
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
        <div className="economic">
          <div className="header">
            <h3>Economic Growth and Development</h3>
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
        <div className="education">
          <div className="header">
            <h3>Education</h3>
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
        <div className="healthcare">
          <div className="header">
            <h3>Healthcare</h3>
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
        <div className="security">
          <div className="header">
            <h3>National Security</h3>
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
        </div> */}
      </div>
    </div>
  );
}

export default Manifesto;
