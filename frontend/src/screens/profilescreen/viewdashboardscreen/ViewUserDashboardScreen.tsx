import { Helmet } from "react-helmet-async";
import MainFooter from "../../../common/footer/main footer/MainFooter";
import MainNavBar from "../../../common/nav bar/main navbar/MainNavBar";
import { Link, useParams } from "react-router-dom";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import Details from "../../../components/profile/view dashboard/user/Details";
import About from "../../../components/profile/view dashboard/user/About";
import Activities from "../../../components/profile/view dashboard/user/Activities";
import "./styles.scss";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";
import { useEffect, useReducer } from "react";
import {
  Action,
  initialState,
  State,
  User,
} from "../../../types/profile/types";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";

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

function ViewUserDashboardScreen() {
  const params = useParams();
  const { id: userId } = params;

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ user }, dispatch] = useReducer(reducer, initialState);
  window.scrollTo(0, 0);
  // FETCH DATA
  const fetchData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.get(
        `${request}/api/users/public-info/user/${userId}`
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

  // Compute isFollowing after updating user.followers
  const isFollowing = userInfo
    ? user?.followers?.includes(userInfo._id)
    : false;

  return (
    <div className="bill_detail_screen user_profile_view_screen">
      <Helmet>
        <title>User Profile View</title>
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
                <About user={user} fetchData={fetchData} />
                {(user._id === userInfo?._id || isFollowing) && (
                  <Activities user={user} fetchData={fetchData} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <MainFooter />
    </div>
  );
}

export default ViewUserDashboardScreen;
