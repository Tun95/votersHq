import { Helmet } from "react-helmet-async";
import MainNavBar from "../../common/nav bar/main navbar/MainNavBar";
import IntroBanner from "../../components/home/intro banner/IntroBanner";
import Featured from "../../components/home/featured/Featured";
import Post from "../../components/home/post/Post";
import PoliticalNews from "../../components/home/political news/PoliticalNews";
import Testimony from "../../components/home/testimonies/Testimony";
import MainFooter from "../../common/footer/main footer/MainFooter";
import Subscriber from "../../common/subscriber/Subscriber";

function HomeScreen() {
  return (
    <div className="home_screen">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <MainNavBar />
      <div className="content">
        <IntroBanner />
        <Featured />
        <Post />
        <PoliticalNews />
        <Testimony />
        <Subscriber />
      </div>
      <MainFooter />
    </div>
  );
}

export default HomeScreen;
