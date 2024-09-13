import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import AddNewUser from "../../../components/new/user/AddNewUser";

function AddNewUserScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Add New User</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <AddNewUser />
        </div>
      </div>
    </div>
  );
}

export default AddNewUserScreen;
