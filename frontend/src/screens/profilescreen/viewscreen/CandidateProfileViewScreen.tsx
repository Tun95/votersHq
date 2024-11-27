import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/nav bar/main navbar/MainNavBar";
import MainFooter from "../../../common/footer/main footer/MainFooter";
import BannerDetails from "../../../components/profile/view page/BannerDetails";
import "./styles.scss";
import TabMainPanel from "../../../components/profile/view page/TabPanel";
import PoliticalTime from "../../../components/profile/view page/PoliticalTime";
import CandidateDetails from "../../../components/profile/view page/CandidateDetails";
import { useParams } from "react-router-dom";
import { request } from "../../../base url/BaseUrl";
import axios from "axios";
import { ErrorResponse, getError } from "../../../utilities/utils/Utils";
import { useEffect, useReducer } from "react";
import {
  Candidate,
  candidateAction,
  candidateInitialState,
  candidateState,
} from "../../../types/candidate/types";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";

const reducer = (
  state: candidateState,
  action: candidateAction
): candidateState => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        candidate: action.payload as Candidate,
        error: "",
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload as string };

    default:
      return state;
  }
};
function CandidateProfileViewScreen() {
  const { slug } = useParams<{ slug: string }>();

  const [{ loading, error, candidate }, dispatch] = useReducer(
    reducer,
    candidateInitialState
  );
  window.scrollTo(0, 0);
  // FETCH DATA
  const fetchData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.get(`${request}/api/users/slug/${slug}`);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
      window.scrollTo(0, 0);
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(err as ErrorResponse),
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(candidate?._id);
  return (
    <div className="bill_detail_screen candidate_view_screen">
      <Helmet>
        <title>Candidate Profile Details</title>
      </Helmet>
      <MainNavBar />

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="container">
          {candidate && <BannerDetails candidate={candidate} />}
          {candidate && <CandidateDetails candidate={candidate} />}
          <div className="bill_screen_content candidate_screen_content">
            <div className="tab_panel_box_">
              {candidate && <TabMainPanel candidate={candidate} />}
            </div>
            <div className="side_content">
              {candidate && <PoliticalTime candidate={candidate} />}
            </div>
          </div>
        </div>
      )}
      <MainFooter />
    </div>
  );
}

export default CandidateProfileViewScreen;
