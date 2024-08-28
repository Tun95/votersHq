import { Link } from "react-router-dom";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import VoteStats from "./VoteStats";
import {
  Candidate,
  VoteState,
  VoteAction,
  initialVoteState,
} from "../../types/election/types";
import axios from "axios";
import { useReducer, useState } from "react";
import { request } from "../../base url/BaseUrl";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../utilities/utils/Utils";
import { toast } from "react-toastify";
import { ElectionResponse } from "../../types/election/election details/types";
import { ElectionModal } from "../../common/modals/Modals";

// Reducer function
const reducer = (state: VoteState, action: VoteAction): VoteState => {
  switch (action.type) {
    case "START_VOTING":
      return {
        ...state,
        loading: { ...state.loading, [action.payload]: true },
        error: null,
        success: false,
      };
    case "VOTE_SUCCESS":
      return {
        ...state,
        loading: { ...state.loading, [action.payload]: false },
        success: true,
      };
    case "VOTE_FAILURE":
      return {
        ...state,
        loading: { ...state.loading, [action.payload.candidateId]: false },
        error: action.payload.error,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.candidateId]: action.payload.loading,
        },
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    default:
      return state;
  }
};

function PolesVotes({
  election,
  totalVotes,
  maleVotes,
  femaleVotes,
  ageRangeDistribution,
  leaderboardTop5,
  leaderboardTop3,
  fetchElection,
}: ElectionResponse) {
  const [state, dispatch] = useReducer(reducer, initialVoteState);

  //MODAL TOGGLE
  const [currentElectionModal, setCurrentElectionModal] = useState<
    "auth" | "vote" | null
  >(null);

  const handleElectionOpenModal = (modal: "auth" | "vote") =>
    setCurrentElectionModal(modal);
  const handleCloseElectionModal = () => setCurrentElectionModal(null);

  //CONTEXT
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  if (!election) {
    return <p>No election data available.</p>; // Render something when election is null
  }

  // Type guard for candidates
  const candidates = Array.isArray(election.candidates)
    ? (election.candidates as Candidate[])
    : [];

  //=============
  // VOTE HANDLER
  //=============
  const handleVote = async (candidateId: string) => {
    if (!election._id) return;
    if (!userInfo) {
      toast.error("You must be logged in to vote.");
      return;
    }
    dispatch({ type: "START_VOTING", payload: candidateId });
    try {
      await axios.post(
        `${request}/api/elections/${election._id}/vote/${candidateId}`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "VOTE_SUCCESS", payload: candidateId });
      toast.success("Vote cast successfully");
      fetchElection();
    } catch (err) {
      toast.error(getError(err as ErrorResponse));
      dispatch({
        type: "VOTE_FAILURE",
        payload: { candidateId, error: getError(err as ErrorResponse) },
      });
    }
  };

  return (
    <div className="poles_votes">
      <div className="content">
        <div className="poles">
          <div className="poles_content">
            <div className="main_bill_headers">
              <h2>
                Poll <span className="green"> Overview</span>
              </h2>
            </div>
            <div className="text">
              <p>{election.pollOverview}</p>
            </div>
          </div>
        </div>
        <div className="vote">
          <div className="vote_content">
            <div className="main_bill_headers">
              <h2>
                Vote your <span className="green"> Candidate</span>
              </h2>
            </div>
            <div className="vote_candidate_list">
              {candidates.map((item: Candidate, index: number) => (
                <div className="list c_flex" key={index}>
                  <div className="left a_flex">
                    <div className="img_party">
                      <div className="img">
                        <img src={item.image} alt="candidate image" />
                      </div>
                      <div className="party">
                        <img src={item.partyImage} alt="party logo" />
                      </div>
                    </div>
                    <div className="name_position">
                      <div className="name">
                        <h4>
                          {item?.lastName} {item?.firstName}
                        </h4>
                      </div>
                      <div className="position">
                        <small>{item.contestingFor}</small>
                      </div>
                      <div className="link">
                        <Link to={`/candidate-profile/${item.slug}`}>
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="btn">
                      <button
                        className={`main_btn a_flex ${
                          election.status !== "ongoing" ? "gray_bg" : ""
                        }`}
                        onClick={() =>
                          handleElectionOpenModal(userInfo ? "vote" : "auth")
                        }
                        disabled={
                          election.status !== "ongoing" ||
                          state.loading[item._id]
                        }
                      >
                        <FingerprintOutlinedIcon className="icon" />
                        <span>Vote</span>
                      </button>
                      <span>
                        <ElectionModal
                          item={item}
                          state={state}
                          handleVote={handleVote}
                          currentElectionModal={currentElectionModal}
                          handleElectionOpenModal={handleElectionOpenModal}
                          handleCloseElectionModal={handleCloseElectionModal}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="vote_stats">
            <VoteStats
              election={election}
              totalVotes={totalVotes}
              maleVotes={maleVotes}
              femaleVotes={femaleVotes}
              ageRangeDistribution={ageRangeDistribution}
              leaderboardTop5={leaderboardTop5}
              leaderboardTop3={leaderboardTop3}
              fetchElection={fetchElection}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolesVotes;
