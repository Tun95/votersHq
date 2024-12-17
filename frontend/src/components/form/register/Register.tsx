import { useState } from "react";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import { Formik, ErrorMessage, Form, Field, FormikHelpers } from "formik";
import { Link } from "react-router-dom";
import "../styles.scss";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { toast } from "react-toastify";
import { ErrorResponse, getError } from "../../../utilities/utils/Utils";
import { RegisterValues } from "../../../types/auth/types";
import { registerSchema } from "../../../schema/Index";

//REGISTER DROPDOWN MENU
const initialRegisterValues = {
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

interface RegisterDropDownMenuProps {
  onClose: () => void;
  setMenu: (
    menu:
      | "register"
      | "otp"
      | "verifyKyc"
      | "submitKyc"
      | "created"
      | "pending"
      | "login"
  ) => void;
}
function RegisterDropDownMenu({ onClose, setMenu }: RegisterDropDownMenuProps) {
  // Toggle password visibility
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const [passwordIcon, setPasswordIcon] = useState<string>(eyeOff);

  const [confirmPasswordType, setConfirmPasswordType] = useState<
    "password" | "text"
  >("password");
  const [confirmPasswordIcon, setConfirmPasswordIcon] =
    useState<string>(eyeOff);

  const handleToggle = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setPasswordType(passwordType === "password" ? "text" : "password");
      setPasswordIcon(passwordIcon === eyeOff ? eye : eyeOff);
    } else if (field === "confirmPassword") {
      setConfirmPasswordType(
        confirmPasswordType === "password" ? "text" : "password"
      );
      setConfirmPasswordIcon(confirmPasswordIcon === eyeOff ? eye : eyeOff);
    }
  };

  //==================================
  //REGISTER AND VERIFICATION HANDLER
  //==================================
  const handleSubmit = async (
    values: RegisterValues,
    actions: FormikHelpers<RegisterValues>
  ) => {
    try {
      const { data } = await axios.post(`${request}/api/users/signup`, {
        email: values.email,
        phone: values.phone,

        password: values.password,
      });

      localStorage.setItem("temporaryUserInfo", JSON.stringify(data));

      // Send OTP verification email
      const otpResponse = await axios.post(
        `${request}/api/users/otp-verification`,
        {
          email: values.email,
          phone: values.phone,
        }
      );

      if (otpResponse.status === 200) {
        // Redirect to OTP verification screen
        setTimeout(() => {
          actions.resetForm();
        }, 1000);

        setMenu("otp");
        toast.success(
          "An OTP Verification email has been sent to your email.",
          {
            position: "bottom-center",
          }
        );
      } else {
        // Handle error
        toast.error("Failed to send verification email", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      toast.error(getError(err as ErrorResponse), {
        position: "bottom-center",
      });
    }
  };

  //Navigate to Login Menu
  const navigateToLogin = () => {
    setMenu("login");
  };

  return (
    <div>
      <Box className=" menu_modal">
        <div className="close_icon">
          <span className="a_flex" onClick={onClose}>
            <CloseIcon className="icon" />
            <small>Close</small>
          </span>
        </div>
        <div className="header_box register_header_box">
          <div className="menu_header ">
            <div className="left">
              <h2>Register</h2>
              <small>
                Register to enjoy the liberty of getting involved in the
                politics and situations of Nigeria
              </small>
            </div>
          </div>
          <div className="form_box">
            <Formik
              initialValues={initialRegisterValues}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <div className="inner_form">
                    <div className="grid_form">
                      <div
                        className={`form_group ${
                          touched.email && errors.email ? "error" : ""
                        }`}
                      >
                        <label htmlFor="email">
                          Email Address<span className="red">*</span>
                        </label>
                        <Field
                          type="text"
                          id="email"
                          name="email"
                          placeholder="Enter your email address"
                          className={`input_box ${
                            touched.email && errors.email ? "error-border" : ""
                          }`}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div
                        className={`form_group ${
                          touched.phone && errors.phone ? "error" : ""
                        }`}
                      >
                        <label htmlFor="phone">
                          Phone Number<span className="red">*</span>
                        </label>
                        <Field
                          type="text"
                          id="phone"
                          name="phone"
                          placeholder="Enter your phone number"
                          className={`input_box ${
                            touched.phone && errors.phone ? "error-border" : ""
                          }`}
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="error"
                        />
                      </div>

                      <div
                        className={`form_group ${
                          touched.password && errors.password ? "error" : ""
                        }`}
                      >
                        <label htmlFor="password">
                          Password<span className="red">*</span>
                        </label>
                        <Field
                          type={passwordType}
                          id="password"
                          name="password"
                          placeholder="Enter your password"
                          className={`input_box ${
                            touched.password && errors.password
                              ? "error-border"
                              : ""
                          }`}
                        />
                        <span
                          className="toggle_password"
                          onClick={() => handleToggle("password")}
                        >
                          <Icon
                            icon={passwordIcon}
                            size={16}
                            className="eye_icon"
                          />
                        </span>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="error"
                        />
                      </div>

                      <div
                        className={`form_group ${
                          touched.confirmPassword && errors.confirmPassword
                            ? "error"
                            : ""
                        }`}
                      >
                        <label htmlFor="confirmPassword">
                          Confirm Password<span className="red">*</span>
                        </label>
                        <Field
                          type={confirmPasswordType}
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Re-enter your password"
                          className={`input_box ${
                            touched.confirmPassword && errors.confirmPassword
                              ? "error-border"
                              : ""
                          }`}
                        />
                        <span
                          className="toggle_password"
                          onClick={() => handleToggle("confirmPassword")}
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

                    <div className="form_group">
                      <div className="text_details">
                        <small className="">
                          By clicking register, you agree to our &nbsp;
                          <Link onClick={onClose} to="/terms" className="green">
                            Terms of Service
                          </Link>
                          &nbsp; and &nbsp;
                          <Link
                            onClick={onClose}
                            to="/policy"
                            className="green"
                          >
                            Privacy Policy.
                          </Link>
                        </small>
                      </div>
                      <div className="btn l_flex">
                        <button
                          type="submit"
                          className="main_btn l_flex"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="a_flex">
                              <i className="fa fa-spinner fa-spin"></i>
                              Registering...
                            </span>
                          ) : (
                            "Register"
                          )}
                        </button>
                      </div>
                      <div className="text_details">
                        <small className="">
                          Already have an account? &nbsp;
                          <span
                            onClick={navigateToLogin}
                            className="green onClick_span"
                          >
                            Log in
                          </span>
                        </small>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default RegisterDropDownMenu;
