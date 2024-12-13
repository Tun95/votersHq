import { useReducer, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";
import { request } from "../../../base url/BaseUrl";

interface State {
  loadingSmsSend: boolean;
  loadingEmailSend: boolean;
}

interface SendSuccessPayload {
  status: string;
  message: string;
}

type Action =
  | { type: "SEND_EMAIL_REQUEST" }
  | { type: "SEND_EMAIL_SUCCESS"; payload: SendSuccessPayload }
  | { type: "SEND_EMAIL_FAIL" }
  | { type: "SEND_SMS_REQUEST" }
  | { type: "SEND_SMS_SUCCESS"; payload: SendSuccessPayload }
  | { type: "SEND_SMS_FAIL" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SEND_EMAIL_REQUEST":
      return { ...state, loadingEmailSend: true };
    case "SEND_EMAIL_SUCCESS":
      return { ...state, loadingEmailSend: false };
    case "SEND_EMAIL_FAIL":
      return { ...state, loadingEmailSend: false };

    case "SEND_SMS_REQUEST":
      return { ...state, loadingSmsSend: true };
    case "SEND_SMS_SUCCESS":
      return { ...state, loadingSmsSend: false };
    case "SEND_SMS_FAIL":
      return { ...state, loadingSmsSend: false };
    default:
      return state;
  }
};

const Messages: React.FC = () => {
  const editor = useRef(null);
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ loadingSmsSend, loadingEmailSend }, dispatch] = useReducer(reducer, {
    loadingSmsSend: false,
    loadingEmailSend: false,
  });

  const [subject, setSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState(""); // Separate state for email
  const [smsMessage, setSmsMessage] = useState(""); // Separate state for SMS

  // Email Handler
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject || !emailMessage) {
      toast.error("Please provide a subject and message", {
        position: "bottom-center",
      });
      return;
    }

    dispatch({ type: "SEND_EMAIL_REQUEST" });

    try {
      const { data } = await axios.post<SendSuccessPayload>(
        `${request}/api/message/send-email`,
        {
          subject,
          message: emailMessage,
        },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      dispatch({ type: "SEND_EMAIL_SUCCESS", payload: data });
      toast.success("Email sent successfully", { position: "bottom-center" });
      setSubject("");
      setEmailMessage("");
    } catch (err) {
      dispatch({ type: "SEND_EMAIL_FAIL" });
      toast.error(getError(err as ErrorResponse));
    }
  };

  // SMS Handler
  const submitSmsHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!smsMessage) {
      toast.error("Please provide an SMS message", {
        position: "bottom-center",
      });
      return;
    }

    dispatch({ type: "SEND_SMS_REQUEST" });

    try {
      const { data } = await axios.post<SendSuccessPayload>(
        `${request}/api/message/send-sms`,
        { message: smsMessage },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      dispatch({ type: "SEND_SMS_SUCCESS", payload: data });
      toast.success("SMS sent successfully", { position: "bottom-center" });
      setSmsMessage("");
    } catch (err) {
      dispatch({ type: "SEND_SMS_FAIL" });
      toast.error(getError(err as ErrorResponse));
    }
  };

 

  return (
    <div className="admin_page_all admin_page_screen">
      <div className="">
        <div className="productTitleContainer">
          <h3 className="productTitle light_shadow uppercase">Message</h3>
        </div>
        <div className="subscribers">
          <div className="light_shadow">
            <h4>Send SMS Message</h4>
            <form className="settingsForm" onSubmit={submitSmsHandler}>
              <div className="settingsItem">
                <div className="form_box">
                  <textarea
                    className="textarea"
                    name="sms"
                    id="sms"
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                  ></textarea>
                </div>
                <div className="settings_btn">
                  <button
                    className="add_btn sendButton"
                    disabled={loadingSmsSend}
                  >
                    {loadingSmsSend ? (
                      <span className="a_flex">
                        <i className="fa fa-spinner fa-spin"></i>
                        Sending...
                      </span>
                    ) : (
                      "Send"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="light_shadow">
            <h4>Send Email Message</h4>
            <form className="settingsForm" onSubmit={submitHandler}>
              <div className="settingsItem">
                <input
                  type="text"
                  className="input_box"
                  placeholder="Subject e.g. message"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <div className="form_box">
                  <JoditEditor
                    className="editor"
                    ref={editor}
                    value={emailMessage}
                    onBlur={(newContent) => setEmailMessage(newContent)}
                  />
                </div>
                <div className="settings_btn">
                  <button
                    className="add_btn sendButton"
                    disabled={loadingEmailSend}
                  >
                    {loadingEmailSend ? (
                      <span className="a_flex">
                        <i className="fa fa-spinner fa-spin"></i>
                        Sending...
                      </span>
                    ) : (
                      "Send"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default Messages;
