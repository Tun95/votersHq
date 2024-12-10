import { Helmet } from "react-helmet-async";
import MainNavBar from "../../common/nav bar/main navbar/MainNavBar";
import BillsDetails from "../../components/bill and issue/BillsDetails";
import MainFooter from "../../common/footer/main footer/MainFooter";
import "./styles.scss";
import BillVoting from "../../components/bill and issue/BillVoting";
import RegionalStat from "../../components/bill and issue/RegionalStat";
import Comment from "../../components/bill and issue/Comment";
import MoreRelated from "../../components/bill and issue/MoreRelated";
import TabMainPanel from "../../components/bill and issue/TabPanel";
import {
  BillsDetailsAction,
  billsDetailsInitialState,
  BillsDetailsState,
} from "../../types/bills/bills details/types";
import { useEffect, useReducer } from "react";
import { request } from "../../base url/BaseUrl";
import axios from "axios";
import { ErrorResponse, getError } from "../../utilities/utils/Utils";
import { useParams } from "react-router-dom";
import LoadingBox from "../../utilities/message loading/LoadingBox";
import MessageBox from "../../utilities/message loading/MessageBox";

// Reducer
function billReducer(
  state: BillsDetailsState,
  action: BillsDetailsAction
): BillsDetailsState {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, bill: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
function BillsDetailScreen() {
  const { slug } = useParams<{ slug: string }>();
  const [state, dispatch] = useReducer(billReducer, billsDetailsInitialState);
  const { loading, error, bill } = state;
  window.scrollTo(0, 0);
  useEffect(() => {
    if (slug) {
      fetchBill(slug); // Fetch bill based on slug from URL
    }
  }, [slug]); // Depend on `slug` so it updates when URL changes

  const fetchBill = async (slug: string) => {
    // if (triggerLoading) {
    dispatch({ type: "FETCH_REQUEST" });
    // }
    try {
      const { data } = await axios.get(`${request}/api/bills/slug/${slug}`);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(error as ErrorResponse),
      });
    }
  };

  return (
    <div className="bill_detail_screen">
      <Helmet>
        <title>Bills Details</title>
      </Helmet>
      <MainNavBar />
      <div className="container">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div className="bill_screen_content">
              {bill && <BillsDetails fetchBill={fetchBill} bill={bill} />}
              <div className="tab_panel_box">
                {bill && <TabMainPanel fetchBill={fetchBill} bill={bill} />}
              </div>
              {bill && (
                <div className="side_content">
                  <BillVoting fetchBill={fetchBill} bill={bill} />
                  <RegionalStat fetchBill={fetchBill} bill={bill} />
                  <Comment fetchBill={fetchBill} bill={bill} />
                </div>
              )}
            </div>
            {bill && <MoreRelated fetchBill={fetchBill} bill={bill} />}
          </>
        )}
      </div>
      <MainFooter />
    </div>
  );
}

export default BillsDetailScreen;
