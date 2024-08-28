import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import "../style/style.css";

function NotFoundScreen() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <div className="container">
        <div className="page_not_found l_flex">
          <div className="text a_flex">
            <div className="header">
              <h1 className="head_size">404</h1>
              <h1>ERROR</h1>
            </div>
            <span className="found_text">
              <h2>Oops!</h2>
              <h2>We were unable to find what you were looking for.</h2>
              <p>The page you have requested cannot be found.</p>
              <p>Error code: Page Not Found</p>
              <div className="link a_flex">
                <Link to="/">Go to the homepage</Link>
                <Link to="" onClick={() => navigate(-1)}>
                  Go back
                </Link>
              </div>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFoundScreen;
