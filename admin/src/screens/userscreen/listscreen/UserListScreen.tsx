import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import UserListComponent from "../../../components/list/user/UserList";

function UserListScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>All Users</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <UserListComponent />
        </div>
      </div>
    </div>
  );
}

export default UserListScreen;
