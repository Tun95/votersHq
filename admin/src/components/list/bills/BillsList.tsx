import { useEffect, useReducer } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import photo from "../../../assets/others/photo.jpg";
import ReactTimeAgo from "react-time-ago";

import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";
import { request } from "../../../base url/BaseUrl";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";

interface Candidate {
  firstName: string;
  lastName: string;
}

interface Bill {
  _id: string;
  title: string;
  banner: string;
  image: string;
  candidates: Candidate[];
  createdAt: string;
  sortCategory: string[];
}

interface State {
  loading: boolean;
  error: string;
  bills: Bill[];
  loadingDelete: boolean;
  successDelete: boolean;
}

type Action =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: Bill[] }
  | { type: "FETCH_FAIL"; payload: string }
  | { type: "DELETE_REQUEST" }
  | { type: "DELETE_SUCCESS" }
  | { type: "DELETE_FAIL"; payload: string }
  | { type: "DELETE_RESET" };

const initialState: State = {
  loading: true,
  error: "",
  bills: [],
  loadingDelete: false,
  successDelete: false,
};
interface GridParams {
  row: Bill;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, bills: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

function BillsListComponent() {
  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "title",
      headerName: "Title",
      width: 300,
      renderCell: (params: GridParams) => {
        return (
          <div className="cellWidthImg">
            <img
              src={params.row.image || photo}
              alt="bill_banner"
              className="cellImg"
            />
            {params.row.title}
          </div>
        );
      },
    },
    {
      field: "candidates",
      headerName: "Candidates",
      width: 180,
      renderCell: (params: GridParams) => {
        return (
          <div className="cellWidthImg">
            {params.row.candidates
              .map(
                (candidate: Candidate) =>
                  `${candidate.firstName} ${candidate.lastName}`
              )
              .join(", ")}
          </div>
        );
      },
    },

    {
      field: "createdAt",
      headerName: "Date",
      width: 180,
      renderCell: (params: GridParams) => {
        return (
          <div className="cellWidthImg">
            <ReactTimeAgo
              date={Date.parse(params.row.createdAt)}
              locale="en-US"
            />
          </div>
        );
      },
    },
    { field: "sortCategory", headerName: "Category", width: 200 },
  ];

  const navigate = useNavigate();

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ loading, error, bills, successDelete }, dispatch] = useReducer(
    reducer,
    initialState
  );

  //===================
  // FETCH HANDLER
  //===================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${request}/api/bills`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err as ErrorResponse),
        });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  //===================
  // DELETE HANDLER
  //===================
  const deleteHandler = async (bill: Bill) => {
    if (window.confirm("Are you sure to delete this bill?")) {
      try {
        await axios.delete(`${request}/api/bills/${bill._id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("Bill deleted successfully", {
          position: "bottom-center",
        });
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err as ErrorResponse));
        dispatch({
          type: "DELETE_FAIL",
          payload: getError(err as ErrorResponse),
        });
      }
    }
  };

  const actionColumn: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/bills/${params.row._id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">View</div>
          </Link>
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
    noRowsLabel: "No bills found",
  };

  return (
    <div className="admin_page_all admin_page_screen">
      <div className="">
        <div className="productTitleContainer">
          <h3 className="productTitle light_shadow uppercase">All Bills</h3>
        </div>
        <div className="datatable">
          <span className="c_flex">
            <span></span>
            <i
              onClick={() => {
                navigate(`/bill/new`);
              }}
              className="fa-solid fa-square-plus filterPlus"
            ></i>
          </span>
          {loading || successDelete ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <DataGrid
              className="datagrid"
              rows={bills}
              localeText={customTranslations}
              getRowId={(row) => row._id}
              columns={columns.concat(actionColumn)}
              autoPageSize
              checkboxSelection
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default BillsListComponent;
