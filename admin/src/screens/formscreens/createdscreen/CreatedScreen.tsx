import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import CreatedAccountComponent from "../../../components/form/created/Created";

function CreatedScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Created Successfully</title>
      </Helmet>
      <MainNavBar />
      <div className="container  l_flex">
        <div className="content form_screen_content">
          <CreatedAccountComponent />
        </div>
      </div>
    </div>
  );
}

export default CreatedScreen;
