import { Helmet } from "react-helmet-async";
import MainNavBar from "../../common/nav bar/main navbar/MainNavBar";
import MainFooter from "../../common/footer/main footer/MainFooter";
import Privacy from "../../components/privacy/Privacy";

function PrivacyScreen() {
  window.scrollTo(0, 0);
  return (
    <div className="about_screen">
      {" "}
      <Helmet>
        <title>Privacy Policy</title>
      </Helmet>
      <MainNavBar />
      <div className="about_screen_content">
        <Privacy />
      </div>{" "}
      <div className="footer_section">
        <MainFooter />
      </div>
    </div>
  );
}

export default PrivacyScreen;
