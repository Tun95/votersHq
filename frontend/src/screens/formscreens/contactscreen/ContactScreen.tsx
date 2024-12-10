import { Helmet } from "react-helmet-async";
import "./styles.scss";
import ContactComponent from "../../../components/form/contact/Contact";
import FaqComponent from "../../../common/faq/Faq";
import MainFooter from "../../../common/footer/main footer/MainFooter";
import MainNavBar from "../../../common/nav bar/main navbar/MainNavBar";
import { useEffect, useRef } from "react";

function ContactScreen() {
  const faqRef = useRef<HTMLDivElement>(null);

  // Scroll to the top of the page when the component is loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="contact_screen multiple_page_screen">
      <Helmet>
        <title>Contact Us</title>
      </Helmet>{" "}
      <MainNavBar />
      <div className="container">
        <div className="multiple_page_content">
          <div className="header l_flex">
            <div className="title green">
              <h1>Contact VotersHQ</h1>
            </div>
            <div className="text">
              <small>
                Have questions, feedback, or suggestions? Reach out to us—we're
                here to help!
              </small>
            </div>
          </div>
          <div className="main_body_content">
            <ContactComponent />
            <div ref={faqRef} id="faq" className="faq_section">
              <FaqComponent />
            </div>
          </div>
        </div>
      </div>
      <div className="footer_section">
        <MainFooter faqRef={faqRef} />
      </div>
    </div>
  );
}

export default ContactScreen;
