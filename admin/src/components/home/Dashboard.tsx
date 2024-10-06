import { useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";

import "./styles.scss";
import axios from "axios";
import Widget from "../../common/widget/Widget";
//import LoadingBox from "../../utilities/message loading/LoadingBox";
//import MessageBox from "../../utilities/message loading/MessageBox";
import Chart from "../../common/chart/Chart";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../utilities/utils/Utils";
import { request } from "../../base url/BaseUrl";
import TableData from "../../common/table/Table";
import { TooltipProps } from "recharts";

interface StatsData {
  name: string;
  "Bills Votes": number;
  "Election Votes": number;
}

// Define the types for the fetched data
interface SummaryData {
  users: number;
  bills: number;
  elections: number;
  news: number;
  votes: { date: string; billsVotes: number; electionVotes: number }[];
}

// Format numbers with suffix (e.g., 1.2k, 3.4m)
const formatShortNumber = (num: number): string => {
  const ranges = [
    { divider: 1e9, suffix: "b" },
    { divider: 1e6, suffix: "m" },
    { divider: 1e3, suffix: "k" },
  ];
  for (const range of ranges) {
    if (Math.abs(num) >= range.divider) {
      return (num / range.divider).toFixed(1) + range.suffix;
    }
  }
  return num.toString();
};

// Define the state structure for the reducer
interface State {
  loading: boolean;
  summary: SummaryData;
  error: string;
}

// Define the possible actions the reducer can handle
type Action =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: SummaryData }
  | { type: "FETCH_FAIL"; payload: string };

// Reducer function to manage fetching states
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Dashboard() {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  // Define initial state for the dashboard
  const [{  summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: {
      users: 0,
      bills: 0,
      elections: 0,
      news: 0,
      votes: [],
    } as SummaryData,
    error: "",
  });

  // Fetch the summary data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/generals/summary`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error as ErrorResponse),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const [voteStats, setVoteStats] = useState<StatsData[]>([]);

  // Prepare data for the chart based on vote data
  useEffect(() => {
    const getStats = () => {
      const stats = summary.votes.map((item) => ({
        name: item.date,
        "Bills Votes": item.billsVotes,
        "Election Votes": item.electionVotes,
      }));
      setVoteStats(stats);
    };
    getStats();
  }, [summary.votes]);

  // CustomTooltip Component
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom_tooltip" style={{ padding: "10px" }}>
          {label ? (
            <p className="label">{`Date: ${label}`}</p>
          ) : payload[0]?.payload.name ? (
            <p className="">{`Date: ${payload[0]?.payload.name}`}</p>
          ) : (
            ""
          )}
          <p className="" style={{ color: "#5550bd", marginTop: "3px" }}>
            Bills Votes:{" "}
            {formatShortNumber(payload[0]?.payload["Bills Votes"] ?? 0)}
          </p>
          <p className="" style={{ color: "#5550bd", marginTop: "3px" }}>
            Election Votes:{" "}
            {formatShortNumber(payload[0]?.payload["Election Votes"] ?? 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  const TotalUsers = summary.users;
  const TotalBills = summary.bills;
  const TotalElections = summary.elections;
  const TotalNews = summary.news;

  return (
    <div className="admin_page_all admin_page_screen">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <div className="home dashboard s_flex">
        {/* {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : ( */}
          <>
            <div className="widgets">
              <Widget TotalUsers={TotalUsers} type="user" />
              <Widget TotalBills={TotalBills} type="bill" />
              <Widget TotalElections={TotalElections} type="election" />
              <Widget TotalNews={TotalNews} type="news" />
            </div>

            <div className="chart_annoying">
              <div className="charts">
                <Chart
                  title="Last 10 Days (Votes)"
                  data={voteStats}
                  grid
                  dataKeys={["Bills Votes", "Election Votes"]}
                  aspect={2 / 1}
                  CustomTooltip={CustomTooltip}
                />
              </div>
            </div>

            <div className="listContainer">
              <div className="listTitle">Latest Registered Users</div>
              <TableData />
            </div>
          </>
        {/* )} */}
      </div>
    </div>
  );
}

export default Dashboard;
