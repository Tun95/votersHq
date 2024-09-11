import { useEffect, useReducer, useState } from "react";
import PoliticalNewsCards from "./PoliticalNewsCards";
import "./styles.scss";
import Slider from "react-slick";
import {
  Action,
  initialState,
  PoliticalSlideItem,
  State,
} from "../../../types/political news/types";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { ErrorResponse, getError } from "../../../utilities/utils/Utils";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        politicalNews: action.payload as PoliticalSlideItem[],
        error: "",
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload as string };
    default:
      return state;
  }
};

function PoliticalNews() {
  const [{ loading, error, politicalNews }, dispatch] = useReducer(
    reducer,
    initialState
  );
  //==============
  //FETCH PRODUCTS
  //==============
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `${request}/api/political-news/latest`
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err as ErrorResponse),
        });
      }
    };

    fetchData();
  }, []);

  //=============
  // REACT SLICK
  //=============
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const length = politicalNews?.length ?? 0; // Default to 0 if no news

      // Set slides to show based on screen width
      const slidesToShow = screenWidth >= 800 ? 3 : screenWidth >= 450 ? 2 : 1;

      // Ensure that slidesToShow does not exceed the number of available items
      setSlidesToShow(Math.min(slidesToShow, length));
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [politicalNews?.length]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows: false,
    autoplay: false,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    appendDots: (dots: React.ReactNode) => {
      return <ul style={{ margin: "0px" }}>{dots}</ul>;
    },
  };
  return (
    <div className="political_news home_post">
      <div className="container">
        <div className="content">
          <div className="header_text p_flex">
            <div className="header">
              <h1>
                Latest
                <span className="voters"> Political News</span>
              </h1>
            </div>
          </div>
          {politicalNews?.length === 0 && (
            <div className="no_review l_flex">
              <p>No Political News Found</p>
            </div>
          )}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="news_list">
              <Slider {...settings} className="slick_slider">
                {politicalNews?.map((item, index) => (
                  <PoliticalNewsCards item={item} index={index} key={index} />
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PoliticalNews;
