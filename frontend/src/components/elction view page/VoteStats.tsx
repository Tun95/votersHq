import comment from "../../assets/home/comment.png";
import share from "../../assets/home/share.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SemiCircleProgress } from "../../utilities/component/Component";
import {
  ErrorResponse,
  formatNumberNoDecimalShort,
  formatNumberWithCommas,
  getError,
  useAppContext,
} from "../../utilities/utils/Utils";
import { RWebShare } from "react-web-share";
import { pageURL, request } from "../../base url/BaseUrl";
import { ElectionResponse } from "../../types/election/election details/types";
import axios from "axios";
import { toast } from "react-toastify";
import { Election } from "../../types/election/types";
import { useReducer } from "react";

type Action =
  | { type: "LIKE_REQUEST" }
  | { type: "LIKE_SUCCESS"; payload: Election }
  | { type: "LIKE_FAIL"; payload: string }
  | { type: "DISLIKE_REQUEST" }
  | { type: "DISLIKE_SUCCESS"; payload: Election }
  | { type: "DISLIKE_FAIL"; payload: string };

interface State {
  election: Election | null;
  error: string | null;
  loading: boolean;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LIKE_REQUEST":
    case "DISLIKE_REQUEST":
      return { ...state, loading: true, error: "" };

    case "LIKE_SUCCESS":
    case "DISLIKE_SUCCESS":
      return {
        ...state,
        election: action.payload,
        error: null,
        loading: false,
      };

    case "LIKE_FAIL":
    case "DISLIKE_FAIL":
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

const initialState: State = { election: null, error: null, loading: false };

function VoteStats({
  election,
  totalVotes,
  maleVotes,
  femaleVotes,
  ageRangeDistribution,
  fetchElection,
}: ElectionResponse) {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [, dispatch] = useReducer(reducer, initialState);

  //============
  // HANDLE LIKE
  //============
  const handleLike = async () => {
    if (!userInfo) {
      toast.error("You need to logged first");
      return;
    }
    dispatch({ type: "LIKE_REQUEST" });
    try {
      const { data } = await axios.post(
        `${request}/api/elections/${election._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "LIKE_SUCCESS", payload: data });
      toast.success("Election liked successfully!");
      fetchElection();
    } catch (err) {
      dispatch({
        type: "LIKE_FAIL",
        payload: getError(err as ErrorResponse),
      });
      toast.error(getError(err as ErrorResponse));
    }
  };

  //============
  // HANDLE DISLIKE
  //============
  const handleDislike = async () => {
   if (!userInfo) {
     toast.error("You need to log in first");
     return;
   }

    dispatch({ type: "DISLIKE_REQUEST" });
    try {
      const { data } = await axios.post(
        `${request}/api/elections/${election._id}/dislike`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DISLIKE_SUCCESS", payload: data });
      toast.success("Election disliked successfully!");
      fetchElection();
    } catch (err) {
      dispatch({
        type: "DISLIKE_FAIL",
        payload: getError(err as ErrorResponse),
      });
      toast.error(getError(err as ErrorResponse));
    }
  };

  // AGE RANGE
  const age18to25 =
    ageRangeDistribution.find((range) => range.ageRange === "18-25")
      ?.percentage || 0;

  const age26to40 =
    ageRangeDistribution.find((range) => range.ageRange === "26-40")
      ?.percentage || 0;

  const age41to60 =
    ageRangeDistribution.find((range) => range.ageRange === "41-60")
      ?.percentage || 0;

  const age60Plus =
    ageRangeDistribution.find((range) => range.ageRange === "60+")
      ?.percentage || 0;

  return (
    <div className="vote_stats">
      <div className="progress_progress_bar f_flex">
        <div className="progress">
          <div className="list">
            <ul>
              <li className="c_flex">
                <div className="left">
                  <p>{formatNumberWithCommas(totalVotes)}</p>
                  <small>Total Voters</small>
                </div>
              </li>
              <li className="c_flex">
                <div className="left">
                  <p>{formatNumberWithCommas(maleVotes)}</p>
                  <small>Male Voters</small>
                </div>
              </li>
              <li className="c_flex">
                <div className="left">
                  <p>{formatNumberWithCommas(femaleVotes)}</p>
                  <small>Female Voters</small>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="progress_bar c_flex">
          <div className="top">
            <div className="left">
              <SemiCircleProgress
                percent={age18to25}
                gradientId="progressGradient1"
              />
              <div className="text_num a_flex">
                <h4>{age18to25}%</h4>
                <small>18 - 25 Years</small>
              </div>
            </div>
            <div className="right">
              <SemiCircleProgress
                percent={age41to60}
                gradientId="progressGradient3"
              />
              <div className="text_num a_flex">
                <h4>{age41to60}%</h4>
                <small>41 - 60 Years</small>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="left">
              <SemiCircleProgress
                percent={age26to40}
                gradientId="progressGradient2"
              />
              <div className="text_num a_flex">
                <h4>{age26to40}%</h4>
                <small>26 - 40 Years</small>
              </div>
            </div>
            <div className="right">
              <SemiCircleProgress
                percent={age60Plus}
                gradientId="progressGradient4"
              />
              <div className="text_num a_flex">
                <h4>{age60Plus}%</h4>
                <small>60+ Years</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* LOWER COMPONENT */}
      <div className="like_comment_share c_flex">
        <div className="left a_flex">
          <div className="like_dislike a_flex">
            <div className="like a_flex">
              <i
                className="fa-regular icon fa-thumbs-up"
                onClick={handleLike}
              ></i>
              <small className="count">
                {formatNumberNoDecimalShort(election?.likes?.length)}
              </small>
            </div>
            <div className="dislike a_flex ">
              <i
                className="fa-regular icon fa-thumbs-down"
                onClick={handleDislike}
              ></i>
              <small className="count">
                {" "}
                {formatNumberNoDecimalShort(election?.dislikes?.length)}
              </small>
            </div>
          </div>
          <div className="comment_share a_flex">
            <div className="comment a_flex">
              <img src={comment} alt="comment_img" />
              <small className="count">
                {formatNumberNoDecimalShort(election?.comments?.length)}
              </small>
              <small>Comment</small>
            </div>
            <RWebShare
              data={{
                text: `${election.title}`,
                url: `${pageURL}/elections/${election.slug}`,
                title: election.title,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <div className="share a_flex">
                <img src={share} alt="share" />
                <small>Share</small>
              </div>
            </RWebShare>
          </div>
        </div>

        <div className="right a_flex">
          <VisibilityOutlinedIcon className="icon" />
          <small className="count">
            {" "}
            {formatNumberNoDecimalShort(election?.views)}
          </small>
          <small>Viewed</small>
        </div>
      </div>
    </div>
  );
}

export default VoteStats;
