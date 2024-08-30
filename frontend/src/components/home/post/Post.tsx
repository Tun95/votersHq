import PostCard from "./PostCard";
import PostFilter from "./PostFilter";
import "./styles.scss";
import { Link, useLocation } from "react-router-dom";
import {
  BillsAction,
  BillsFilterParams,
  BillsState,
} from "../../../types/bills/types";
import { useEffect, useReducer } from "react";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { ErrorResponse, getError } from "../../../utilities/utils/Utils";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";

// Reducer
const reducer = (state: BillsState, action: BillsAction): BillsState => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        bills: action.payload?.bills || [],
        page: action.payload?.page || 1,
        pages: action.payload?.pages || 1,
        countBills: action.payload?.countBills || 0,
        loading: false,
        error: "",
      };
    case "FETCH_FAIL":
      return { ...state, error: action.payload?.error || "", loading: false };
    default:
      return state;
  }
};
function Post() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const searchQuery = sp.get("searchQuery") || "all";
  const sortType = sp.get("sortType") || "all";
  const sortStatus = sp.get("sortStatus") || "all";
  const sortCategory = sp.get("sortCategory") || "all";
  const sortState = sp.get("sortState") || "all";
  const sortOrder = sp.get("sortOrder") || "all";
  const page = parseInt(sp.get("page") || "1", 10) || 1;

  const [{ bills, loading, error }, dispatch] = useReducer(reducer, {
    bills: [],
    loading: true,
    error: "",
    page: 1,
    pages: 1,
    countBills: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${request}/api/bills/filter?searchQuery=${searchQuery}&sortType=${sortType}&sortStatus=${sortStatus}&sortCategory=${sortCategory}&sortState=${sortState}&sortOrder=${sortOrder}&page=${page}`
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            bills: result.data.bills,
            page: result.data.page,
            pages: result.data.pages,
            countBills: result.data.countBills,
          },
        });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: { error: getError(err as ErrorResponse) },
        });
      }
    };
    fetchData();
  }, [
    searchQuery,
    sortType,
    sortStatus,
    sortCategory,
    sortState,
    sortOrder,
    page,
  ]);

  const getFilterUrl = (filter: BillsFilterParams): string => {
    const filterSearchQuery = encodeURIComponent(filter.searchQuery || "all");
    const filterSortType = encodeURIComponent(filter.sortType || "all");
    const filterSortStatus = encodeURIComponent(filter.sortStatus || "all");
    const filterSortCategory = encodeURIComponent(filter.sortCategory || "all");
    const filterSortState = encodeURIComponent(filter.sortState || "all");
    const filterSortOrder = encodeURIComponent(filter.sortOrder || "all");

    return `/?searchQuery=${filterSearchQuery}&sortType=${filterSortType}&sortStatus=${filterSortStatus}&sortCategory=${filterSortCategory}&sortState=${filterSortState}&sortOrder=${filterSortOrder}`;
  };
  return (
    <div className="home_post">
      <div className="container">
        <div className="content">
          <div className="header_text p_flex">
            <div className="header">
              <h1>
                Ongoing
                <span className="voters"> Legislative Matters</span>
              </h1>
            </div>
            <div className="text">
              <p>
                Stay Informed and Make Your Voice Heard on the Latest
                Legislative Matters
              </p>
            </div>
          </div>
          <div className="filter_box l_flex">
            <PostFilter getFilterUrl={getFilterUrl} />
          </div>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : bills?.length === 0 ? (
            <div className="no_review l_flex">
              <p>No Bills Found</p>
            </div>
          ) : (
            <>
              <div className="post_list">
                {bills.map((bill) => (
                  <PostCard key={bill._id} bill={bill} />
                ))}
              </div>
              <div className="view_more l_flex">
                <Link to="/bills">
                  <h4>View All</h4>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
