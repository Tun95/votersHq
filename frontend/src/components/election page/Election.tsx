import ElectionFilter from "./ElectionFilter";
import Ongoing from "./sections/Ongoing";
import "./styles.scss";
import Upcoming from "./sections/Upcoming";
import Completed from "./sections/Completed";
import { useEffect, useReducer, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { request } from "../../base url/BaseUrl";
import { ErrorResponse, getError } from "../../utilities/utils/Utils";
import {
  ElectionAction,
  ElectionState,
  FilterParams,
} from "../../types/election/types";

const reducer = (
  state: ElectionState,
  action: ElectionAction
): ElectionState => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        ongoing: action.payload.ongoing,
        upcoming: action.payload.upcoming,
        concluded: action.payload.concluded,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

function Election() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const searchQuery = sp.get("searchQuery") || "all";
  const sortType = sp.get("sortType") || "all";
  const sortStatus = sp.get("sortStatus") || "all";
  const sortCategory = sp.get("sortCategory") || "all";
  const order = sp.get("sortOrder") || "all";

  const [{ ongoing, upcoming, concluded }, dispatch] = useReducer(reducer, {
    ongoing: [],
    upcoming: [],
    concluded: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${request}/api/elections/filter?searchQuery=${searchQuery}&sortType=${sortType}&sortStatus=${sortStatus}&sortCategory=${sortCategory}&sortOrder=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err as ErrorResponse),
        });
      }
    };
    fetchData();
  }, [searchQuery, sortType, sortStatus, sortCategory, order]);

  const getFilterUrl = (filter: FilterParams): string => {
    const filterSearchQuery = encodeURIComponent(filter.searchQuery || "all");
    const filterSortType = encodeURIComponent(filter.sortType || "all");
    const filterSortStatus = encodeURIComponent(filter.sortStatus || "all");
    const filterSortCategory = encodeURIComponent(filter.sortCategory || "all");
    const filterSortOrder = encodeURIComponent(filter.sortOrder || "all");
    return `/elections?searchQuery=${filterSearchQuery}&sortType=${filterSortType}&sortStatus=${filterSortStatus}&sortCategory=${filterSortCategory}&sortOrder=${filterSortOrder}`;
  };

  const storeRef = useRef<HTMLDivElement | null>(null);

  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["ongoing", "upcoming", "concluded"])
  );

  const toggleSection = (section: string) => {
    setOpenSections((prevOpenSections) => {
      const newOpenSections = new Set(prevOpenSections);
      if (newOpenSections.has(section)) {
        newOpenSections.delete(section); // Close the section if it's already open
      } else {
        newOpenSections.add(section); // Open the section
      }
      return newOpenSections;
    });
  };

  return (
    <div className="home_post election_page bill_post" ref={storeRef}>
      <div className="container">
        <div className="content">
          {" "}
          <div className="header_text p_flex">
            <div className="header">
              <h1>
                Election
                <span className="voters"> Opinion Polls</span>
              </h1>
            </div>
            <div className="text">
              <p>
                Learn about candidate, cast your vote, and view real-time
                results
              </p>
            </div>
          </div>
          <div className="filter_box l_flex">
            <ElectionFilter getFilterUrl={getFilterUrl} />
          </div>
          <div className="on_going_box">
            <Ongoing
              ongoing={ongoing}
              toggleBox={() => toggleSection("ongoing")}
              isOpen={openSections.has("ongoing")}
            />
          </div>
          <div className="on_going_box">
            <Upcoming
              upcoming={upcoming}
              toggleBox={() => toggleSection("upcoming")}
              isOpen={openSections.has("upcoming")}
            />
          </div>
          <div className="on_going_box">
            <Completed
              concluded={concluded}
              toggleBox={() => toggleSection("concluded")}
              isOpen={openSections.has("concluded")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Election;
