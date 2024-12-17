import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import { Formik, ErrorMessage, Form, Field, FormikHelpers } from "formik";
import "../styles.scss";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { toast } from "react-toastify";
import { ErrorResponse, getError } from "../../../utilities/utils/Utils";
import { FetchedKYCData, VerifyKycValues } from "../../../types/auth/types";
import { kycVerifySchema } from "../../../schema/Index";

//KYC DROPDOWN MENU
const initialKycValues = {
  ninNumber: "",
  dob: "",
};

interface VerifyKycDropDownMenuProps {
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

function VerifyKycDropDownMenu({
  onClose,
  setMenu,
}: VerifyKycDropDownMenuProps) {
  //==================================
  // VERIFY NIN AND FETCH NIN DATA TO FILL THE BOXES HANDLER
  //==================================
  const verifyHandler = async (
    values: VerifyKycValues,
    { setSubmitting }: FormikHelpers<VerifyKycValues>
  ) => {
    try {
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
          dob: formattedDob,
        }
      );

      // Save to Local Storage
      localStorage.setItem("kycData", JSON.stringify(data));

      toast.success("NIN Verified Successfully!", {
        position: "bottom-center",
      });

      setMenu("submitKyc");
    } catch (err) {
      toast.error(getError(err as ErrorResponse), {
        position: "bottom-center",
      });
    } finally {
      setSubmitting(false); // Stop the submission state
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
              validationSchema={kycVerifySchema}
              onSubmit={verifyHandler}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
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
                    {/* SUBMIT BUTTON */}
                    <div className="form_group">
                      <div className="btn l_flex">
                        <button
                          type="submit"
                          className="main_btn l_flex"
                          disabled={isSubmitting} // Ensure it isn't disabled by either isSubmitting or isLoading
                        >
                          {isSubmitting ? (
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

export default VerifyKycDropDownMenu;
