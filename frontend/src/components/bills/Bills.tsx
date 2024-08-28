import "./styles.scss";
import { Link, useLocation } from "react-router-dom";
import BillsFilters from "./BillsFilters";
import BillsCard from "./BillsCard";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { ErrorResponse, getError } from "../../utilities/utils/Utils";
import { request } from "../../base url/BaseUrl";
import axios from "axios";
import { useEffect, useReducer, useRef } from "react";
import {
  BillsAction,
  BillsFilterParams,
  BillsState,
} from "../../types/bills/types";
import LoadingBox from "../../utilities/message loading/LoadingBox";
import MessageBox from "../../utilities/message loading/MessageBox";

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

function Bills() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const searchQuery = sp.get("searchQuery") || "all";
  const sortType = sp.get("sortType") || "all";
  const sortStatus = sp.get("sortStatus") || "all";
  const sortCategory = sp.get("sortCategory") || "all";
  const sortState = sp.get("sortState") || "all";
  const sortOrder = sp.get("sortOrder") || "all";
  const page = parseInt(sp.get("page") || "1", 10) || 1;

  const [{ bills, loading, error, pages, countBills }, dispatch] = useReducer(
    reducer,
    {
      bills: [],
      loading: true,
      error: "",
      page: 1,
      pages: 1,
      countBills: 0,
    }
  );

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

  const handlePaginationClick = () => {
    const targetElement = document.getElementById("store-items");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getFilterUrl = (filter: BillsFilterParams): string => {
    const filterSearchQuery = encodeURIComponent(filter.searchQuery || "all");
    const filterSortType = encodeURIComponent(filter.sortType || "all");
    const filterSortStatus = encodeURIComponent(filter.sortStatus || "all");
    const filterSortCategory = encodeURIComponent(filter.sortCategory || "all");
    const filterSortState = encodeURIComponent(filter.sortState || "all");
    const filterSortOrder = encodeURIComponent(filter.sortOrder || "all");
    const filterPage = filter.page || 1;

    return `/bills?searchQuery=${filterSearchQuery}&sortType=${filterSortType}&sortStatus=${filterSortStatus}&sortCategory=${filterSortCategory}&sortState=${filterSortState}&sortOrder=${filterSortOrder}&page=${filterPage}`;
  };

  const billsRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="home_post bill_post" ref={billsRef}>
      <div className="container">
        <div className="content">
          <div className="header_text p_flex">
            <div className="header">
              <h1>
                <span className="voters">Legislative Matters</span>
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
            <BillsFilters getFilterUrl={getFilterUrl} />
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
                  <BillsCard key={bill._id} bill={bill} />
                ))}
              </div>
              {countBills > 9 ? (
                <div className="pagination">
                  <Pagination
                    page={page}
                    count={pages}
                    defaultPage={1}
                    renderItem={(item) => (
                      <PaginationItem
                        className={`${
                          item.page !== page
                            ? "paginationItemStyle"
                            : "paginationItemStyle active"
                        }`}
                        component={Link}
                        to={`/bills?page=${item.page}&searchQuery=${searchQuery}&sortType=${sortType}&sortStatus=${sortStatus}&sortCategory=${sortCategory}&sortState=${sortState}&sortOrder=${sortOrder}`}
                        {...item}
                        onClick={handlePaginationClick}
                      />
                    )}
                  />
                </div>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bills;
