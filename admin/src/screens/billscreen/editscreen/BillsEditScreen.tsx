import MainNavBar from "../../../common/main navbar/MainNavBar";
import BillsEdit from "../../../components/edit/bills/BillsEdit";

function BillsEditScreen() {
  return (
    <div className="dashboard_screen ">
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <BillsEdit />
        </div>
      </div>
    </div>
  );
}

export default BillsEditScreen;
