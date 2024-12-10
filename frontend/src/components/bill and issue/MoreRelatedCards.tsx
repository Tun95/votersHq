import { Link, useNavigate } from "react-router-dom";
import { RWebShare } from "react-web-share";
import { pageURL } from "../../base url/BaseUrl";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TruncateMarkup from "react-truncate-markup";
import commentImg from "../../assets/home/comment.png";
import shareImg from "../../assets/home/share.png";
import { Line } from "rc-progress";
import {
  formatDateSlash,
  formatNumberShort,
} from "../../utilities/utils/Utils";
import { BillsResponse } from "../../types/bills/bills details/types";
import parse from "html-react-parser";

const MoreRelatedCards: React.FC<BillsResponse> = ({ fetchBill, bill }) => {
  const navigate = useNavigate();

  const handleLinkClick = (slug: string) => {
    fetchBill(slug, true); // Trigger loading and pass the slug
    navigate(`/bills/${slug}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="more_related_cards">
      <div className="related_cards_content">
        {" "}
        <div className="post_cards">
          <Link to={`/bills/${bill?.slug}`}>
            <div className="featured_card">
              <div className="slider_content">
                <div className="slide_list">
                  <div className="list">
                    <div className="img_pallet">
                      <div className="img">
                        <span
                          className="cursor"
                          onClick={() =>
                            bill?.slug && handleLinkClick(bill.slug)
                          }
                        >
                          <img src={bill?.image} alt={bill?.title} />
                        </span>
                      </div>
                    </div>
                    <div className="details">
                      <div className="past_card">
                        <div className="tag_date c_flex">
                          <div className="tags">
                            <div className="list a_flex">
                              {bill?.sortCategory && (
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
                            <small>
                              {formatDateSlash(bill?.createdAt ?? "")}
                            </small>
                          </div>
                        </div>
                        <div className="candidate a_flex">
                          <div className="img">
                            <Link
                              to={`/politician-profile-view/${bill?.user?._id}`}
                            >
                              <img
                                className="user_candidate_img"
                                src={bill?.candidates[0]?.image}
                                alt={bill?.candidates[0]?.firstName}
                              />
                            </Link>
                          </div>
                          <div className="name_location">
                            <div className="name">
                              <TruncateMarkup lines={1}>
                                <h5>
                                  <Link
                                    to={`/politician-profile-view/${bill?.user?._id}`}
                                  >
                                    {bill?.user?.lastName}{" "}
                                    {bill?.user?.firstName}
                                  </Link>
                                </h5>
                              </TruncateMarkup>
                            </div>
                            <div className="location">
                              <TruncateMarkup lines={1}>
                                <p>
                                  {bill?.user?.region},{" "}
                                  {bill?.user?.stateOfOrigin}
                                </p>
                              </TruncateMarkup>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="name">
                        <span className="cursor">
                          <TruncateMarkup lines={1}>
                            <h4
                              onClick={() =>
                                bill?.slug && handleLinkClick(bill.slug)
                              }
                            >
                              {bill?.title}
                            </h4>
                          </TruncateMarkup>
                        </span>
                      </div>

                      <div className="past_card">
                        <div className="description">
                          <TruncateMarkup lines={1}>
                            <p>{parse(bill?.description ?? "")}</p>
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
                                percent={bill?.yeaPercentage ?? 0}
                                strokeWidth={1}
                                trailWidth={1}
                                strokeColor="var(--color-bg-green)"
                              />
                            </div>
                            <div className="count_vote">
                              <small>
                                {formatNumberShort(bill?.totalYeaVotes ?? 0)}
                              </small>
                            </div>
                          </div>
                          <div className="nay c_flex">
                            <div className="tomb a_flex">
                              <i className="fa-regular fa-thumbs-down"></i>
                              <small>Nay</small>
                            </div>
                            <div className="progress_bar">
                              <Line
                                percent={bill?.nayPercentage ?? 0}
                                strokeWidth={1}
                                trailWidth={1}
                                strokeColor="var(--color-red)"
                              />
                            </div>
                            <div className="count_vote">
                              <small>
                                {formatNumberShort(bill?.totalNayVotes ?? 0)}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <div className="comments_share c_flex">
            <div className="a_flex">
              <Link to="" className="comments_count a_flex">
                <img src={commentImg} alt="comment icon" />
                <small>{bill?.comments?.length}</small>
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
                <p>{formatNumberShort(bill?.views ?? 0)}</p>
              </div>
              <div className="text">
                <p>Viewed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreRelatedCards;
