import p3 from "../../../../assets/profile/p3.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import BoltIcon from "@mui/icons-material/Bolt";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import pt from "../../../../assets/profile/pt.png";
import "./styles.scss";
import { ActionType, FollowState, User } from "../../../../types/profile/types";
import {
  ErrorResponse,
  formatNumberNoDecimalShort,
  getError,
  useAppContext,
} from "../../../../utilities/utils/Utils";
import { useEffect, useReducer } from "react";
import { request } from "../../../../base url/BaseUrl";
import axios from "axios";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import { toast } from "react-toastify";

export interface DetailsProps {
  user: User;
}

// Reducer
function followReducer(state: FollowState, action: ActionType): FollowState {
  switch (action.type) {
    case "FOLLOW":
    case "UNFOLLOW":
      return { ...state, loading: true, error: null };
    case "FOLLOW_SUCCESS":
      return {
        ...state,
        following: [...state.following, action.payload],
        loading: false,
      };
    case "UNFOLLOW_SUCCESS":
      return {
        ...state,
        following: state.following.filter((id) => id !== action.payload),
        loading: false,
      };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
function Details({ user }: DetailsProps) {
  const initialFollowUnfollowState: FollowState = {
    following: user.following,
    error: null,
    loading: false,
  };

  const { state: appState, showDrawer, setMenu } = useAppContext();
  const { userInfo } = appState;

  //OTP Menu
  const navigateToOtp = () => {
    setMenu("otp");
    showDrawer();
  };

  //USER TEMPORARY LOCAL STORAGE INFO
  useEffect(() => {
    const temporaryUserInfoKey = "temporaryUserInfo";

    // Check if temporaryUserInfo exists in localStorage
    const existingUserInfo = localStorage.getItem(temporaryUserInfoKey);

    // If it exists, clear it
    if (existingUserInfo) {
      localStorage.removeItem(temporaryUserInfoKey);
    }

    // Update localStorage with the new user data
    const newUserInfo = {
      email: user.email,
      // Add other necessary user data you want to store
    };

    localStorage.setItem(temporaryUserInfoKey, JSON.stringify(newUserInfo));
  }, [user]);

  // UseReducer hook
  const [state, dispatch] = useReducer(
    followReducer,
    initialFollowUnfollowState
  );

  // Function to follow a user
  const followUser = async (userId: string) => {
    dispatch({ type: "FOLLOW", payload: userId });
    try {
      const response = await axios.post(
        `${request}/api/users/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      if (response.status === 200) {
        dispatch({ type: "FOLLOW_SUCCESS", payload: userId });
      }
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: getError(error as ErrorResponse),
      });
      toast.error(getError(error as ErrorResponse));
    }
  };

  // Function to unfollow a user
  const unfollowUser = async (userId: string) => {
    dispatch({ type: "UNFOLLOW", payload: userId });
    try {
      const response = await axios.post(
        `${request}/api/users/unfollow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      if (response.status === 200) {
        dispatch({ type: "UNFOLLOW_SUCCESS", payload: userId });
      }
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: getError(error as ErrorResponse),
      });
      toast.error(getError(error as ErrorResponse));
    }
  };

  // Check if the current user is already following the displayed user
  const isFollowing = state.following.includes(user._id);
  return (
    <div className="profile_details politician_user">
      <div className="content d_flex">
        <div className="left a_flex">
          <div className="img_icon">
            <div className="img l_flex">
              <img src={user ? user?.image : p3} alt="user image" />
            </div>
          </div>
          <div className="name_available_follow_status">
            <div className="name_status a_flex">
              <div className="name">
                <h3>
                  {user.lastName} {user.firstName}
                </h3>
              </div>

              {user.isAccountVerified ? (
                <div className="status a_flex">
                  <VerifiedIcon
                    className={`icon ${
                      user.role === "user" ? "green" : "gold"
                    }`}
                  />
                  <small>Verified</small>
                </div>
              ) : (
                <div className="status a_flex">
                  <VerifiedIcon className="icon gray" />
                  <small>Unverified</small>
                </div>
              )}
              {/* <div className="status a_flex">
                <VerifiedIcon className="icon gray" />
                <small>Unverified</small>
              </div> */}
            </div>

            <div className="available party a_flex">
              <div className="img">
                <img src={pt} alt="party" />
              </div>
              <small>All Progressive Congress (APC)</small>
            </div>
            <div className="follow_status a_flex">
              <div className="followers a_flex">
                <PersonAddAltOutlinedIcon className="icon" />
                <h4 className="count">
                  {formatNumberNoDecimalShort(user?.followers?.length)}
                </h4>
                <small>Followers</small>
              </div>
              <div className="following a_flex">
                <PeopleAltOutlinedIcon className="icon" />
                <h4 className="count">
                  {formatNumberNoDecimalShort(user?.following?.length)}
                </h4>
                <small>Followers</small>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="btn f_flex">
            <button
              className="main_btn verify a_flex"
              onClick={() =>
                isFollowing ? unfollowUser(user._id) : followUser(user._id)
              }
              disabled={state.loading}
            >
              {state.loading ? (
                <i className="fa fa-spinner fa-spin"></i>
              ) : (
                <>
                  {isFollowing ? (
                    <PersonRemoveOutlinedIcon
                      className={`icon ${isFollowing ? "red" : "green"}`}
                    />
                  ) : (
                    <PersonAddAltOutlinedIcon
                      className={`icon ${isFollowing ? "red" : "green"}`}
                    />
                  )}
                </>
              )}
              <small className={isFollowing ? "red" : "green"}>
                {isFollowing ? "Unfollow" : "Follow"}
              </small>
            </button>
            {!user.isAccountVerified && (
              <button className="main_btn a_flex" onClick={navigateToOtp}>
                <BoltIcon className="icon" />
                <small>Claim account</small>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
