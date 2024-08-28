import axios from "axios";
import "./styles.scss";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import sb from "../../assets/home/sb.png";
import sb1 from "../../assets/home/sb1.png";
import { request } from "../../base url/BaseUrl";
import { getError } from "../../utilities/utils/Utils";
import { validationSchema } from "../../schema/Index";

interface FormValues {
  email: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

function Subscriber() {
  const initialValues: FormValues = {
    email: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      await axios.post(`${request}/api/message/subscribe`, {
        email: values.email,
      });
      toast.success("You have successfully subscribed to our newsletter", {
        position: "bottom-center",
      });
      resetForm();
    } catch (err) {
      toast.error(getError(err as ErrorResponse), {
        position: "bottom-center",
      });
    }
  };
  return (
    <div className="subscriber">
      <div className="container">
        <div className="content l_flex">
          <div className="box l_flex">
            <div className="box_content">
              <div className="head">
                <h2>
                  Stay Informed with VotersHQ by Subscribing to Our Newsletter
                </h2>
              </div>{" "}
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="form_box p_flex">
                    <div className="inner_form f_flex">
                      <div className="form_group">
                        <Field
                          name="email"
                          type="email"
                          placeholder="Enter your email address to subscribe"
                          className="input"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div className="btn">
                        <button
                          className="main_btn"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="l_flex">
                              <i className="fa fa-spinner fa-spin"></i>
                              Submitting...
                            </span>
                          ) : (
                            "Subscribe"
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="style_one d_flex">
              <img src={sb} alt="styles" className="sb_one" />
              <img src={sb1} alt="styles" className="sb_two" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscriber;
