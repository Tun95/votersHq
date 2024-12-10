import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/nav bar/main navbar/MainNavBar";
import MainFooter from "../../../common/footer/main footer/MainFooter";

function PoliticalNewsDetailScreen() {
  return (
    <div className="home_screen">
      <Helmet>
        <title>News</title>
      </Helmet>
      <MainNavBar />
      <div className="content">
        {/* <PoliticalNewsList /> */}
      </div>
      <MainFooter />
    </div>
  );
}

export default PoliticalNewsDetailScreen;
