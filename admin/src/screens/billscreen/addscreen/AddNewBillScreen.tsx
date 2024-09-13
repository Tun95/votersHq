import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import AddNewBill from "../../../components/new/bills/AddNewBill";

function AddNewBillScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Add New Bill</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <AddNewBill />
        </div>
      </div>
    </div>
  );
}
export default AddNewBillScreen;
