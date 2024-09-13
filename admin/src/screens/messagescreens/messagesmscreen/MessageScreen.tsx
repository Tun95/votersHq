import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import Messages from "../../../components/single/message/Message";

function MessageScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Message</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <Messages />
        </div>
      </div>
    </div>
  );
}

export default MessageScreen;
