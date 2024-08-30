import OtpInput from "react-otp-input";
import v1 from "../../../assets/others/v1.png";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import { Formik, ErrorMessage, Form, Field, FormikHelpers } from "formik";
import { otpSchema } from "../../../schema/Index";
import "../styles.scss";
import { ErrorResponse, getError } from "../../../utilities/utils/Utils";
import { useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { OtpValues } from "../../../types/auth/types";

// Initial values for the OTP form
const initialOtpValues = {
  otp: "",
};

interface State {
  loading: boolean;
  error: string;
}

interface Action {
  type: "SUBMIT_REQUEST" | "SUBMIT_SUCCESS" | "SUBMIT_FAIL";
  payload?: string;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, error: "" };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false };
    case "SUBMIT_FAIL":
      return { ...state, loading: false, error: action.payload || "" };
    default:
      return state;
  }
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

interface OtpVerificationDropDownMenuProps {
  onClose: () => void;
  setMenu: (menu: "register" | "otp" | "created" | "pending" | "login") => void;
}
function OtpVerificationDropDownMenu({
  onClose,
  setMenu,
}: OtpVerificationDropDownMenuProps) {
  const [, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  // Calculate initial countdown based on the stored end time
  const calculateInitialCountdown = () => {
    const storedEndTime = localStorage.getItem("otpResendEndTime");
    if (storedEndTime) {
      const remainingTime = Math.floor(
        (parseInt(storedEndTime, 10) - Date.now()) / 1000
      );
      return remainingTime > 0 ? remainingTime : 0;
    }
    return 0;
  };

  // State for countdown timer and disabling the button
  const [countdown, setCountdown] = useState(calculateInitialCountdown);
  const [isDisabled, setIsDisabled] = useState(countdown > 0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        localStorage.setItem(
          "otpResendEndTime",
          (Date.now() + (countdown - 1) * 1000).toString()
        );
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsDisabled(false);
      localStorage.removeItem("otpResendEndTime");
    }
  }, [countdown]);

  // Function to handle OTP verification
  const handleVerifiedOTP = (isAccountVerified: boolean) => {
    const temporaryUserInfo = JSON.parse(
      localStorage.getItem("temporaryUserInfo") || "{}"
    );
    temporaryUserInfo.isAccountVerified = isAccountVerified;

    localStorage.removeItem("temporaryUserInfo");
  };

  //=============
  // HANDLE SUBMIT
  //=============
  const handleSubmit = async (
    values: OtpValues,
    actions: FormikHelpers<OtpValues>
  ) => {
    try {
      dispatch({ type: "SUBMIT_REQUEST" });

      // Retrieve temporary user info from local storage
      const temporaryUserInfo = JSON.parse(
        localStorage.getItem("temporaryUserInfo") || "{}"
      );

      const { data } = await axios.put(
        `${request}/api/users/verify-otp`,
        {
          otp: values.otp,
        },
        {
          headers: { Authorization: `Bearer ${temporaryUserInfo.token}` },
        }
      );

      dispatch({ type: "SUBMIT_SUCCESS", payload: data });
      toast.success("OTP verified, account created successfully", {
        position: "bottom-center",
      });
      setTimeout(() => {
        actions.resetForm();
      }, 2000);

      // Call the function here and pass the isAccountVerified value
      handleVerifiedOTP(data.isAccountVerified);
      setMenu("created");
    } catch (err) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: getError(err as ErrorResponse),
      });
      toast.error(getError(err as ErrorResponse), {
        position: "bottom-center",
      });
    }
  };

  //==============================
  // Function to handle OTP resend
  //==============================
  const handleResendOtp = async () => {
    try {
      // Retrieve temporary user info from local storage
      const temporaryUserInfo = JSON.parse(
        localStorage.getItem("temporaryUserInfo") || "{}"
      );

      if (temporaryUserInfo && temporaryUserInfo.email) {
        // Your logic to resend OTP
        await axios.post(`${request}/api/users/otp-verification`, {
          email: temporaryUserInfo.email,
          phone: temporaryUserInfo.phone,
        });

        toast.success("Verification email resent successfully", {
          position: "bottom-center",
        });

        setIsDisabled(true);
        const endTime = Date.now() + 60000; // 60 seconds from now
        setCountdown(60); // Start the countdown for 1 minute
        localStorage.setItem("otpResendEndTime", endTime.toString());
      } else {
        // Handle the case where email is not found in local storage
        toast.error("Email not found in local storage", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      toast.error(getError(err as ErrorResponse), {
        position: "bottom-center",
      });
    }
  };

  return (
    <Box className="menu_modal otp_menu">
      <div className="close_icon">
        <span className="a_flex" onClick={onClose}>
          <CloseIcon className="icon" />
          <small>Close</small>
        </span>
      </div>
      <div className="otp_created_pending_login header_box">
        <div className="img_width l_flex">
          {" "}
          <div className="img">
            <img src={v1} alt="otp verify" />
          </div>
        </div>
        <div className="form_box">
          <Formik
            initialValues={initialOtpValues}
            validationSchema={otpSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, errors, values }) => {
              const isOtpComplete = values.otp.length === 6;
              const hasErrors =
                Object.keys(errors).length > 0 || !isOtpComplete;

              return (
                <Form>
                  <div className="inner_form">
                    <div className="form_group a_flex">
                      <Field name="otp">
                        {({
                          field,
                        }: {
                          field: { value: string; name: string };
                        }) => (
                          <OtpInput
                            value={field.value}
                            onChange={(otp) => setFieldValue("otp", otp)}
                            numInputs={6}
                            inputType="number"
                            renderSeparator={
                              <span className="input_span"></span>
                            }
                            renderInput={(props) => <input {...props} />}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="otp"
                        component="div"
                        className="error"
                      />
                    </div>

                    <div className="form_group">
                      <div className="text_details">
                        <h3>Otp Verification</h3>
                        <small className="">
                          An OTP code has been sent to your phone number and
                          email address. Kindly check and input to verify.
                        </small>
                      </div>
                      <div className="btn l_flex">
                        <button
                          type="submit"
                          className={
                            hasErrors ? " disabled l_flex" : "main_btn l_flex"
                          }
                          disabled={isSubmitting || hasErrors}
                        >
                          {isSubmitting ? (
                            <span className="a_flex">
                              <i className="fa fa-spinner fa-spin"></i>
                              Verifying...
                            </span>
                          ) : (
                            "Verify"
                          )}
                        </button>
                      </div>
                      <div className="text_details">
                        <small>
                          Didn't receive OTP?{" "}
                          <span
                            onClick={isDisabled ? undefined : handleResendOtp}
                            style={{
                              cursor: isDisabled ? "not-allowed" : "pointer",
                              color: isDisabled ? "grey" : "green",
                            }}
                          >
                            Resend
                          </span>
                        </small>
                        {isDisabled && (
                          <div className="timer">
                            {formatTime(countdown)} left
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Box>
  );
}

export default OtpVerificationDropDownMenu;
