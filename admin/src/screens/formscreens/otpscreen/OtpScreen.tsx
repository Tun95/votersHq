import { Helmet } from "react-helmet-async";
import OtpVerificationComponent from "../../../components/form/otp/Otp";
import MainNavBar from "../../../common/main navbar/MainNavBar";

function OtpScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Otp</title>
      </Helmet>
      <MainNavBar />
      <div className="container  l_flex">
        <div className="content form_screen_content">
          <OtpVerificationComponent />
        </div>
      </div>
    </div>
  );
}

export default OtpScreen;
