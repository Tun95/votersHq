import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import Subscribers from "../../../components/single/subcribers/Subscribers";

function SubscriberScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Subscriber</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <Subscribers />
        </div>
      </div>
    </div>
  );
}

export default SubscriberScreen;
