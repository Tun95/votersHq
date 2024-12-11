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
      title: <h4 className="faq_questions">What is VotersHQ?</h4>,
      content: (
        <p className="faq_answers">
          VotersHQ is an AI-powered platform that simplifies governance by
          providing clear, concise summaries of legislative bills, policies, and
          issues. It empowers citizens to participate in decision-making through
          voting, sharing opinions, and holding officials accountable.
        </p>
      ),
    },
    {
      title: <h4 className="faq_questions">Who can use VotersHQ?</h4>,
      content: (
        <p className="faq_answers">
          Any citizen who wants to stay informed and actively participate in
          governance can use VotersHQ. You just need to sign up using your valid
          identification.
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">
          Is VotersHQ affiliated with the government?
        </h4>
      ),
      content: (
        <p className="faq_answers">
          No, VotersHQ is an independent platform designed to promote
          transparency and citizen participation.
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">How do I vote on bills or issues?</h4>
      ),
      content: (
        <p className="faq_answers">
          Once logged in, you can browse bills, policies, or issues on the
          platform. Each item includes a summary, and you can cast your vote
          (Yea or Nay) directly on the page.
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">
          What are election opinion polls on VotersHQ?
        </h4>
      ),
      content: (
        <p className="faq_answers">
          Our opinion polls allow citizens to express their preferences for
          candidates or policies before the actual elections. This helps gauge
          public sentiment.
        </p>
      ),
    },
    {
      title: <h4 className="faq_questions">Can I see how others voted?</h4>,
      content: (
        <p className="faq_answers">
          Yes, after you cast your vote, you can view aggregated results showing
          how others voted on the same bill or issue.
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">
          How does VotersHQ hold officials accountable?
        </h4>
      ),
      content: (
        <p className="faq_answers">
          After an elected official votes on a bill, we compare their vote to
          how their constituents wanted them to vote. This generates a
          compatibility score that helps citizens evaluate their representation.
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">
          Can I contact my elected officials through VotersHQ?
        </h4>
      ),
      content: (
        <p className="faq_answers">
          Yes, VotersHQ provides tools to send your voting preferences and
          feedback to your elected officials directly.{" "}
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">
          Is VotersHQ available on mobile devices?
        </h4>
      ),
      content: (
        <p className="faq_answers">
          For now, VotersHQ is only available as a web platform. A mobile app
          will be introduced in future updates.
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">Is my personal information secure?</h4>
      ),
      content: (
        <p className="faq_answers">
          Yes, we prioritize your privacy and ensure all data is encrypted and
          securely stored in compliance with data protection regulations.
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">
          How do I get updates on new bills or issues?
        </h4>
      ),
      content: (
        <p className="faq_answers">
          You can subscribe to notifications based on your preferences, such as
          by state, category, or specific topics of interest.
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">
          How do I report an issue or provide feedback?
        </h4>
      ),
      content: (
        <p className="faq_answers">
         You can contact us through the "Contact Us" page or email us at
          contact@voterhq.com
        </p>
      ),
    },
    {
      title: (
        <h4 className="faq_questions">
          How can I suggest new features for VotersHQ?
        </h4>
      ),
      content: (
        <p className="faq_answers">
          We welcome suggestions! Send your ideas through the feedback form on
          our website or email us.
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
