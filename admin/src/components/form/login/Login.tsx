import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Formik, ErrorMessage, Form, Field, FormikHelpers } from "formik";
import { loginSchema } from "../../../schema/Index";
import "../styles.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";
import { LoginValues } from "../../../types/auth/types";
import { useNavigate } from "react-router-dom";

// Initial values for the LOGIN form
const initialLoginValues: LoginValues = {
  emailOrPhone: "",
  password: "",
};

function LoginComponent() {
  const navigate = useNavigate();

  const { state: appState, dispatch: ctxDispatch } = useAppContext();
  const { userInfo } = appState;

  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const [passwordIcon, setPasswordIcon] = useState<string>(eyeOff);

  const handleToggle = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
    setPasswordIcon(passwordIcon === eyeOff ? eye : eyeOff);
  };

  //LOGIN HANDLE
  const handleSubmit = async (
    values: LoginValues,
    actions: FormikHelpers<LoginValues>
  ) => {
    try {
      const { data } = await axios.post(`${request}/api/users/admin/signin`, {
        emailOrPhone: values.emailOrPhone,
        password: values.password,
      });

      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Login successfully");
      setTimeout(() => {
        actions.resetForm();
      }, 2000);
      navigate("/");
    } catch (err) {
      toast.error(getError(err as ErrorResponse));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div>
      <Box className="menu_modal login_menu">
        <div className="otp_created_pending_login light_shadow header_box">
          <div className="menu_header">
            <div className="left">
              <h2>Log In</h2>
              <small>
                Enter your registered email address, phone number, and National
                Identification Number (NIN) to log in.
              </small>
            </div>
          </div>
          <div className="form_box">
            <Formik
              initialValues={initialLoginValues}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <div className="inner_form">
                    <div className="grid_form">
                      <div
                        className={`form_group ${
                          touched.emailOrPhone && errors.emailOrPhone
                            ? "error"
                            : ""
                        }`}
                      >
                        <label htmlFor="emailOrPhone">
                          Email Address or Phone Number
                          <span className="red">*</span>
                        </label>
                        <Field
                          type="text"
                          id="emailOrPhone"
                          name="emailOrPhone"
                          placeholder="Enter your email address or phone number"
                          className={`input_box ${
                            touched.emailOrPhone && errors.emailOrPhone
                              ? "error-border"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="emailOrPhone"
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
                          onClick={handleToggle}
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
                    </div>
                    <div className="form_group">
                      <div className="btn l_flex">
                        <button
                          type="submit"
                          className="main_btn l_flex"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="a_flex">
                              <i className="fa fa-spinner fa-spin"></i>
                              Logging in...
                            </span>
                          ) : (
                            "Log In"
                          )}
                        </button>
                      </div>
                      <div className="text_details l_flex">
                        <small className="">
                          Don't have an account? &nbsp;
                          <span
                            onClick={() => navigate("/register")}
                            className="green onClick_span"
                          >
                            Register
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
export default LoginComponent;
