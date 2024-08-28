import { Line } from "rc-progress";
import { ElectionResponse } from "../../types/election/election details/types";
import {
  formatNumberNoDecimalShort,
  formatNumberShort,
  formatNumberWithCommas,
} from "../../utilities/utils/Utils";

function PollLeaderBoard({
  leaderboardTop5,
  leaderboardTop3,
}: ElectionResponse) {
  const getStrokeColor = (index: number): string => {
    switch (index) {
      case 0:
        return "var(--color-yea-progress)";
      case 1:
        return "var(--color-nay-progress)";
      case 2:
        return "var(--color-yellow-progress)";
      case 3:
        return "var(--color-brown-progress)";
      case 4:
        return "var(--color-neutral-progress)";
      default:
        return "var(--color-default-progress)";
    }
  };

  const getBeforeElementClass = (index: number): string => {
    switch (index) {
      case 0:
        return "before-element-1";
      case 1:
        return "before-element-2";
      case 2:
        return "before-element-3";
      case 3:
        return "before-element-4";
      case 4:
        return "before-element-5";
      default:
        return "before-element-default"; // Optional default class
    }
  };

  // Extracting candidates
  const firstCandidate = leaderboardTop3[0];
  const secondCandidate = leaderboardTop3[1];
  const thirdCandidate = leaderboardTop3[2];
  return (
    <>
      {leaderboardTop5?.length !== 0 && leaderboardTop3?.length !== 0 ? (
        <div className="poll_leader_board">
          <div className="poll_leader_board_content">
            <div className="main_bill_headers">
              <h2>
                Poll Leader <span className="green"> Board</span>
              </h2>
            </div>
            {leaderboardTop3 && (
              <div className="poll_board">
                <div className="list_board">
                  {/* Render Second Candidate if available */}
                  {secondCandidate && (
                    <div className="card second_candidate">
                      <div className="top">
                        <div className="img_party">
                          <div className="img">
                            <img
                              src={secondCandidate.candidate?.image}
                              alt="candidate"
                            />
                          </div>
                          <div className="party">
                            <img
                              src={secondCandidate.candidate?.partyImage}
                              alt="party"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bottom a_flex">
                        <h1>
                          {formatNumberShort(secondCandidate.votePercentage)}%
                        </h1>
                        <small>Total Vote</small>
                        <p>
                          {formatNumberWithCommas(secondCandidate.totalVotes)}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Render First Candidate if available */}
                  {firstCandidate && (
                    <div className="card first_candidate">
                      <div className="top">
                        <div className="img_party">
                          <div className="img">
                            <img
                              src={firstCandidate.candidate?.image}
                              alt="candidate"
                            />
                          </div>
                          <div className="party">
                            <img
                              src={firstCandidate.candidate?.partyImage}
                              alt="party"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bottom a_flex">
                        <h1>
                          {formatNumberShort(firstCandidate.votePercentage)}%
                        </h1>
                        <small>Total Vote</small>
                        <p>
                          {formatNumberWithCommas(firstCandidate.totalVotes)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Render Third Candidate if available */}
                  {thirdCandidate && (
                    <div
                      className={`card third_candidate ${
                        thirdCandidate ? "top_down" : ""
                      }`}
                    >
                      <div className="top">
                        <div className="img_party">
                          <div className="img">
                            <img
                              src={thirdCandidate.candidate?.image}
                              alt="candidate"
                            />
                          </div>
                          <div className="party">
                            <img
                              src={thirdCandidate.candidate?.partyImage}
                              alt="party"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bottom a_flex">
                        <h1>
                          {formatNumberShort(thirdCandidate.votePercentage)}%
                        </h1>
                        <small>Total Vote</small>
                        <p>
                          {formatNumberWithCommas(thirdCandidate.totalVotes)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {leaderboardTop5 && (
              <div className="leader_board">
                <div className="progress_bar">
                  {leaderboardTop5?.map((item, index) => (
                    <div className="leader_bar" key={index}>
                      <div
                        className={`bar ${getBeforeElementClass(index)}`}
                        key={item?.candidate?._id}
                      >
                        <Line
                          percent={item.votePercentage}
                          strokeWidth={15}
                          strokeLinecap="butt"
                          trailWidth={15}
                          trailColor="#f8f8f8"
                          className="line_bar"
                          strokeColor={getStrokeColor(index)}
                        />
                      </div>
                      <div className="leader_bar_content">
                        <div className="c_flex">
                          <div className="left a_flex">
                            <div className="candidate_image icon">
                              <img
                                src={item.candidate?.image}
                                alt="candidate"
                              />
                            </div>
                            <div className="name_party">
                              <div className="name">
                                <h4>
                                  {item.candidate?.lastName}&#160;
                                  {item.candidate?.firstName}
                                </h4>
                              </div>
                              <div className="party">
                                <small>{item.candidate?.partyName}</small>
                              </div>
                            </div>
                          </div>
                          <div className="right a_flex">
                            <div className="percent_vote a_flex">
                              <div className="percent">
                                <p>{formatNumberShort(item.votePercentage)}%</p>
                              </div>
                              <div className="count a_flex">
                                <small>
                                  {formatNumberNoDecimalShort(item.totalVotes)}
                                </small>
                                <small>Approved</small>
                              </div>
                            </div>
                            <div className="party_logo">
                              <img
                                src={item.candidate?.partyImage}
                                alt="party logo"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default PollLeaderBoard;
