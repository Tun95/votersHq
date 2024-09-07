import { useContext, useEffect, useReducer } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import "../styles/styles.scss";
import { Helmet } from "react-helmet-async";
import { Context } from "../../../../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { request } from "../../../../base url/BaseUrl";
import { getError } from "../../../../utilities/utils/Utils";
import LoadingBox from "../../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../../utilities/message loading/MessageBox";

const reducer = (state, action) => {
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
      return {
        ...state,
        loadingBlock: false,
        successBlock: false,
      };
    case "BLOCK_RESET":
      return {
        ...state,
        loadingBlock: false,
        successBlock: false,
      };

    case "UNBLOCK_REQUEST":
      return { ...state, loadingUnBlock: true, successUnBlock: false };
    case "UNBLOCK_SUCCESS":
      return { ...state, loadingUnBlock: false, successUnBlock: true };
    case "UNBLOCK_FAIL":
      return {
        ...state,
        loadingUnBlock: false,
        successUnBlock: false,
      };
    case "UNBLOCK_RESET":
      return {
        ...state,
        loadingUnBlock: false,
        successUnBlock: false,
      };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    case "DELETE_RESET":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };

    default:
      return state;
  }
};

const columns = [
  { field: "firstName", headerName: "First Name", width: 150 },
  { field: "lastName", headerName: "Last Name", width: 150 },
  { field: "email", headerName: "Email", width: 230 },
  {
    field: "isAdmin",
    headerName: "isAdmin",
    width: 100,
    renderCell: (params) => {
      return (
        <>
          <div className={`cellWithAdminSellerStatus ${params.row.isBlocked}`}>
            {params.row.isAdmin === true ? (
              <span className="yes">YES</span>
            ) : (
              <span className="no">NO</span>
            )}
          </div>
        </>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <>
          <div className={`cellWithStatus  ${params.row.isBlocked}`}>
            {params.row.isBlocked === true ? (
              <span className="blocked">Blocked</span>
            ) : (
              <span className="active">Active</span>
            )}
          </div>
        </>
      );
    },
  },
];

function UserList() {
  const { state } = useContext(Context);
  const { userInfo } = state;

  const [
    { loading, error, users, successBlock, successUnBlock, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };
    if (successUnBlock || successBlock || successDelete) {
      dispatch({ type: "UNBLOCK_RESET" });
      dispatch({ type: "BLOCK_RESET" });
      dispatch({ type: "DELETE_RESET" });
    }
    fetchData();
  }, [successBlock, successDelete, successUnBlock, userInfo]);
  console.log(users);

  //==============
  //BLOCK HANDLER
  //==============
  const blockHandler = async (user) => {
    if (user.isAdmin === true) {
      toast.error("Can Not Block Admin User");
    } else {
      try {
        await axios.put(
          `${request}/api/users/block/${user.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "BLOCK_SUCCESS" });
        toast.success("user successfully blocked");
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "BLOCK_FAIL" });
      }
    }
  };

  //==============
  //UNBLOCK HANDLER
  //==============
  const unBlockHandler = async (user) => {
    try {
      dispatch({ type: "UNBLOCK_REQUEST" });
      await axios.put(
        `${request}/api/users/unblock/${user.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UNBLOCK_SUCCESS" });
      toast.success("user successfully unblocked");
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UNBLOCK_FAIL" });
    }
  };

  //===========
  //USER DELETE
  //===========
  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await axios.delete(`${request}/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("user deleted successfully", {
          position: "bottom-center",
        });
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {params.row.isBlocked === true ? (
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
            <Link to={`/admin/user/${params.row._id}`}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="admin_page_all  admin_page_screen">
      <Helmet>
        <title>All Users</title>
      </Helmet>
      <div className="container">
        <div className="productTitleContainer">
          <h3 className="productTitle light_shadow uppercase">All Users</h3>
        </div>
        <div className="datatable ">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox>{error}</MessageBox>
          ) : (
            <DataGrid
              className="datagrid"
              rows={users}
              getRowId={(row) => row._id}
              columns={columns.concat(actionColumn)}
              autoPageSize
              rowsPerPageOptions={[10]}
              checkboxSelection
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserList;
