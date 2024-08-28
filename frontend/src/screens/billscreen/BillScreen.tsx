import { Helmet } from "react-helmet-async";
import MainNavBar from "../../common/nav bar/main navbar/MainNavBar";
import MainFooter from "../../common/footer/main footer/MainFooter";
import Bills from "../../components/bills/Bills";
import Subscriber from "../../common/subscriber/Subscriber";

function BillScreen() {
  window.scrollTo(0, 0);
  return (
    <div className="home_screen">
      <Helmet>
        <title>Bills</title>
      </Helmet>
      <MainNavBar />
      <div className="content">
        <Bills />
        <Subscriber />
      </div>
      <MainFooter />
    </div>
  );
}

export default BillScreen;
