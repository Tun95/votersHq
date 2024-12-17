import { RegionDropdown } from "react-country-region-selector";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import { Formik, ErrorMessage, Form, Field, FormikHelpers } from "formik";
import "../styles.scss";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { toast } from "react-toastify";
import {
  ErrorResponse,
  getError,
  stateRegionMap,
} from "../../../utilities/utils/Utils";
import { SubmitKycValues } from "../../../types/auth/types";
import { kycSbmitSchema } from "../../../schema/Index";
import { useEffect, useState } from "react";

interface SubmitKycDropDownMenuProps {
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

function SubmitKycDropDownMenu({
  onClose,
  setMenu,
}: SubmitKycDropDownMenuProps) {
  const [initialKycValues, setInitialKycValues] = useState<SubmitKycValues>({
    ninNumber: "",
    dob: "",
    gender: "",
    firstName: "",
    lastName: "",
    stateOfOrigin: "",
    stateOfResidence: "",
  });

  useEffect(() => {
    console.log(initialKycValues); // Log to check if initial values are updated correctly
  }, [initialKycValues]);

  useEffect(() => {
    const savedKycData = JSON.parse(localStorage.getItem("kycData") || "{}");
    console.log(savedKycData); // Add this line to check if the data exists
    const userData = savedKycData.userData || {}; // Access userData safely

    setInitialKycValues({
      ninNumber: userData.ninNumber || "",
      dob: userData.dob || "",
      gender: userData.gender || "",
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      stateOfOrigin: savedKycData.stateOfOrigin || "",
      stateOfResidence: savedKycData.stateOfResidence || "",
    });
  }, []);

  // KYC SUBMIT HANDLER
  const handleSubmit = async (
    values: SubmitKycValues,
    actions: FormikHelpers<SubmitKycValues>
  ) => {
    console.log("Submitting KYC:", values); // Debug log

    try {
      const errors = await actions.validateForm(values);
      console.log("Validation Errors:", errors); // Debug log for validation errors
      if (Object.keys(errors).length > 0) {
        return;
      }

      // Save data to localStorage before submitting
      localStorage.setItem("kycData", JSON.stringify(values));

      const temporaryUserInfo = JSON.parse(
        localStorage.getItem("temporaryUserInfo") || "{}"
      );

      const region =
        stateRegionMap[values.stateOfOrigin as keyof typeof stateRegionMap];

      await axios.post(`${request}/api/users/kyc/${temporaryUserInfo._id}`, {
        ninNumber: values.ninNumber,
        dob: values.dob,
        gender: values.gender,
        firstName: values.firstName,
        lastName: values.lastName,
        stateOfOrigin: values.stateOfOrigin,
        stateOfResidence: values.stateOfResidence,
        region,
      });

      setTimeout(() => {
        actions.resetForm();
        localStorage.removeItem("kycData"); // Remove localStorage data after successful submission
        localStorage.removeItem("temporaryUserInfo");
      }, 1000);

      setMenu("created");
    } catch (err) {
      toast.error(getError(err as ErrorResponse), {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="verify_kyc">
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
              <h2>Verify your Identity (KYC)</h2>
              <small>
                Providing your NIN helps us verify your identity, ensuring that
                each vote is unique and secure while tailoring bills and
                policies to reflect the issues most relevant to you. Rest
                assured, your information is securely stored and used solely for
                these purposes. Protecting your privacy is our highest priority.
              </small>
            </div>
          </div>
          <div className="form_box">
            <Formik
              initialValues={initialKycValues}
              validationSchema={kycSbmitSchema}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(true);
                await handleSubmit(values, actions);
                actions.setSubmitting(false);
              }}
              enableReinitialize
            >
              {({ touched, errors, isSubmitting, setFieldValue, values }) => (
                <Form>
                  <div className="inner_form">
                    <div className="grid_form">
                      <div
                        className={`form_group ${
                          touched.ninNumber && errors.ninNumber ? "error" : ""
                        }`}
                      >
                        <label htmlFor="ninNumber">NIN Number</label>
                        <Field
                          type="text"
                          id="ninNumber"
                          name="ninNumber"
                          maxLength={11}
                          disabled
                          placeholder="Enter your NIN number"
                          className={`input_box ${
                            touched.ninNumber && errors.ninNumber
                              ? "error-border"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="ninNumber"
                          component="div"
                          className="error"
                        />
                      </div>

                      <div
                        className={`form_group ${
                          touched.dob && errors.dob ? "error" : ""
                        }`}
                      >
                        <label htmlFor="dob">Date of Birth:</label>
                        <Field
                          type="date"
                          id="dob"
                          disabled
                          name="dob"
                          className={`input_box date_box ${
                            touched.dob && errors.dob ? "error-border" : ""
                          }`}
                        />
                        <ErrorMessage
                          name="dob"
                          component="div"
                          className="error"
                        />
                      </div>

                      <div className="form_group">
                        <label>First Name</label>
                        <Field
                          type="text"
                          name="firstName"
                          disabled
                          placeholder="First Name"
                        />
                      </div>
                      <div className="form_group">
                        <label>Last Name</label>
                        <Field
                          type="text"
                          name="lastName"
                          disabled
                          placeholder="Last Name"
                        />
                      </div>

                      {/* State of Origin */}
                      <div
                        className={`form_group ${
                          touched.stateOfOrigin && errors.stateOfOrigin
                            ? "error"
                            : ""
                        }`}
                      >
                        <label htmlFor="stateOfOrigin">
                          State of Origin <span className="red">*</span>
                        </label>
                        <RegionDropdown
                          country="Nigeria"
                          value={values.stateOfOrigin}
                          id="stateOfOrigin"
                          name="stateOfOrigin"
                          onChange={(val) =>
                            setFieldValue("stateOfOrigin", val)
                          }
                          classes="select"
                        />
                        <ErrorMessage
                          name="stateOfOrigin"
                          component="div"
                          className="error"
                        />
                      </div>

                      {/* State of Residence */}
                      <div
                        className={`form_group ${
                          touched.stateOfResidence && errors.stateOfResidence
                            ? "error"
                            : ""
                        }`}
                      >
                        <label htmlFor="stateOfResidence">
                          State of Residence <span className="red">*</span>
                        </label>
                        <RegionDropdown
                          country="Nigeria"
                          value={values.stateOfResidence}
                          id="stateOfResidence"
                          name="stateOfResidence"
                          onChange={(val) =>
                            setFieldValue("stateOfResidence", val)
                          }
                          classes="select"
                        />
                        <ErrorMessage
                          name="stateOfResidence"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
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
                              Submitting...
                            </span>
                          ) : (
                            "Confirm KYC"
                          )}
                        </button>
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

export default SubmitKycDropDownMenu;
