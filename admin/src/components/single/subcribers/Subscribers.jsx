import { useContext, useEffect, useReducer, useRef, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import JoditEditor from "jodit-react";
import "./styles.scss";
import { Context } from "../../../../context/Context";
import { request } from "../../../../base url/BaseUrl";
import { getError } from "../../../../utilities/utils/Utils";
import LoadingBox from "../../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../../utilities/message loading/MessageBox";
import HtmlNewsLetter from "./upload html/HtmlNewsLetter";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUBSCRIBER_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUBSCRIBER_SUCCESS":
      return { ...state, loading: false, subscribers: action.payload };
    case "FETCH_SUBSCRIBER_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    case "SEND_REQUEST":
      return { ...state, loadingSend: true };
    case "SEND_SUCCESS":
      return { ...state, loadingSend: false };
    case "SEND_FAIL":
      return { ...state, loadingSend: false };

    default:
      return state;
  }
};

const columns = [
  { field: "_id", headerName: "ID", width: 420 },
  { field: "email", headerName: "Email", width: 320 },
  {
    field: "createdAt",
    headerName: "Date",
    width: 280,
    renderCell: (params) => {
      return (
        <>
          <div className="cellWidthImg">
            <ReactTimeAgo
              date={Date.parse(params.row.createdAt)}
              locale="en-US"
            />
          </div>
        </>
      );
    },
  },
];
function Subscribers() {
  const editor = useRef(null);

  const { state } = useContext(Context);
  const { userInfo } = state;

  const [
    { loading, error, loadingSend, loadingUpload, subscribers },
    dispatch,
  ] = useReducer(reducer, {
    subscribers: [],
    loadingSend: false,
    loadingUpload: false,
    loading: false,
    error: "",
  });

  //=====================
  //FETCH ALL SUBSCRIBERS
  //=====================

  const fetchData = async () => {
    dispatch({ type: "FETCH_SUBSCRIBER_REQUEST" });
    try {
      const { data } = await axios.get(`${request}/api/message`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "FETCH_SUBSCRIBER_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_SUBSCRIBER_FAIL", payload: getError(err) });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  //==============
  // UPLOAD HANDLER
  //==============
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file); // Use the field name expected by the backend

    dispatch({ type: "UPLOAD_REQUEST" });

    try {
      await axios.post(`${request}/api/message/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      toast.success("File uploaded successfully");
      // Optionally fetch updated subscribers list
      fetchData();
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
      toast.error("Failed to upload file");
    }
  };

  //=================
  //DELETE SUBSCRIBERS
  //=================
  const deleteHandler = async (subscriber) => {
    try {
      // Display a confirmation dialog
      const confirmed = window.confirm(
        "Are you sure you want to delete this subscriber?"
      );

      if (!confirmed) {
        return; // Do nothing if the user cancels the deletion
      }

      dispatch({ type: "DELETE_REQUEST" });

      await axios.delete(`${request}/api/message/${subscriber.id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      toast.success("Deleted successfully", {
        position: "bottom-center",
      });

      dispatch({ type: "DELETE_SUCCESS" });
      fetchData();
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  //=====
  //SEND
  //=====
  const submitHandler = async (e) => {
    e.preventDefault();
    // Check if message or subject is empty
    if (!subject || !message) {
      toast.error("Please provide a subject and message", {
        position: "bottom-center",
      });
      return;
    }
    dispatch({ type: "SEND_REQUEST" });
    try {
      const { data } = await axios.post(`${request}/api/message/send`, {
        subject,
        message,
      });
      dispatch({ type: "SEND_SUCCESS", payload: data });
      toast.success("Email sent successfully", { position: "bottom-center" });

      // Clear form fields
      setSubject("");
      setMessage("");
    } catch (err) {
      dispatch({ type: "SEND_FAIL" });
      toast.error(getError(err), { position: "bottom-center" });
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (subscriber) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => deleteHandler(subscriber)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const customTranslations = {
    noRowsLabel: "No subscriber found", // Customize the "No Rows" message here
  };
  return (
    <div className="admin_page_all  admin_page_screen">
      <div className="container">
        <div className="productTitleContainer">
          <h3 className="productTitle light_shadow uppercase">
            All Subscribers
          </h3>
        </div>
        <div className="subscribers">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <div className="light_shadow">
                <div className="list">
                  <span className="c_flex">
                    <h3 className="mb">Subscribers</h3>

                    <span className="right">
                      <label htmlFor="files" className="">
                        <div className="icon_btn a_flex">
                          {loadingUpload ? (
                            <i className="fa fa-spinner fa-spin"></i>
                          ) : (
                            <DriveFolderUploadIcon className="icon" />
                          )}
                          <span className="text">Upload</span>
                        </div>
                        <input
                          style={{ display: "none" }}
                          type="file"
                          id="files"
                          onChange={(e) => uploadFileHandler(e, true)}
                        />{" "}
                      </label>

                      <small>file type .txt files only</small>
                    </span>
                  </span>
                  <DataGrid
                    className="datagrid"
                    rows={subscribers}
                    localeText={customTranslations}
                    getRowId={(row) => row._id}
                    columns={columns.concat(actionColumn)}
                    autoPageSize
                    rowsPerPageOptions={[8]}
                  />
                </div>
              </div>
              <div className="light_shadow html_news">
                <HtmlNewsLetter />
              </div>
              <div className="light_shadow">
                <div className="">
                  <h3>Send News Letter</h3>
                  <form
                    action=""
                    className="settingsForm"
                    onSubmit={submitHandler}
                  >
                    <div className="settingsItem">
                      <input
                        type="text"
                        className="input_box"
                        placeholder="Subject e.g news letter"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                      <div className="form_box">
                        <JoditEditor
                          className="editor"
                          id="desc"
                          ref={editor}
                          value={message}
                          // config={config}
                          tabIndex={1} // tabIndex of textarea
                          onBlur={(newContent) => setMessage(newContent)} // preferred to use only this option to update the content for performance reasons
                        />
                      </div>{" "}
                      <div className="settings_btn">
                        <button
                          className="add_btn sendButton"
                          disabled={loadingSend}
                        >
                          {loadingSend ? (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Subscribers;
