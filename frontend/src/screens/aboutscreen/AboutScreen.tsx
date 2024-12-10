import { Helmet } from "react-helmet-async";
import About from "../../components/about/About";
import MainNavBar from "../../common/nav bar/main navbar/MainNavBar";
import MainFooter from "../../common/footer/main footer/MainFooter";

function AboutScreen() {
  window.scrollTo(0, 0);
  return (
    <div className="about_screen">
      {" "}
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <MainNavBar />
      <div className="about_screen_content">
        <About />
      </div>{" "}
      <div className="footer_section">
        <MainFooter />
      </div>
    </div>
  );
}

export default AboutScreen;
