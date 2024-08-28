import { useParams } from "react-router-dom";
import { useEffect, useReducer, useRef } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { Helmet } from "react-helmet-async";
import MainNavBar from "../../common/nav bar/main navbar/MainNavBar";
import MainFooter from "../../common/footer/main footer/MainFooter";
import Banner from "../../components/elction view page/Banner";
import PolesVotes from "../../components/elction view page/PolesVotes";
import TabPanel from "../../components/elction view page/TabPanel";
import EventTimer from "../../components/elction view page/EventTimer";
import PollLeaderBoard from "../../components/elction view page/PollLeaderBoard";
import Comment from "../../components/elction view page/Comment";
import "./styles.scss";

import { request } from "../../base url/BaseUrl";
import { ErrorResponse, getError } from "../../utilities/utils/Utils";
import {
  ElectionResponse,
  ElectionViewAction,
  ElectionViewScreenState,
} from "../../types/election/election details/types";

const initialState: ElectionViewScreenState = {
  loading: true,
  election: null,
  totalVotes: 0,
  maleVotes: 0,
  femaleVotes: 0,
  leaderboardTop5: [],
  leaderboardTop3: [],
  ageRangeDistribution: [
    { ageRange: "18-25", percentage: 0 },
    { ageRange: "26-40", percentage: 0 },
    { ageRange: "41-60", percentage: 0 },
    { ageRange: "60+", percentage: 0 },
  ],
  error: "",
  countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
};

const reducer = (
  state: ElectionViewScreenState,
  action: ElectionViewAction
): ElectionViewScreenState => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        election: action.payload.election,
        totalVotes: action.payload.totalVotes,
        maleVotes: action.payload.maleVotes,
        femaleVotes: action.payload.femaleVotes,
        leaderboardTop5: action.payload.leaderboardTop5,
        leaderboardTop3: action.payload.leaderboardTop3,
        ageRangeDistribution: action.payload.ageRangeDistribution,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_COUNTDOWN":
      return { ...state, countdown: action.payload };
    default:
      return state;
  }
};

function ElectionViewScreen() {
  //  window.scrollTo(0, 0);
  const { slug } = useParams<{ slug: string }>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    election,
    countdown,
    totalVotes,
    maleVotes,
    femaleVotes,
    leaderboardTop5,
    leaderboardTop3,
    ageRangeDistribution,
  } = state;

  const socket = useRef<Socket | null>(null);
  const intervalIdRef = useRef<number | null>(null); // Using 'number' for browser compatibility

  useEffect(() => {
    socket.current = io(`${request}/elections`);

    fetchElection();

    socket.current?.on("electionUpdate", ({ election }) => {
      if (election && election.slug === slug) {
        const countdownTime = new Date(election.expirationDate).getTime();
        startCountdown(countdownTime);
      }
    });

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      socket.current?.disconnect();
    };
  }, [slug]);
  const fetchElection = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.get<ElectionResponse>(
        `${request}/api/elections/slug/${slug}`
      );

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          election: data.election,
          totalVotes: data.totalVotes,
          maleVotes: data.maleVotes,
          femaleVotes: data.femaleVotes,
          leaderboardTop5: data.leaderboardTop5,
          leaderboardTop3: data.leaderboardTop3,
          ageRangeDistribution: data.ageRangeDistribution,
        },
      });

      const expirationDate = new Date(data.election.expirationDate).getTime();

      if (expirationDate) {
        startCountdown(expirationDate);
      }
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(err as ErrorResponse),
      });
    }
  };

  const startCountdown = (targetTime: number) => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
        dispatch({
          type: "UPDATE_COUNTDOWN",
          payload: { days: 0, hours: 0, minutes: 0, seconds: 0 },
        });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        dispatch({
          type: "UPDATE_COUNTDOWN",
          payload: { days, hours, minutes, seconds },
        });
      }
    };

    updateCountdown();
    intervalIdRef.current = setInterval(
      updateCountdown,
      1000
    ) as unknown as number;
  };

  return (
    <div className="bill_detail_screen election_detail_screen">
      <Helmet>
        <title>Election Overview</title>
      </Helmet>
      <MainNavBar />
      {election && (
        <Banner
          election={election}
          totalVotes={totalVotes}
          maleVotes={maleVotes}
          femaleVotes={femaleVotes}
          ageRangeDistribution={ageRangeDistribution}
          leaderboardTop5={leaderboardTop5}
          leaderboardTop3={leaderboardTop3}
          fetchElection={fetchElection}
        />
      )}
      <div className="container">
        <div className="bill_screen_content election_screen_content">
          {election && (
            <>
              {election.status === "ongoing" ||
              election.status === "concluded" ? (
                <div className="elec_banner">
                  <EventTimer countdown={countdown} />{" "}
                </div>
              ) : (
                ""
              )}
            </>
          )}

          <span id="poles_section">
            {election && (
              <PolesVotes
                election={election}
                totalVotes={totalVotes}
                maleVotes={maleVotes}
                femaleVotes={femaleVotes}
                ageRangeDistribution={ageRangeDistribution}
                leaderboardTop5={leaderboardTop5}
                leaderboardTop3={leaderboardTop3}
                fetchElection={fetchElection}
              />
            )}
          </span>

          <span className="tab_panel_box">
            {election && (
              <TabPanel
                election={election}
                totalVotes={totalVotes}
                maleVotes={maleVotes}
                femaleVotes={femaleVotes}
                ageRangeDistribution={ageRangeDistribution}
                leaderboardTop5={leaderboardTop5}
                leaderboardTop3={leaderboardTop3}
                fetchElection={fetchElection}
              />
            )}
          </span>
          <div className="side_content">
            {election && (
              <>
                {election.status === "ongoing" ||
                election.status === "concluded" ? (
                  <EventTimer countdown={countdown} />
                ) : (
                  ""
                )}
              </>
            )}
            {election && (
              <PollLeaderBoard
                election={election}
                totalVotes={totalVotes}
                maleVotes={maleVotes}
                femaleVotes={femaleVotes}
                ageRangeDistribution={ageRangeDistribution}
                leaderboardTop5={leaderboardTop5}
                leaderboardTop3={leaderboardTop3}
                fetchElection={fetchElection}
              />
            )}
            {election && (
              <Comment
                election={election}
                totalVotes={totalVotes}
                maleVotes={maleVotes}
                femaleVotes={femaleVotes}
                ageRangeDistribution={ageRangeDistribution}
                leaderboardTop5={leaderboardTop5}
                leaderboardTop3={leaderboardTop3}
                fetchElection={fetchElection}
              />
            )}
          </div>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}

export default ElectionViewScreen;
