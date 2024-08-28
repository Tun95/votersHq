import { useEffect, useReducer, useState } from "react";
import FeaturedCard from "./FeaturedCard";
import "./styles.scss";
import Slider from "react-slick";
import axios from "axios";
import { ErrorResponse, getError } from "../../../utilities/utils/Utils";
import { request } from "../../../base url/BaseUrl";
import {
  GeneralAction,
  generalInitialState,
  GeneralState,
} from "../../../types/generalTypes";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";

function reducer(state: GeneralState, action: GeneralAction): GeneralState {
  switch (action.type) {
    case "FETCH_ITEMS_REQUEST":
      return { ...state, loading: true, error: undefined };
    case "FETCH_ITEMS_SUCCESS":
      return { ...state, loading: false, items: action.payload };
    case "FETCH_ITEMS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function Featured() {
  const [state, dispatch] = useReducer(reducer, generalInitialState);
  const { loading, error, items: list } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_ITEMS_REQUEST" });
      try {
        const response = await axios.get(`${request}/api/generals`);
        dispatch({ type: "FETCH_ITEMS_SUCCESS", payload: response.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_ITEMS_FAILURE",
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
      if (screenWidth >= 1250) {
        setSlidesToShow(Math.min(4, list?.length));
      } else if (screenWidth >= 800) {
        setSlidesToShow(Math.min(3, list?.length));
      } else if (screenWidth >= 450) {
        setSlidesToShow(Math.min(2, list?.length));
      } else {
        setSlidesToShow(Math.min(1, list?.length));
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [list?.length]);

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
    <div className="featured">
      <div className="container">
        <div className="content">
          <div className="header_text">
            <div className="header">
              <h1>Featured</h1>
            </div>
          </div>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : list?.length === 0 ? (
            <div className="no_review l_flex">
              <p>No Items Found</p>
            </div>
          ) : (
            <div className="card_list">
              <Slider {...settings} className="slick_slider">
                {list?.map((item, index) => (
                  <FeaturedCard item={item} key={index} />
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Featured;
