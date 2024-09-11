import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import ElectionListComponent from "../../../components/list/election/ElectionList";

function ElectionListScreen() {
	return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>All Elections</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <ElectionListComponent />
        </div>
      </div>
    </div>
  );
}

export default ElectionListScreen