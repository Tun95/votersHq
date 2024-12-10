import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/nav bar/main navbar/MainNavBar";
import MainFooter from "../../../common/footer/main footer/MainFooter";
import { useParams } from "react-router-dom";
import { useEffect, useReducer } from "react";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { ErrorResponse, getError } from "../../../utilities/utils/Utils";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";
import PolicalNewsDetail from "../../../components/political news details/PolicalNewsDetail";
import {
  NewsDetailsAction,
  newsDetailsInitialState,
  NewsDetailsState,
} from "../../../types/political news/types";

// Reducer
function newsReducer(
  state: NewsDetailsState,
  action: NewsDetailsAction
): NewsDetailsState {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, news: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
function PoliticalNewsDetailScreen() {
  window.scrollTo(0, 0);

  const { slug } = useParams<{ slug: string }>();
  const [state, dispatch] = useReducer(newsReducer, newsDetailsInitialState);
  const { loading, error, news } = state;

  useEffect(() => {
    if (slug) {
      fetchNews(slug);
    }
  }, [slug]); // Depend on `slug` so it updates when URL changes

  const fetchNews = async (slug: string) => {
    dispatch({ type: "FETCH_REQUEST" });

    try {
      const { data } = await axios.get(
        `${request}/api/political-news/slug/${slug}`
      );
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(error as ErrorResponse),
      });
    }
  };
  return (
    <div className="home_screen">
      <Helmet>
        <title>News :: {news ? news.title : ""}</title>
      </Helmet>
      <MainNavBar />
      <div className="container">
        <div className="content">
          {" "}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            news && <PolicalNewsDetail news={news} />
          )}
        </div>
      </div>
      <MainFooter />
    </div>
  );
}

export default PoliticalNewsDetailScreen;
