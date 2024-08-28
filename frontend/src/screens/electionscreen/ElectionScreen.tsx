import { Helmet } from "react-helmet-async";
import MainNavBar from "../../common/nav bar/main navbar/MainNavBar";
import Election from "../../components/election page/Election";
import Subscriber from "../../common/subscriber/Subscriber";
import MainFooter from "../../common/footer/main footer/MainFooter";

function ElectionScreen() {
  return (
    <div className="home_screen">
      <Helmet>
        <title>Elections</title>
      </Helmet>
      <MainNavBar />
      <div className="content">
        <Election />
        <Subscriber />
      </div>
      <MainFooter />
    </div>
  );
}

export default ElectionScreen;
