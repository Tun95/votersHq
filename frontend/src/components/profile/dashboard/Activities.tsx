import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import EastIcon from "@mui/icons-material/East";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useEffect, useReducer, useState } from "react";
import {
  ActivityAction,
  activityInitialState,
  ActivityState,
  User,
} from "../../../types/profile/types";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { timelineSchema } from "../../../schema/Index";
import { toast } from "react-toastify";
import { request } from "../../../base url/BaseUrl";
import axios from "axios";
import {
  ErrorResponse,
  formatDateAgo,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";

interface DetailsProps {
  user: User;
  fetchData: () => Promise<void>;
}

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
function Activities({ user, fetchData }: DetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMoreBox, setShowAddMoreBox] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleAddMoreClick = () => {
    setShowAddMoreBox(true);
  };

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

  //CONTEXT
  const { state: appState } = useAppContext();
  const { userInfo } = appState;
  if (!userInfo) {
    // Handle case where userInfo is null or undefined
    console.error("User info is not available");
    return;
  }
  return (
    <>
      {user.role === "user" ? (
        <div className="activities">
          <div className="content">
            <div className="header">
              <h3>Activities</h3>
            </div>

            <div className="list">
              {activitiesToDisplay?.length === 0 && (
                <div className="no_review l_flex">
                  <p>No Activities Found</p>
                </div>
              )}
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
                    <div className="title_time ">
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
      ) : (
        user.role === "politician" && (
          <div className="political_timeline dashboard_political_timeline">
            <div className="content">
              <div className="current">
                <div className="header c_flex">
                  <div className="left">
                    <h4>Current Political Office</h4>
                  </div>
                  <div className="right">
                    {/* <div className="btn a_flex">
                      <DriveFileRenameOutlineOutlinedIcon className="icon" />
                      <small>Edit</small>
                    </div> */}
                  </div>
                </div>
                {user?.timeline?.length === 0 && (
                  <div className="no_review l_flex">
                    <p>No Timeline Activities Found</p>
                  </div>
                )}
                <div className="list">
                  <ul>
                    {user?.timeline?.slice(0, 3).map((item, index) => (
                      <li key={index}>
                        <div className="year_text_details">
                          <div className="year">
                            <h4 className="green">{item.timelineYear}</h4>
                          </div>
                          <div className="text">
                            <div className="text_header">
                              <h4>{item.timelineTitle}</h4>
                            </div>
                            <div className="text_details">
                              <small>{item.timelineDetails}</small>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="previous">
                <div className="header c_flex">
                  <div className="left">
                    <h4>Political Timeline</h4>
                  </div>
                  <div className="right">
                    {!isEditing && (
                      <div className="btn a_flex" onClick={handleEditClick}>
                        <DriveFileRenameOutlineOutlinedIcon className="icon" />
                        <small>Edit</small>
                      </div>
                    )}
                  </div>
                </div>
                {user?.timeline?.length === 0 && (
                  <div className="no_review l_flex">
                    <p>No Timeline Activities Found</p>
                  </div>
                )}
                <div className="list">
                  <ul>
                    {user?.timeline?.slice(0, 9).map((item, index) => (
                      <li key={index}>
                        <div className="year_text_details">
                          <div className="year">
                            <h4 className="green">{item.timelineYear}</h4>
                          </div>
                          <div className="text">
                            <div className="text_header">
                              <h4>{item.timelineTitle}</h4>
                            </div>
                            <div className="text_details">
                              <small>{item.timelineDetails}</small>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {isEditing && !showAddMoreBox && (
                    <div className="add_more_btn">
                      <div className="btn l_flex" onClick={handleAddMoreClick}>
                        <button className="main_btn l_flex">
                          <span className="a_flex">
                            <AddBoxOutlinedIcon className="icon" />
                            <small>Add another column</small>
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                  {showAddMoreBox && (
                    <div className="add_more_box">
                      <div className="header l_flex">
                        <h4>New column</h4>
                      </div>
                      <Formik
                        initialValues={{
                          timelineYear: "",
                          timelineTitle: "",
                          timelineDetails: "",
                        }}
                        validationSchema={timelineSchema}
                        onSubmit={async (
                          values,
                          { setSubmitting, resetForm }
                        ) => {
                          try {
                            await axios.post(
                              `${request}/api/users/add-timeline`,
                              values,
                              {
                                headers: {
                                  Authorization: `Bearer ${userInfo?.token}`,
                                },
                              }
                            );
                            toast.success("Timeline added successfully!");
                            resetForm();
                            setShowAddMoreBox(false);
                            fetchData();
                          } catch (error) {
                            toast.error(getError(error as ErrorResponse));
                            console.error("Error adding timeline:", error);
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        {({ isSubmitting }) => (
                          <Form className="form_box">
                            <div className="inner_form">
                              <div className="form_group a_flex">
                                <Field
                                  type="number"
                                  name="timelineYear"
                                  placeholder="Year"
                                />
                                <ErrorMessage
                                  name="timelineYear"
                                  component="div"
                                  className="error"
                                />
                              </div>
                              <div className="form_group a_flex">
                                <Field
                                  type="text"
                                  name="timelineTitle"
                                  placeholder="Timeline Title"
                                />
                                <ErrorMessage
                                  name="timelineTitle"
                                  component="div"
                                  className="error"
                                />
                              </div>
                              <div className="form_group a_flex">
                                <Field
                                  as="textarea"
                                  name="timelineDetails"
                                  placeholder="Timeline Details"
                                />
                                <ErrorMessage
                                  name="timelineDetails"
                                  component="div"
                                  className="error"
                                />
                              </div>
                              <div className="btn l_flex">
                                <button
                                  type="submit"
                                  className="main_btn"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <span className="a_flex">
                                      <i className="fa fa-spinner fa-spin"></i>
                                      Saving...
                                    </span>
                                  ) : (
                                    "Save Changes"
                                  )}
                                </button>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}

export default Activities;
