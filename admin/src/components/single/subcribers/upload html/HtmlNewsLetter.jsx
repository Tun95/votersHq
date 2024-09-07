import { useReducer, useRef, useState } from "react";
import axios from "axios";
import { request } from "../../../../../base url/BaseUrl";
import { getError } from "../../../../../utilities/utils/Utils";
import { toast } from "react-toastify";

import "./styles.scss";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    case "SEND_REQUEST":
      return { ...state, loadingSend: true, errorSend: "" };
    case "SEND_SUCCESS":
      return { ...state, loadingSend: false, errorSend: "" };
    case "SEND_FAIL":
      return { ...state, loadingSend: false, errorSend: action.payload };

    default:
      return state;
  }
};

function HtmlNewsLetter() {
  const [{ loadingUpload, loadingSend }, dispatch] = useReducer(reducer, {
    loadingUpload: false,
    loadingSend: false,
    errorUpload: "",
    errorSend: "",
  });
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [filename, setFilename] = useState("");

  //=============================
  // UPLOAD EMAIL TEMPLATE HANDLER
  //=============================
  const uploadFileHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPLOAD_REQUEST" });
    try {
      const formData = new FormData();
      formData.append("htmlFile", file);

      const { data } = await axios.post(
        `${request}/api/message/upload-html`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS", payload: data });
      setFilename(data.filename);
      toast.success("File uploaded successfully", {
        position: "bottom-center",
      });
    } catch (error) {
      dispatch({ type: "UPLOAD_FAIL", payload: error.message });
      toast.error(getError(error), { position: "bottom-center" });
    }
  };

  //=============================
  // SEND EMAIL TEMPLATE HANDLER
  //=============================
  const sendEmailHandler = async (e) => {
    e.preventDefault();
    if (!subject) {
      toast.error("Please provide email subject", {
        position: "bottom-center",
      });
      return;
    }
    dispatch({ type: "SEND_REQUEST" });
    try {
      const { data } = await axios.post(`${request}/api/message/send-html`, {
        subject,
        filename,
      });
      dispatch({ type: "SEND_SUCCESS", payload: data });
      toast.success("Email sent successfully", { position: "bottom-center" });
      // Reset form fields
      setFile(null);
      setSubject("");
      setFilename("");
      // Reset file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      dispatch({ type: "SEND_FAIL" });
      toast.error(getError(error), { position: "bottom-center" });
    }
  };

  return (
    <div className="html_news_letter">
      <h3>HTML Newsletter</h3>

      {/* Upload HTML File */}
      <form onSubmit={uploadFileHandler}>
        <div className="upload_input_btn">
          {" "}
          <div className="upload_label">
            <label htmlFor="file_upload">Upload HTML File: </label>
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <span className="">
            <button
              className="add_btn upload_btn"
              type="submit"
              disabled={loadingUpload}
            >
              {loadingUpload ? (
                <span className="a_flex">
                  <i className="fa fa-spinner fa-spin"></i>
                  Uploading...
                </span>
              ) : (
                "Upload"
              )}
            </button>
          </span>
        </div>
      </form>

      {/* Send Email */}
      {filename && (
        <form onSubmit={sendEmailHandler} className="lower_form ">
          <div>
            <label htmlFor="subject">Email Subject: </label>
            <input
              type="text"
              id="subject"
              className="input_box"
              placeholder="Subject e.g news letter"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              // required
            />
          </div>
          <span className="send_upload_btn">
            <button
              className="add_btn sendButton"
              type="submit"
              disabled={loadingSend}
            >
              {loadingSend ? (
                <span className="a_flex">
                  <i className="fa fa-spinner fa-spin"></i>
                  Sending...
                </span>
              ) : (
                "Send Email"
              )}
            </button>
          </span>
        </form>
      )}
    </div>
  );
}

export default HtmlNewsLetter;
