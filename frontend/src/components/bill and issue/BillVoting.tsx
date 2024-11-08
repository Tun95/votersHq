import { Line } from "rc-progress";
import { RWebShare } from "react-web-share";
import { pageURL } from "../../base url/BaseUrl";
import { useState } from "react";
import { BillsModal } from "../../common/modals/Modals";
import { BillsResponse } from "../../types/bills/bills details/types";
import {
  formatNumberShort,
  formatNumberWithCommas,
  formatNumberWithTwoDecimalsNoSuffix,
  useAppContext,
} from "../../utilities/utils/Utils";

function BillVoting({ fetchBill, bill }: BillsResponse) {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  // Check if the bill is expired
  const isExpired = bill?.expirationDate
    ? new Date(bill.expirationDate) < new Date()
    : false;

  //MODAL TOGGLE
  const [currentBillsModal, setCurrentBillsModal] = useState<
    "auth" | "vote" | null
  >(null);

  // Track the vote type ('yea' or 'nay')
  const [voteType, setVoteType] = useState<"yea" | "nay" | null>(null);

  const handleBillsOpenModal = (
    modal: "auth" | "vote",
    voteType: "yea" | "nay" | null = null
  ) => {
    setVoteType(voteType);
    setCurrentBillsModal(modal);
  };
  
  const handleCloseBillsModal = () => setCurrentBillsModal(null);

  return (
    <>
      <div className="bill_voting">
        <div className="bill_voting_content">
          <div className="main_bill_headers header_screen">
            <h2>
              Bill <span className="green">Voting</span>
            </h2>
          </div>
          <div className="total_vote">
            <ul>
              <li>
                <div className="count_share c_flex">
                  <div className="count_text">
                    <div className="count">
                      <h2>{formatNumberWithCommas(bill?.totalVotes ?? 0)}</h2>
                    </div>
                    <div className="text">
                      <p>Total Citizens Votes</p>
                    </div>
                  </div>
                  <RWebShare
                    data={{
                      text: `${bill?.title}`,
                      url: `${pageURL}/bills/${bill?.slug}`,
                      title: `${bill?.title}`,
                    }}
                    onClick={() => console.log("shared successfully!")}
                  >
                    <div className="share a_flex">
                      <i className="fa-solid icon fa-share-nodes"></i>
                      <small>Share</small>
                    </div>
                  </RWebShare>
                </div>
              </li>
            </ul>
          </div>
          <div className="progress_bar">
            <div className="yea_bar">
              {" "}
              <div className="bar">
                {" "}
                <Line
                  percent={bill?.yeaPercentage}
                  strokeWidth={15}
                  strokeLinecap="butt"
                  trailWidth={15}
                  trailColor="#f8f8f8"
                  className="line_bar"
                  strokeColor="var(--color-yea-progress)"
                />
              </div>
              <div className="yea_content ">
                <div className="c_flex">
                  <div className="left a_flex">
                    <div className="l_flex icon">
                      <i className="fa-solid yea_icon fa-thumbs-up"></i>
                    </div>
                    <div className="text">
                      <p>Yea</p>
                    </div>
                  </div>
                  <div className="right f_flex">
                    <div className="percent">
                      <p>
                        {formatNumberWithTwoDecimalsNoSuffix(
                          bill?.yeaPercentage ?? 0
                        )}
                        %
                      </p>
                    </div>
                    <div className="count a_flex">
                      <small>
                        {formatNumberShort(bill?.totalYeaVotes ?? 0)}
                      </small>
                      <small>Approved</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="nay_bar">
              <div className="bar">
                <Line
                  percent={bill?.nayPercentage}
                  strokeWidth={15}
                  strokeLinecap="butt"
                  trailWidth={15}
                  trailColor="#f8f8f8"
                  className="line_bar"
                  strokeColor="var(--color-nay-progress)"
                />
              </div>
              <div className="nay_content ">
                <div className="c_flex">
                  <div className="left a_flex">
                    <div className="icon l_flex">
                      <i className="fa-solid nay_icon fa-thumbs-down"></i>
                    </div>
                    <div className="text">
                      <p>Nay</p>
                    </div>
                  </div>
                  <div className="right f_flex">
                    <div className="percent">
                      <p>
                        {formatNumberWithTwoDecimalsNoSuffix(
                          bill?.nayPercentage ?? 0
                        )}
                        %
                      </p>
                    </div>
                    <div className="count a_flex">
                      <small>
                        {formatNumberShort(bill?.totalNayVotes ?? 0)}
                      </small>
                      <small>Disapproved</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {bill?.expirationDate && (
            <div className="btn a_flex">
              <div className="yea">
                <button
                  onClick={() =>
                    handleBillsOpenModal(userInfo ? "vote" : "auth", "yea")
                  }
                  className="yea_btn a_flex"
                  disabled={isExpired}
                >
                  <i className="fa-solid yea_icon fa-thumbs-up"></i>
                  <p>Yea</p>
                </button>
              </div>
              <div className="nay">
                <button
                  onClick={() =>
                    handleBillsOpenModal(userInfo ? "vote" : "auth", "nay")
                  }
                  className="nay_btn a_flex"
                  disabled={isExpired}
                >
                  <i className="fa-solid nay_icon fa-thumbs-down"></i>
                  <p>Nay</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <span>
        <BillsModal
          fetchBill={fetchBill}
          bill={bill}
          currentBillsModal={currentBillsModal}
          handleBillsOpenModal={handleBillsOpenModal}
          handleCloseBillsModal={handleCloseBillsModal}
          voteType={voteType}
        />
      </span>
    </>
  );
}

export default BillVoting;
