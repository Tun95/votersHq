import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import BillsListComponent from "../../../components/list/bills/BillsList";

function BillsListScreen() {
	return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>All Bills</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <BillsListComponent />
        </div>
      </div>
    </div>
  );
}

export default BillsListScreen