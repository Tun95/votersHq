import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import LoginComponent from "../../../components/form/login/Login";
import "./styles.scss";

function LoginScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Log in</title>
      </Helmet>
      <MainNavBar />
      <div className="container  l_flex">
        <div className="content form_screen_content">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
