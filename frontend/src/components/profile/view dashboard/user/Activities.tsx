import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import EastIcon from "@mui/icons-material/East";
import "./styles.scss";
import { DetailsProps } from "./Details";
import { useEffect, useReducer, useState } from "react";
import { request } from "../../../../base url/BaseUrl";
import axios from "axios";
import {
  ErrorResponse,
  formatDateAgo,
  getError,
} from "../../../../utilities/utils/Utils";
import {
  ActivityAction,
  activityInitialState,
  ActivityState,
} from "../../../../types/profile/types";

//Reducer
function activitiesReducer(
  state: ActivityState,
  action: ActivityAction
): ActivityState {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        activities: action.payload,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      throw new Error("Unsupported action type");
  }
}
function Activities({ user }: DetailsProps) {
  const [state, dispatch] = useReducer(activitiesReducer, activityInitialState);
  const { activities } = state;
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(
          `${request}/api/users/activities/${user._id}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          error: getError(error as ErrorResponse),
        });
      }
    };

    fetchActivities();
  }, [user._id]);

  // Determine the activities to display based on whether "Show more" has been clicked
  const activitiesToDisplay = showAll ? activities : activities.slice(0, 5);

  return (
    <>
      <div className="activities">
        <div className="content">
          <div className="header">
            <h3>Activities</h3>
          </div>
          <div className="list">
            {activitiesToDisplay.map((activity) => (
              <div key={activity._id} className="list_items f_flex">
                <div className="icons">
                  <div className={`${activity?.activityType} l_flex`}>
                    {activity?.activityType === "Followed a New User" && (
                      <div className="follow l_flex">
                        <PersonAddAltOutlinedIcon className="icon" />
                      </div>
                    )}
                    {(activity?.activityType === "Commented on a Bill" ||
                      activity?.activityType ===
                        "Commented on an Election") && (
                      <div className="comment l_flex">
                        <TextsmsOutlinedIcon className="icon" />
                      </div>
                    )}
                    {(activity?.activityType === "Voted in an Election" ||
                      activity?.activityType === "Voted on a Bill") && (
                      <div className="vote l_flex">
                        <i className="fa-regular fa-thumbs-up icon"></i>
                      </div>
                    )}
                    {activity?.activityType === "Unfollowed a New User" && (
                      <div className="un_follow l_flex">
                        <PersonRemoveOutlinedIcon className="icon" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="title_content_time">
                  <div className="title_time c_flex">
                    <div className="title">
                      <h4>{activity?.activityType}</h4>
                    </div>
                    <div className="time">
                      <small>{formatDateAgo(activity?.createdAt)}</small>
                    </div>
                  </div>
                  <div className="content">
                    <small>{activity?.activityDetails}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {activities.length > 5 && !showAll && (
            <div
              className="show_more green l_flex"
              onClick={() => setShowAll(true)}
            >
              <div className="a_flex show_more_link">
                <h4>Show more activities</h4>
                <EastIcon className="icon" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Activities;
