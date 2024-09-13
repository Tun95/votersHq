import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import AddElection from "../../../components/new/election/AddElection";

function AddElectionScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Add Election</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <AddElection />
        </div>
      </div>
    </div>
  );
}

export default AddElectionScreen;
