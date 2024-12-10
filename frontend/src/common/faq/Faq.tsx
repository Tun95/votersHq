import "./styles.scss";
import Faq from "react-faq-component";

const styles = {
  rowTitleColor: "#152c5b",
  rowContentColor: "#8a95ad",
  rowContentPaddingTop: "20px",
  rowContentPaddingBottom: "15px",
};

const config = {
  animate: true,
  arrowIcon: <i className="fa-solid fa-chevron-down l_flex faq_icon"></i>,
  tabFocus: true,
};

const data = {
  // title: "Frequently Asked Questions",
  rows: [
    {
      title: (
        <h4 className="faq_questions">What is the Ondo State Youth Retreat?</h4>
      ),
      content: (
        <p className="faq_answers">
          The Ondo State Youth Retreat is an annual gathering aimed at
          empowering the youth through various interactive sessions, workshops,
          networking opportunities, and competitions. The 2024 edition, themed
          "Shaping The Future: Harnessing Our Potentials Through The Youth,"
          will bring together young leaders, entrepreneurs, creatives, and
          professionals to explore opportunities for personal growth and
          societal impact.
        </p>
      ),
    },
    {
      title: <h4 className="faq_questions">Who can attend the retreat?</h4>,
      content: (
        <p className="faq_answers">
          The retreat is open to individuals aged 18-45 who are residents or
          indigenes of Ondo State.
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">How can I register for the retreat?</h4>
      ),
      content: (
        <p className="faq_answers">
          You can register online by filling out the form on the official event
          website.
        </p>
      ),
    },
    {
      title: <h4 className="faq_questions">Is there a registration fee?</h4>,
      content: (
        <p className="faq_answers">No, registration for the retreat is free.</p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">
          What activities are included in the retreat?
        </h4>
      ),
      content: (
        <p className="faq_answers">
          The retreat includes keynote speeches, panel sessions, workshops,
          competitions, cultural displays, and networking opportunities.
        </p>
      ),
    },
    {
      title: <h4 className="faq_questions">Where will the event be held?</h4>,
      content: (
        <p className="faq_answers">
          The event will be held at Nibanola Resort, Km 7 Ore - Ondo Road,
          Igbado, Ondo State.
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">
          Will accommodation and meals be provided?
        </h4>
      ),
      content: (
        <p className="faq_answers">
          Yes, participants will be provided with accommodation and three meals
          daily for the duration of the retreat.
        </p>
      ),
    },
  ],
};

function FaqComponent() {
  return (
    <div className="home_faq" id="faq">
      <div className="container">
        <div className="content width_container">
          <div className="header l_flex">
            <div className="name green">
              <h2>FAQs</h2>
            </div>
            <div className="title">
              <h1>Frequently Asked Questions</h1>
            </div>
            <div className="text">
              <small>
                We've compiled a list of commonly asked questions to provide you
                with quick and informative answers
              </small>
            </div>
          </div>
          <div className="faq_list">
            <Faq data={data} styles={styles} config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqComponent;
