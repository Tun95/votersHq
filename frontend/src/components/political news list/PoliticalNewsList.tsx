import { useEffect, useReducer } from "react";
import "./styles.scss";
import axios from "axios";
import { request } from "../../base url/BaseUrl";
import { ErrorResponse, getError } from "../../utilities/utils/Utils";
import LoadingBox from "../../utilities/message loading/LoadingBox";
import MessageBox from "../../utilities/message loading/MessageBox";
import { Link, useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import PoliticalCards from "./PoliticalCards";
import {
  NewsAction,
  NewsState,
  PoliticalNews,
} from "../../types/political news/types";

// Reducer function
const reducer = (state: NewsState, action: NewsAction): NewsState => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        politicalNews: action.payload.politicalNews,
        page: action.payload.page,
        pages: action.payload.pages,
        totalPages: action.payload.totalPages,
        error: "",
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function PoliticalNewsList() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = parseInt(sp.get("page") || "1", 12) || 1;

  const [{ loading, error, politicalNews, pages, totalPages }, dispatch] =
    useReducer(reducer, {
      politicalNews: [],
      loading: true,
      error: "",
      page: 1,
      pages: 1,
      totalPages: 0,
    });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get<{
          news: PoliticalNews[];
          totalNews: number;
          currentPage: number;
          totalPages: number;
        }>(`${request}/api/political-news?page=${page}`);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            politicalNews: data.news,
            page: data.currentPage,
            pages: data.totalPages,
            totalPages: data.totalPages,
          },
        });
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err as ErrorResponse),
        });
      }
    };
    fetchData();
  }, [page]);

  // Scroll to top on pagination click
  const handlePaginationClick = () => {
    const targetElement = document.getElementById("store-items");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  console.log(politicalNews);

  return (
    <div className="political_news political_news_list home_post">
      <div className="container">
        <div className="content">
          <div className="header_text p_flex">
            <div className="header">
              <h1>
                Latest
                <span className="voters"> News</span>
              </h1>
            </div>
          </div>

          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : politicalNews?.length === 0 ? (
            <div className="no_review l_flex">
              <p>No Political News Found</p>
            </div>
          ) : (
            <>
              <div className="news_list">
                {politicalNews?.map((item, index) => (
                  <PoliticalCards item={item} index={index} key={index} />
                ))}
              </div>
              {totalPages > 1 ? (
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
                        to={`/news?page=${item.page}`}
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

export default PoliticalNewsList;
