import { BillsResponse } from "../../types/bills/bills details/types";

function RegionalStat({ bill }: BillsResponse) {
  // Define a helper function to format the vote data
  const formatVoteData = (region: string) => {
    const regionalVote = bill?.regionalVotes.find((rv) => rv.region === region);
    return regionalVote
      ? {
          totalVotes: regionalVote.totalVotes,
          percentageVotes: Number(regionalVote.percentageVotes), // Ensure percentageVotes is a number
        }
      : { totalVotes: 0, percentageVotes: 0 };
  };

  return (
    <div className="regional_stat">
      <div className="regional_stat_content">
        <div className="main_bill_headers">
          <h2>
            Regional <span className="green">Stats</span>
          </h2>
        </div>
        <div className="list">
          <ul>
            {/* North Central */}
            <li className="c_flex">
              <div className="left">
                <p>
                  {formatVoteData("North Central").totalVotes.toLocaleString()}
                </p>
                <small>North Central</small>
              </div>
              <div className="right">
                <p>
                  {formatVoteData("North East").totalVotes.toLocaleString()}
                </p>
                <small>North East</small>
              </div>
            </li>
            {/* North West */}
            <li className="c_flex">
              <div className="left">
                <p>
                  {formatVoteData("North West").totalVotes.toLocaleString()}
                </p>
                <small>North West</small>
              </div>
              <div className="right">
                <p>
                  {formatVoteData("South East").totalVotes.toLocaleString()}
                </p>
                <small>South East</small>
              </div>
            </li>
            {/* South South */}
            <li className="c_flex">
              <div className="left">
                <p>
                  {formatVoteData("South South").percentageVotes?.toFixed(2)}%
                </p>
                <small>South South</small>
              </div>
              <div className="right">
                <p>
                  {formatVoteData("South West").percentageVotes?.toFixed(2)}%
                </p>
                <small>South West</small>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RegionalStat;
