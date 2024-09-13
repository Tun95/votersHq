import { useEffect, useReducer, useRef, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import "./styles.scss";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";
import { request } from "../../../base url/BaseUrl";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";

// Define types for state and actions
interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

interface State {
  subscribers: Subscriber[];
  loading: boolean;
  loadingSend: boolean;
  loadingUpload: boolean;
  loadingDelete?: boolean;
  successDelete?: boolean;
  error?: string;
}

interface SendSuccessPayload {
  status: string;
  message: string;
}

type Action =
  | { type: "FETCH_SUBSCRIBER_REQUEST" }
  | { type: "FETCH_SUBSCRIBER_SUCCESS"; payload: Subscriber[] }
  | { type: "FETCH_SUBSCRIBER_FAIL"; payload: string }
  | { type: "UPLOAD_REQUEST" }
  | { type: "UPLOAD_SUCCESS" }
  | { type: "UPLOAD_FAIL"; payload: string }
  | { type: "DELETE_REQUEST" }
  | { type: "DELETE_SUCCESS" }
  | { type: "DELETE_FAIL" }
  | { type: "DELETE_RESET" }
  | { type: "SEND_REQUEST" }
  | { type: "SEND_SUCCESS"; payload: SendSuccessPayload }
  | { type: "SEND_FAIL" };

const reducer = (state: State, action: Action): State => {
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
      return { ...state, loadingUpload: false, error: action.payload };
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

// Define columns for DataGrid
const columns: GridColDef[] = [
  { field: "_id", headerName: "ID", width: 420 },
  { field: "email", headerName: "Email", width: 320 },
  {
    field: "createdAt",
    headerName: "Date",
    width: 280,
    renderCell: (params) => (
      <div className="cellWidthImg">
        <ReactTimeAgo date={Date.parse(params.row.createdAt)} locale="en-US" />
      </div>
    ),
  },
];

const Subscribers: React.FC = () => {
  const editor = useRef(null);
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ loading, error, loadingSend, subscribers }, dispatch] = useReducer(
    reducer,
    {
      subscribers: [],
      loadingSend: false,
      loadingUpload: false,
      loading: false,
      error: "",
    }
  );

  const fetchData = async () => {
    dispatch({ type: "FETCH_SUBSCRIBER_REQUEST" });
    try {
      const { data } = await axios.get(`${request}/api/message`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      dispatch({ type: "FETCH_SUBSCRIBER_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_SUBSCRIBER_FAIL",
        payload: getError(err as ErrorResponse),
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteHandler = async (subscriber: Subscriber) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscriber?"
    );
    if (!confirmed) return;

    dispatch({ type: "DELETE_REQUEST" });
    try {
      await axios.delete(`${request}/api/message/${subscriber._id}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      toast.success("Deleted successfully", { position: "bottom-center" });
      dispatch({ type: "DELETE_SUCCESS" });
      fetchData();
    } catch (err) {
      toast.error(getError(err as ErrorResponse));
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error("Please provide a subject and message", {
        position: "bottom-center",
      });
      return;
    }
    dispatch({ type: "SEND_REQUEST" });
    try {
      const { data } = await axios.post<SendSuccessPayload>(
        `${request}/api/message/send`,
        {
          subject,
          message,
        }
      );
      dispatch({ type: "SEND_SUCCESS", payload: data });
      toast.success("Email sent successfully", { position: "bottom-center" });
      setSubject("");
      setMessage("");
    } catch (err) {
      dispatch({ type: "SEND_FAIL" });
      toast.error(getError(err as ErrorResponse));
    }
  };

  const actionColumn: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (params) => (
        <div className="cellAction">
          <div
            className="deleteButton"
            onClick={() => deleteHandler(params.row)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  const customTranslations = {
    noRowsLabel: "No subscriber found",
  };

  return (
    <div className="admin_page_all admin_page_screen">
      <div className="">
        <div className="productTitleContainer">
          <h3 className="productTitle light_shadow uppercase">
            All Subscribers
          </h3>
        </div>
        <div className="subscribers">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <div className="light_shadow">
                <div className="list">
                  <h4 className="mb">Subscribers</h4>
                  <DataGrid
                    className="datagrid"
                    rows={subscribers}
                    localeText={customTranslations}
                    getRowId={(row) => row._id}
                    columns={columns.concat(actionColumn)}
                    autoPageSize
                  />
                </div>
              </div>
              <div className="light_shadow">
                <h4>Send Newsletter</h4>
                <form className="settingsForm" onSubmit={submitHandler}>
                  <div className="settingsItem">
                    <input
                      type="text"
                      className="input_box"
                      placeholder="Subject e.g. newsletter"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <div className="form_box">
                      <JoditEditor
                        className="editor"
                        ref={editor}
                        value={message}
                        onBlur={(newContent) => setMessage(newContent)}
                      />
                    </div>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscribers;
