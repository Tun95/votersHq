import { Helmet } from "react-helmet-async";
import MainNavBar from "../../common/main navbar/MainNavBar";
import { PoliticalNewsCreateUpdate } from "../../components/single/political news/PoliticalNewsCreateUpdate";

function PoliticalNewScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Political News</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <PoliticalNewsCreateUpdate />
        </div>
      </div>
    </div>
  );
}

export default PoliticalNewScreen;
