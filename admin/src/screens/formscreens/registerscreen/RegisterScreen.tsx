import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import RegisterComponent from "../../../components/form/register/Register";

function RegisterScreen() {
	return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <MainNavBar />
      <div className="container  l_flex">
        <div className="content">
          <RegisterComponent />
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen