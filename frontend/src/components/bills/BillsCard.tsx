import { FC } from "react";
import TruncateMarkup from "react-truncate-markup";
import commentImg from "../../assets/home/comment.png";
import shareImg from "../../assets/home/share.png";
import { Link } from "react-router-dom";
import { RWebShare } from "react-web-share";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { Line } from "rc-progress";
import {
  formatDateSlash,
  formatNumberShort,
} from "../../utilities/utils/Utils";
import { pageURL } from "../../base url/BaseUrl";
import { BillsCardProps } from "../../types/bills/types";
import parse from "html-react-parser";

const BillsCard: FC<BillsCardProps> = ({ bill }) => {
  console.log("BILLS:", bill);
  return (
    <div className="post_cards">
      <div className="featured_card">
        <div className="slider_content">
          <div className="slide_list">
            <div className="list">
              <div className="img_pallet">
                <div className="img">
                  <Link to={`/bills/${bill.slug}`}>
                    <img src={bill?.image} alt={bill?.title} />
                  </Link>
                </div>
              </div>
              <div className="details">
                <div className="past_card">
                  <div className="tag_date c_flex">
                    <div className="tags annoying_ta">
                      <div className="list a_flex">
                        {bill.sortCategory && (
                          <span className="tag c_flex">
                            <small className="bills_f_tag">
                              {bill?.sortCategory[0]}
                            </small>
                          </span>
                        )}
                        {bill?.sortStatus && (
                          <span className="tag c_flex">
                            <small className="bills_f_tag">
                              {bill?.sortStatus[0]}
                            </small>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="date">
                      <small>{formatDateSlash(bill.createdAt)}</small>
                    </div>
                  </div>
                  <div className="candidate  a_flex">
                    <div className="img">
                      <Link
                        to={`/politician-profile-view/${bill.candidateDetails[0]?._id}`}
                      >
                        <img
                          className="user_candidate_img"
                          src={bill.candidateDetails[0]?.image}
                          alt={bill.candidateDetails[0]?.firstName}
                        />
                      </Link>
                    </div>
                    <div className="name_location">
                      <div className="name">
                        <TruncateMarkup lines={1}>
                          <h5>
                            <Link
                              to={`/politician-profile-view/${bill.candidateDetails[0]?._id}`}
                            >
                              {bill.candidateDetails[0]?.lastName}{" "}
                              {bill.candidateDetails[0]?.firstName}
                            </Link>
                          </h5>
                        </TruncateMarkup>
                      </div>
                      <div className="location">
                        <TruncateMarkup lines={1}>
                          <p>
                            {bill.candidateDetails[0]?.region},{" "}
                            {bill.candidateDetails[0]?.stateOfOrigin}
                          </p>
                        </TruncateMarkup>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="name">
                  <Link to={`/bills/${bill.slug}`}>
                    <TruncateMarkup lines={2}>
                      <h4>{bill?.title}</h4>
                    </TruncateMarkup>
                  </Link>
                </div>

                <div className="past_card">
                  <div className="description">
                    <TruncateMarkup lines={3}>
                      <p>{parse(bill.description)}</p>
                    </TruncateMarkup>
                  </div>
                  <div className="yea_nay">
                    <div className="yea c_flex">
                      <div className="tomb a_flex">
                        <i className="fa-regular fa-thumbs-up"></i>
                        <small>Yea</small>
                      </div>
                      <div className="progress_bar">
                        <Line
                          percent={bill?.yeaPercentage}
                          strokeWidth={1}
                          trailWidth={1}
                          strokeColor="var(--color-bg-green)"
                        />
                      </div>
                      <div className="count_vote">
                        <small>{formatNumberShort(bill?.totalYeaVotes)}</small>
                      </div>
                    </div>
                    <div className="nay c_flex">
                      <div className="tomb a_flex">
                        <i className="fa-regular fa-thumbs-down"></i>
                        <small>Nay</small>
                      </div>
                      <div className="progress_bar">
                        <Line
                          percent={bill?.nayPercentage}
                          strokeWidth={1}
                          trailWidth={1}
                          strokeColor="var(--color-red)"
                        />
                      </div>
                      <div className="count_vote">
                        <small>{formatNumberShort(bill?.totalNayVotes)}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="comments_share c_flex">
        <div className="a_flex">
          <Link to="" className="comments_count a_flex">
            <img src={commentImg} alt="comment icon" />
            <small>{bill?.totalComments}</small>
          </Link>
          <RWebShare
            data={{
              text: `${bill?.title}`,
              url: `${pageURL}/bills/${bill?.slug}`,
              title: bill?.title,
            }}
            onClick={() => console.log("shared successfully!")}
          >
            <div className="share a_flex">
              <img src={shareImg} alt="share icon" />
              <small>Share</small>
            </div>
          </RWebShare>
        </div>
        <div className="view_count a_flex">
          <div className="view_icon">
            <VisibilityIcon className="icon" />
          </div>
          <div className="count">
            <p>{formatNumberShort(bill?.views)}</p>
          </div>
          <div className="text">
            <p>Viewed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillsCard;
