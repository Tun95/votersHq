import "./styles.scss";

const Subscribe = () => {
  const handleRedirect = () => {
    window.location.href = import.meta.env.VITE_REACT_APP_GOOGLE_FORM_URL;
  };

  return (
    <section className="subscribe" id="subscribe">
      <div className="container">
        <div className="content p_flex">
          <div className="box">
            <div className="header_text p_flex">
              <div className="header">
                <h1>
                  Be the First to Know When
                  <span className="voters"> We Go Live!</span>
                </h1>
              </div>
              <div className="text">
                <p>
                  Subscribe now to receive the latest updates and be among the
                  first to experience VotersHQ. Get notified about our launch,
                  new features, and exclusive content.
                </p>
              </div>
            </div>
            <div className="form_box p_flex">
              <div className="inner_form l_flex">
                <div className="btn">
                  <button className="main_btn" onClick={handleRedirect}>
                    Get Notified
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
