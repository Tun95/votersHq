import MainNavBar from "../../../common/main navbar/MainNavBar";
import ElectionsEdit from "../../../components/edit/election/ElectionEdit";

function ElectionEditScreen() {
  return (
    <div className="dashboard_screen ">
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <ElectionsEdit />
        </div>
      </div>
    </div>
  );
}

export default ElectionEditScreen;
