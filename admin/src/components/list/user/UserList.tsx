import { useEffect, useReducer } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styles.scss";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";
import { request } from "../../../base url/BaseUrl";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";
import {
  ListActionType,
  ListStateType,
  UserList,
} from "../../../types/profile/list/types";

const reducer = (
  state: ListStateType,
  action: ListActionType
): ListStateType => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "BLOCK_REQUEST":
      return { ...state, loadingBlock: true, successBlock: false };
    case "BLOCK_SUCCESS":
      return { ...state, loadingBlock: false, successBlock: true };
    case "BLOCK_FAIL":
    case "BLOCK_RESET":
      return { ...state, loadingBlock: false, successBlock: false };
    case "UNBLOCK_REQUEST":
      return { ...state, loadingUnBlock: true, successUnBlock: false };
    case "UNBLOCK_SUCCESS":
      return { ...state, loadingUnBlock: false, successUnBlock: true };
    case "UNBLOCK_FAIL":
    case "UNBLOCK_RESET":
      return { ...state, loadingUnBlock: false, successUnBlock: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

const columns: GridColDef[] = [
  { field: "firstName", headerName: "First Name", width: 150 },
  { field: "lastName", headerName: "Last Name", width: 150 },
  { field: "email", headerName: "Email", width: 230 },
  {
    field: "isAdmin",
    headerName: "isAdmin",
    width: 100,
    renderCell: (params) => (
      <div className={`cellWithAdminSellerStatus ${params.row.isBlocked}`}>
        {params.row.isAdmin ? (
          <span className="yes">YES</span>
        ) : (
          <span className="no">NO</span>
        )}
      </div>
    ),
  },
  {
    field: "status",
    headerName: "Account Status",
    width: 160,
    renderCell: (params) => (
      <div className={`cellWithStatus ${params.row.isBlocked}`}>
        {params.row.isBlocked ? (
          <span className="blocked">Blocked</span>
        ) : (
          <span className="active">Active</span>
        )}
      </div>
    ),
  },
  {
    field: "isAccountVerified",
    headerName: "Verification Status",
    width: 160,
    renderCell: (params) => (
      <div className={`cellWithStatus ${!params.row.isAccountVerified}`}>
        {!params.row.isAccountVerified ? (
          <span className="blocked">Unverified</span>
        ) : (
          <span className="active">Verified</span>
        )}
      </div>
    ),
  },
];

const UserListComponent: React.FC = () => {
  const navigate = useNavigate();

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [
    { loading, error, users, successBlock, successUnBlock, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    users: [],
  });

  //=========
  // FETCH
  //=========
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get<UserList[]>(`${request}/api/users`, {
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
    if (successUnBlock || successBlock || successDelete) {
      dispatch({ type: "UNBLOCK_RESET" });
      dispatch({ type: "BLOCK_RESET" });
      dispatch({ type: "DELETE_RESET" });
    }
    fetchData();
  }, [successBlock, successDelete, successUnBlock, userInfo]);

  //=========
  // BLOCK
  //=========
  const blockHandler = async (user: UserList) => {
    if (user.isAdmin) {
      toast.error("Cannot Block Admin User");
    } else {
      try {
        await axios.put(
          `${request}/api/users/block/${user._id}`,
          {},
          { headers: { Authorization: `Bearer ${userInfo?.token}` } }
        );
        dispatch({ type: "BLOCK_SUCCESS" });
        toast.success("User successfully blocked");
      } catch (err) {
        toast.error(getError(err as ErrorResponse));
        dispatch({ type: "BLOCK_FAIL" });
      }
    }
  };

  //=========
  // UNBLOCK
  //=========
  const unBlockHandler = async (user: UserList) => {
    try {
      dispatch({ type: "UNBLOCK_REQUEST" });
      await axios.put(
        `${request}/api/users/unblock/${user._id}`,
        {},
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      dispatch({ type: "UNBLOCK_SUCCESS" });
      toast.success("User successfully unblocked");
    } catch (err) {
      toast.error(getError(err as ErrorResponse));
      dispatch({ type: "UNBLOCK_FAIL" });
    }
  };

  //=========
  // DELETE
  //=========
  const deleteHandler = async (user: UserList) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await axios.delete(`${request}/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("User deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err as ErrorResponse));
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const actionColumn: GridColDef[] = [
    {
      field: "action",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div className="cellAction">
          {params.row.isBlocked ? (
            <div
              onClick={() => unBlockHandler(params.row)}
              className="blockButton"
            >
              UnBlock
            </div>
          ) : (
            <div
              onClick={() => blockHandler(params.row)}
              className="blockButton"
            >
              Block
            </div>
          )}
          <div
            onClick={() => deleteHandler(params.row)}
            className="deleteButton"
          >
            Delete
          </div>
          <Link to={`/user/${params.row._id}`}>
            <div className="viewButton">View</div>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="admin_page_all admin_page_screen">
      <div className="">
        <div className="productTitleContainer">
          <h3 className="productTitle light_shadow uppercase">All Users</h3>
        </div>
        <div className="datatable ">
          <span className="c_flex">
            <span></span>
            <i
              onClick={() => {
                navigate(`/user/new`);
              }}
              className="fa-solid fa-square-plus filterPlus"
            ></i>
          </span>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <DataGrid
              className="datagrid"
              rows={users}
              getRowId={(row) => row._id}
              columns={columns.concat(actionColumn)}
              autoPageSize
              pagination
              pageSizeOptions={[10]}
              checkboxSelection
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListComponent;
