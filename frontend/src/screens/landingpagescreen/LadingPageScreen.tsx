import { Helmet } from "react-helmet-async";
import Navbar from "../../common/nav bar/temp nav/Navbar";
import "./styles.scss";
import Introduction from "../../components/landing page/intro section/Introduction";
import Featuring from "../../components/landing page/featuring/Featuring";
import ComingSoon from "../../components/landing page/coming soon/ComingSoon";
import Subscribe from "../../components/landing page/subscribe/Subscribe";
import LandingFooter from "../../common/footer/temp footer/LandingFooter";

function LadingPageScreen() {
  return (
    <div className="landing_page">
      <Helmet>
        <title>Landing Page</title>
      </Helmet>
      <div className="content">
        <Navbar />
        <div className="main_content">
          <Introduction />
          <Featuring />
          <ComingSoon />
          <Subscribe />
        </div>
        <LandingFooter />
      </div>
    </div>
  );
}

export default LadingPageScreen;
