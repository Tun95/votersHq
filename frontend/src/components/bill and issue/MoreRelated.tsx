import { Link } from "react-router-dom";
import Slider from "react-slick";
import MoreRelatedCards from "./MoreRelatedCards";
import { useEffect, useReducer, useState } from "react";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import WestOutlinedIcon from "@mui/icons-material/WestOutlined";
import { Bill, BillsResponse } from "../../types/bills/bills details/types";
import { ErrorResponse, getError } from "../../utilities/utils/Utils";
import axios from "axios";
import { request } from "../../base url/BaseUrl";

interface ArrowProps {
  onClick?: () => void;
}

// NextArrow component
const NextArrow: React.FC<ArrowProps> = (props) => {
  const { onClick } = props;
  return (
    <div className="control_btn l_flex" onClick={onClick}>
      <button className="next l_flex">
        <EastOutlinedIcon className="icon" />
      </button>
    </div>
  );
};

// PrevArrow component
const PrevArrow: React.FC<ArrowProps> = (props) => {
  const { onClick } = props;
  return (
    <div className="control_btn l_flex" onClick={onClick}>
      <button className="prev l_flex">
        <WestOutlinedIcon className="icon" />
      </button>
    </div>
  );
};

interface State {
  loading: boolean;
  error: string | null;
  relatedBills: Bill[];
}

type Action =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: Bill[] }
  | { type: "FETCH_FAIL"; payload: string };

// Initial state
const initialState: State = {
  loading: true,
  error: null,
  relatedBills: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, relatedBills: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function MoreRelated({ bill, fetchBill }: BillsResponse) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { relatedBills } = state;

  useEffect(() => {
    const fetchRelatedBills = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(
          `${request}/api/bills/${bill?._id}/related`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error as ErrorResponse),
        });
      }
    };

    fetchRelatedBills();
  }, [bill?._id]);

  //=============
  // REACT SLICK
  //=============
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1250) {
        setSlidesToShow(Math.min(4, relatedBills?.length));
      } else if (screenWidth >= 800) {
        setSlidesToShow(Math.min(3, relatedBills?.length));
      } else if (screenWidth >= 450) {
        setSlidesToShow(Math.min(2, relatedBills?.length));
      } else {
        setSlidesToShow(Math.min(1, relatedBills?.length));
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [relatedBills?.length]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    autoplay: false,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: React.ReactNode) => {
      return <ul style={{ margin: "0px" }}>{dots}</ul>;
    },
  };

  return (
    <div className="bill_more_related">
      <div className="bill_more_content">
        <div className="bill_more_header c_flex">
          <div className="main_bill_headers">
            <h2>
              More <span className="green"> Bills & Issues</span>
            </h2>
          </div>
          <div className="btn">
            <Link to="/bills" className="main_btn">
              See All
            </Link>
          </div>
        </div>
        <div className="bill_list">
          <Slider {...settings} className="slick_slider">
            {relatedBills?.map((bill) => (
              <MoreRelatedCards
                fetchBill={fetchBill}
                bill={bill}
                key={bill?._id}
              />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default MoreRelated;
