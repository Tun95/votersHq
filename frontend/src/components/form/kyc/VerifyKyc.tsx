import { useState } from "react";
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
import { FetchedKYCData, KycValues } from "../../../types/auth/types";
import { kycSchema } from "../../../schema/Index";

//KYC DROPDOWN MENU
const initialKycValues = {
  ninNumber: "",
  dob: "",
  firstName: "",
  lastName: "",
  stateOfOrigin: "",
  stateOfResidence: "",
};

interface VerifyKycDropDownMenuProps {
  onClose: () => void;
  setMenu: (
    menu: "register" | "otp" | "kyc" | "created" | "pending" | "login"
  ) => void;
}

function VerifyKycDropDownMenu({
  onClose,
  setMenu,
}: VerifyKycDropDownMenuProps) {
  const [isNinVerified, setIsNinVerified] = useState(false);
  const [fetchedData, setFetchedData] = useState<FetchedKYCData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  //==================================
  // VERIFY NIN AND FETCH NIN DATA TO FILL THE BOXES HANDLER
  //==================================
  const verifyHandler = async (
    values: KycValues,
    setFieldValue: FormikHelpers<KycValues>["setFieldValue"]
  ) => {
    try {
      setIsLoading(true); // Start loading
      const { ninNumber, dob } = values;

      if (!ninNumber || !dob) {
        toast.error("Please provide both NIN and Date of Birth.", {
          position: "bottom-center",
        });
        return;
      }

      // Reformat dob from YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = dob.split("-");
      const formattedDob = `${day}/${month}/${year}`;

      const { data } = await axios.post<FetchedKYCData>(
        `${request}/api/users/verify-nin`,
        {
          ninNumber,
          dob: formattedDob, // Send reformatted dob
        }
      );

      setFieldValue("firstName", data.userData?.firstName);
      setFieldValue("lastName", data.userData?.lastName);

      setFetchedData(data);
      setIsNinVerified(true);

      toast.success("NIN Verified Successfully!", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err as ErrorResponse), {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  //==================================
  // KYC SUBMIT HANDLER
  //==================================
  const handleSubmit = async (
    values: KycValues,
    actions: FormikHelpers<KycValues>
  ) => {
    console.log("Submitting KYC:", values); // Debug log

    try {
      const errors = await actions.validateForm(values);
      console.log("Validation Errors:", errors); // Debug log for validation errors
      if (Object.keys(errors).length > 0) {
        return;
      }

      const temporaryUserInfo = JSON.parse(
        localStorage.getItem("temporaryUserInfo") || "{}"
      );

      const region =
        stateRegionMap[values.stateOfOrigin as keyof typeof stateRegionMap];

      await axios.post(`${request}/api/users/kyc/${temporaryUserInfo._id}`, {
        ninNumber: values.ninNumber,
        dob: values.dob,
        firstName: values.firstName,
        lastName: values.lastName,
        stateOfOrigin: values.stateOfOrigin,
        stateOfResidence: values.stateOfResidence,
        region,
      });

      setTimeout(() => {
        actions.resetForm();
      }, 1000);

      setMenu("created");
      localStorage.removeItem("temporaryUserInfo");
    } catch (err) {
      toast.error(getError(err as ErrorResponse), {
        position: "bottom-center",
      });
    }
  };

  console.log("NINDATA:", fetchedData);

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
              validationSchema={kycSchema}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(true);
                await handleSubmit(values, actions);
                actions.setSubmitting(false); // Ensure it's reset after submission
              }}
            >
              {({
                touched,
                errors,
                isSubmitting,
                setFieldValue,
                values,
              }) => (
                <Form>
                  {/* STEP 1: NIN and Date of Birth Information */}
                  <div className="inner_form">
                    <div className="grid_form">
                      <div
                        className={`form_group ${
                          touched.ninNumber && errors.ninNumber ? "error" : ""
                        }`}
                      >
                        <label htmlFor="ninNumber">
                          NIN Number<span className="red">*</span>
                        </label>
                        <Field
                          type="text"
                          id="ninNumber"
                          name="ninNumber"
                          maxLength={11}
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
                        <label htmlFor="dob">
                          Date of Birth:<span className="red">*</span>
                        </label>
                        <Field
                          type="date"
                          id="dob"
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
                    </div>

                    {/* VERIFY BUTTON */}
                    {!isNinVerified && !fetchedData && (
                      <div className="form_group">
                        <div className="btn l_flex">
                          <button
                            type="button"
                            className="main_btn l_flex"
                            onClick={() => verifyHandler(values, setFieldValue)}
                            disabled={isLoading} // Disable button when loading
                          >
                            {isLoading ? (
                              <span className="a_flex">
                                <i className="fa fa-spinner fa-spin"></i>
                                Verifying...
                              </span>
                            ) : (
                              "Submit KYC"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 2: Display Fetched Information */}
                  {isNinVerified && fetchedData && (
                    <div className="inner_form">
                      <div className="grid_form">
                        <div className="form_group">
                          <label>First Name</label>
                          <Field
                            type="text"
                            name="firstName"
                            value={fetchedData?.userData?.firstName}
                            disabled
                            placeholder="First Name"
                          />
                        </div>
                        <div className="form_group">
                          <label>Last Name</label>
                          <Field
                            type="text"
                            name="lastName"
                            value={fetchedData.userData?.lastName}
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
                            disabled={isSubmitting || isLoading} // Ensure it isn't disabled by either isSubmitting or isLoading
                          >
                            {isSubmitting || isLoading ? (
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
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default VerifyKycDropDownMenu;
