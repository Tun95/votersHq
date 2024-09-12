import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import UserEdit from "../../../components/edit/user/UserEdit";

function UserEditScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Edit User Info</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <UserEdit />
        </div>
      </div>
    </div>
  );
}

export default UserEditScreen;
