import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/nav bar/main navbar/MainNavBar";
import { Link, useParams } from "react-router-dom";
import Details from "../../../components/profile/view dashboard/politician/Details";
import Activities from "../../../components/profile/view dashboard/politician/Activities";
import Profile from "../../../components/profile/view dashboard/politician/Profile";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import MainFooter from "../../../common/footer/main footer/MainFooter";
import {
  Action,
  initialState,
  State,
  User,
} from "../../../types/profile/types";
import { useEffect, useReducer } from "react";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { ErrorResponse, getError } from "../../../utilities/utils/Utils";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload as User,
        error: "",
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload as string };

    default:
      return state;
  }
};
function ViewPoliticianDashboardScreen() {
  const params = useParams();
  const { id: userId } = params;

  const [{ user }, dispatch] = useReducer(reducer, initialState);

  // FETCH DATA
  const fetchData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.get(
        `${request}/api/users/public-info/politician/${userId}`
      );
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(err as ErrorResponse),
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(user?._id);
  return (
    <div className="bill_detail_screen user_profile_view_screen">
      <Helmet>
        <title>Politician Profile View</title>
      </Helmet>
      <MainNavBar />
      <div className="container">
        <div className="back_home">
          <Link to="/" className="a_flex green">
            <ArrowCircleLeftOutlinedIcon className="icon" />
            <span>Back to Homepage</span>
          </Link>
        </div>

        {user && (
          <div className="bill_screen_content user_profile_screen_content">
            <div className="tab_panel_box_">
              <Details user={user} fetchData={fetchData} />
              <div className="details_activity">
                <Profile user={user} fetchData={fetchData} />
              </div>
            </div>
            <div className="side_content">
              <Activities user={user} fetchData={fetchData} />
            </div>
          </div>
        )}
      </div>
      <MainFooter />
    </div>
  );
}

export default ViewPoliticianDashboardScreen;
