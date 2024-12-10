import "./styles.scss";
import XIcon from "@mui/icons-material/X";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import { toast } from "react-toastify";
import { ErrorResponse, getError } from "../../../utilities/utils/Utils";
import { request } from "../../../base url/BaseUrl";
import { contactSchema } from "../../../schema/Index";
import {
  ContactFormValues,
  initialContactValues,
} from "../../../types/contact/types";

function ContactComponent() {
  // SUBMIT HANDLER
  const handleSubmit = async (
    values: ContactFormValues,
    { resetForm }: FormikHelpers<ContactFormValues>
  ) => {
    try {
      // Send data to your API or handle the submission
      await axios.post(`${request}/api/message/contact`, {
        name: values.name,
        email: values.email,
        message: values.message,
      });
      toast.success("Message sent successfully!");
      resetForm(); // Reset the form after submission
    } catch (error) {
      toast.error(getError(error as ErrorResponse));
    }
  };
  return (
    <div className="contact_component">
      <div className="container">
        <div className="width_container">
          <div className="content">
            <div className="left">
              {/* Formik Wrapper */}
              <Formik
                initialValues={initialContactValues}
                validationSchema={contactSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="form_box">
                    <div className="form_group f_flex">
                      <label htmlFor="name">Full Name</label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your Full Name"
                        className="input_box"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="error"
                      />
                    </div>

                    <div className="form_group f_flex">
                      <label htmlFor="email">Email Address</label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Your Email Address"
                        className="input_box"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="error"
                      />
                    </div>

                    <div className="form_group f_flex">
                      <label htmlFor="message">Message</label>
                      <Field
                        as="textarea"
                        id="message"
                        name="message"
                        placeholder="Your Message"
                        className="input_box"
                      />
                      <ErrorMessage
                        name="message"
                        component="div"
                        className="error"
                      />
                    </div>

                    <div className="form_group">
                      <div className="btn">
                        <button
                          type="submit"
                          className="main_btn "
                          disabled={isSubmitting}
                        >
                          <small className="l_flex">
                            {isSubmitting ? (
                              <span className="a_flex">
                                <i className="fa fa-spinner fa-spin"></i>
                                Sending....
                              </span>
                            ) : (
                              "Send Message"
                            )}
                          </small>
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="right">
              <div className="call_us">
                {" "}
                <div className="">
                  <h3>Email us</h3>
                </div>
                <div className="text">
                  <small>
                    <p>Send us an email today or fill the contact form</p>
                  </small>
                </div>
                <div className="list">
                  <ul>
                    <li className="a_flex">
                      <i className="fa-regular fa-paper-plane"></i>
                      <a href="mailto:hello@votershq.com">hello@votershq.com</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="chat_with_us">
                <div className="">
                  <h3>Connect with us</h3>
                </div>
                <div className="text">
                  <small>
                    <p>Follow us on all social media </p>
                  </small>
                </div>
                <div className="list">
                  <ul>
                    <li className="a_flex">
                      <XIcon className="icon" />
                      <a
                        href="https://x.com/voters_hq"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @Voters_HQ
                      </a>
                    </li>
                    <li className="a_flex">
                      <i className="fa-brands fa-instagram"></i>
                      <a
                        href="https://instagram.com/votershq"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @Voters_HQ
                      </a>
                    </li>
                    <li className="a_flex">
                      <i className="fa-brands fa-linkedin-in"></i>
                      <a
                        href="https://linkedin.com/company/votershq"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voters_HQ
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactComponent;
