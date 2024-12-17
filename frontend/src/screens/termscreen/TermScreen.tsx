import { Helmet } from "react-helmet-async";
import MainNavBar from "../../common/nav bar/main navbar/MainNavBar";
import MainFooter from "../../common/footer/main footer/MainFooter";
import Terms from "../../components/terms/Terms";

function TermScreen() {
  window.scrollTo(0, 0);
  return (
    <div className="about_screen">
      {" "}
      <Helmet>
        <title>Terms & Conditions</title>
      </Helmet>
      <MainNavBar />
      <div className="about_screen_content">
        <Terms />
      </div>{" "}
      <div className="footer_section">
        <MainFooter />
      </div>
    </div>
  );
}

export default TermScreen;
