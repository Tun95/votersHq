import { Switch } from "antd";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { passwordValidationSchema } from "../../../schema/Index";
import { DashboardModal } from "../../../common/modals/Modals";
import { TabMainPanelProps } from "../../../types/profile/types";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { toast } from "react-toastify";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

// Formik initial values and validation schema
const initialPasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
function Settings({ user }: TabMainPanelProps) {
  //PASSWORD
  const [currentPasswordType, setCurrentPasswordType] = useState<
    "password" | "text"
  >("password");
  const [newPasswordType, setNewPasswordType] = useState<"password" | "text">(
    "password"
  );
  const [confirmPasswordType, setConfirmPasswordType] = useState<
    "password" | "text"
  >("password");

  const [currentPasswordIcon, setCurrentPasswordIcon] =
    useState<string>(eyeOff);
  const [newPasswordIcon, setNewPasswordIcon] = useState<string>(eyeOff);
  const [confirmPasswordIcon, setConfirmPasswordIcon] =
    useState<string>(eyeOff);
  const toggleCurrentPassword = () => {
    setCurrentPasswordType(
      currentPasswordType === "password" ? "text" : "password"
    );
    setCurrentPasswordIcon(currentPasswordIcon === eyeOff ? eye : eyeOff);
  };

  const toggleNewPassword = () => {
    setNewPasswordType(newPasswordType === "password" ? "text" : "password");
    setNewPasswordIcon(newPasswordIcon === eyeOff ? eye : eyeOff);
  };

  const toggleConfirmPassword = () => {
    setConfirmPasswordType(
      confirmPasswordType === "password" ? "text" : "password"
    );
    setConfirmPasswordIcon(confirmPasswordIcon === eyeOff ? eye : eyeOff);
  };

  // State for toggling the edit form visibility
  const [isEditingPasswordInfo, setIsEditingPasswordInfo] = useState(false);

  const handleEditPasswordInfoClick = () => setIsEditingPasswordInfo(true);
  const handleCancelPasswordInfoClick = () => setIsEditingPasswordInfo(false);

  //MODAL TOGGLE
  const [currentDashboardModal, setCurrentDashboardModal] = useState<
    "verification" | "webcam" | null
  >(null);

 const handleDashboardOpenModal = (modal: "verification" | "webcam") =>
   setCurrentDashboardModal(modal);


  const handleCloseDashboardModal = () => setCurrentDashboardModal(null);

  //NOTIFICATION HANDLER
  const [emailNotification, setEmailNotification] = useState(false);
  const [smsNotification, setSmsNotification] = useState(false);

  useEffect(() => {
    // Fetch the current settings from the backend when the component loads
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `${request}/api/users/info/${user._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo?.token}` }, // Replace `userToken` with your token variable
          }
        );

        setEmailNotification(data.emailNotification);
        setSmsNotification(data.smsNotification);
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      }
    };

    fetchNotifications();
  }, []);

  //EMAIL NOTIFICATION HANDLER
  const handleEmailToggle = async () => {
    try {
      const { data } = await axios.put(
        `${request}/api/users/update-notifications`,
        { emailNotification: !emailNotification },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` }, // Replace `userToken` with your token variable
        }
      );
      setEmailNotification(data.emailNotification);
      toast.success("Email notification settings updated successfully");
    } catch (error) {
      toast.error(getError(error as ErrorResponse));
      console.error("Error updating email notification:", error);
    }
  };

  //SMS NOTIFICATION HANDLER
  const handleSmsToggle = async () => {
    try {
      const { data } = await axios.put(
        `${request}/api/users/update-notifications`,
        { smsNotification: !smsNotification },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` }, // Replace `userToken` with your token variable
        }
      );
      setSmsNotification(data.smsNotification);
      toast.success("SMS notification settings updated successfully");
    } catch (error) {
      toast.error(getError(error as ErrorResponse));
      console.error("Error updating SMS notification:", error);
    }
  };

  //CONTEXT
  const { state } = useAppContext();
  const { userInfo } = state;
  if (!userInfo) {
    // Handle case where userInfo is null or undefined
    console.error("User info is not available");
    return;
  }

  return (
    <>
      <div className="user_candidate_profile">
        <div className="content security_main_content">
          <div className="security">
            <div className="header c_flex">
              <div className="left">
                <h4>Security</h4>
              </div>
            </div>
            <div className="security_content">
              <div className="password mb">
                <div className="pass_header style_header c_flex">
                  <div className="left">
                    <h4 className="small">Password</h4>
                    <small>Change your access password</small>
                  </div>
                  <div className="right">
                    {!isEditingPasswordInfo && (
                      <button
                        onClick={handleEditPasswordInfoClick}
                        className="main_btn cancel_btn"
                      >
                        <small>Change Password</small>
                      </button>
                    )}
                  </div>
                </div>
                {isEditingPasswordInfo && (
                  <div className="pass_content">
                    <div className="form_box">
                      <Formik
                        initialValues={initialPasswordValues}
                        validationSchema={passwordValidationSchema}
                        onSubmit={async (
                          values,
                          { resetForm, setSubmitting }
                        ) => {
                          try {
                            await axios.put(
                              `${request}/api/users/update-password`,
                              {
                                currentPassword: values.currentPassword,
                                newPassword: values.newPassword,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${userInfo.token}`,
                                },
                              }
                            );
                            toast.success("Password updated successfully");
                            handleCancelPasswordInfoClick();
                            resetForm();
                          } catch (error) {
                            toast.error(getError(error as ErrorResponse));
                          } finally {
                            setSubmitting(false); // Ensure form submission state is reset
                          }
                        }}
                      >
                        {({
                          errors,
                          touched,
                          handleSubmit,
                          handleChange,
                          handleBlur,
                          values,
                          isSubmitting, // Pass this prop to buttons
                        }) => (
                          <Form onSubmit={handleSubmit} className="inner_form">
                            {/* Current Password */}
                            <div className="split_form c_flex">
                              <div className="form_group">
                                <div className="details_icon a_flex">
                                  <div className="input_label">
                                    <label htmlFor="currentPassword">
                                      <small>Current Password</small>
                                    </label>
                                    <Field
                                      name="currentPassword"
                                      type={currentPasswordType}
                                      value={values.currentPassword}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className={
                                        errors.currentPassword &&
                                        touched.currentPassword
                                          ? "input-error"
                                          : ""
                                      }
                                      placeholder="Enter current password"
                                    />
                                    <span
                                      className="toggle_password"
                                      onClick={toggleCurrentPassword}
                                    >
                                      <Icon
                                        icon={currentPasswordIcon}
                                        size={16}
                                        className="eye_icon"
                                      />
                                    </span>
                                    <ErrorMessage
                                      name="currentPassword"
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form_group">
                                <div className="details_icon a_flex">
                                  <div className="input_label">
                                    <label htmlFor="newPassword">
                                      <small>New Password</small>
                                    </label>
                                    <Field
                                      name="newPassword"
                                      type={newPasswordType}
                                      value={values.newPassword}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className={
                                        errors.newPassword &&
                                        touched.newPassword
                                          ? "input-error"
                                          : ""
                                      }
                                      placeholder="Enter new password"
                                    />
                                    <span
                                      className="toggle_password"
                                      onClick={toggleNewPassword}
                                    >
                                      <Icon
                                        icon={newPasswordIcon}
                                        size={16}
                                        className="eye_icon"
                                      />
                                    </span>
                                    <ErrorMessage
                                      name="newPassword"
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Confirm New Password */}
                            <div className="split_form c_flex">
                              <div className="form_group">
                                <div className="details_icon a_flex">
                                  <div className="input_label">
                                    <label htmlFor="confirmPassword">
                                      <small>Confirm Password</small>
                                    </label>
                                    <Field
                                      name="confirmPassword"
                                      type={confirmPasswordType}
                                      value={values.confirmPassword}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className={
                                        errors.confirmPassword &&
                                        touched.confirmPassword
                                          ? "input-error"
                                          : ""
                                      }
                                      placeholder="Confirm new password"
                                    />
                                    <span
                                      className="toggle_password"
                                      onClick={toggleConfirmPassword}
                                    >
                                      <Icon
                                        icon={confirmPasswordIcon}
                                        size={16}
                                        className="eye_icon"
                                      />
                                    </span>
                                    <ErrorMessage
                                      name="confirmPassword"
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* Save and Cancel Buttons */}
                              <div className="save_cancel a_flex">
                                <button
                                  type="submit"
                                  className="main_btn"
                                  disabled={isSubmitting} // Disable button while submitting
                                >
                                  <small>
                                    {isSubmitting ? (
                                      <span className="a_flex">
                                        <i className="fa fa-spinner fa-spin"></i>
                                        Saving...
                                      </span>
                                    ) : (
                                      "Save Changes"
                                    )}
                                  </small>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelPasswordInfoClick}
                                  className="main_btn cancel_btn"
                                >
                                  <small>Cancel</small>
                                </button>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="pass_requirement">
                      <div className="pass_header">
                        <h4 className="small">Password Requirements</h4>
                        <small>Ensure that these requirements are met:</small>
                      </div>
                      <div className="pass_req_list">
                        <ul>
                          <li className="a_flex">
                            <CheckCircleOutlineOutlinedIcon className="icon" />
                            <small>
                              Minimum of 8 characters long - the more the better
                            </small>
                          </li>
                          <li className="a_flex">
                            <CheckCircleOutlineOutlinedIcon className="icon" />
                            <small>At least one uppercase</small>
                          </li>
                          <li className="a_flex">
                            <CheckCircleOutlineOutlinedIcon className="icon" />
                            <small>At least one lowercase</small>
                          </li>
                          <li className="a_flex">
                            <CheckCircleOutlineOutlinedIcon className="icon" />
                            <small>At least one number</small>
                          </li>
                          <li className="a_flex">
                            <CheckCircleOutlineOutlinedIcon className="icon" />
                            <small>
                              At least one special character e.g (!@#$%^&*)
                            </small>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="2_step mb style_header c_flex">
                <div className="left">
                  <h4 className="small">2 - Step Verification</h4>
                  <small>
                    Make your account extra secure, Along with your password,
                    you'll need to enter a code
                  </small>
                </div>
                <div className="right">
                  <button
                    onClick={() => handleDashboardOpenModal("verification")}
                    className="main_btn cancel_btn"
                  >
                    <small>Activate</small>
                  </button>
                </div>
              </div> */}
              <div className="first_verification  mb c_flex">
                <div className="left">
                  <h4 className="small">First Verification</h4>
                  <small>
                    This is the verification done during the registration
                  </small>
                </div>

                <div className="right">
                  <small
                    className={
                      user.isAccountVerified ? "green success" : "gray success"
                    }
                  >
                    {user.isAccountVerified ? "Successful" : "Unverified"}
                  </small>
                  <CheckCircleOutlineOutlinedIcon
                    className={`icon  icon_mobile ${
                      user.isAccountVerified ? "green" : "gray"
                    }`}
                  />
                </div>
              </div>{" "}
              <div className="second_verification style_header mb c_flex">
                <div className="left">
                  <h4 className="small">Second Verification</h4>
                  <small>
                    This is to further verify your account and safety
                  </small>
                </div>
                <div className="right">
                  <button
                    onClick={() => handleDashboardOpenModal("verification")}
                    className="main_btn cancel_btn"
                  >
                    <small>Start</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="notification">
            <div className="header mb c_flex">
              <div className="left">
                <h4>Notification</h4>
              </div>
            </div>
            <div className="notification_content">
              <div className="email_sms">
                <div className="email mb c_flex">
                  <div className="left">
                    <h4 className="small">Email Notifications</h4>
                    <small>
                      Choose to receive notifications via email for bills and
                      elections update
                    </small>
                  </div>
                  <div className="right">
                    <Switch
                      size="small"
                      checked={emailNotification}
                      onChange={handleEmailToggle}
                    />
                  </div>
                </div>
                <div className="sms mb c_flex">
                  <div className="left">
                    <h4 className="small">SMS Notifications:</h4>
                    <small>
                      Opt to receive notifications via text messages for urgent
                      alerts.
                    </small>
                  </div>
                  <div className="right">
                    <Switch
                      size="small"
                      checked={smsNotification}
                      onChange={handleSmsToggle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span>
        <DashboardModal
          currentDashboardModal={currentDashboardModal}
          handleDashboardOpenModal={handleDashboardOpenModal}
          handleCloseDashboardModal={handleCloseDashboardModal}
        />
      </span>
    </>
  );
}

export default Settings;
