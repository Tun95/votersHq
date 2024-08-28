import { FC } from "react";
import TruncateMarkup from "react-truncate-markup";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import commentImg from "../../../assets/home/comment.png";
import shareImg from "../../../assets/home/share.png";
import { Link } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { RWebShare } from "react-web-share";
import {
  formatDateOrdinal,
  formatDateSlash,
  formatNumberShort,
  formatNumberWithCommas,
} from "../../../utilities/utils/Utils";
import { pageURL } from "../../../base url/BaseUrl";
import { Line } from "rc-progress";
import { CombinedItem } from "../../../types/generalTypes";
import parse from "html-react-parser";

interface FeaturedCardProps {
  item: CombinedItem;
}
const FeaturedCard: FC<FeaturedCardProps> = ({ item }) => {
  return (
    <div className="featured_card">
      <div className="slider_content">
        <div className="slide_list">
          <div className="list">
            <div className="img_pallet">
              <div className="img">
                {item.status === "ongoing" ||
                item.status === "upcoming" ||
                item.status === "concluded" ? (
                  <Link to={`/elections/${item.slug}`}>
                    <img src={item.image} alt={item.title} />
                  </Link>
                ) : (
                  <Link to={`/bills/${item.slug}`}>
                    <img src={item.image} alt={item.title} />
                  </Link>
                )}
              </div>
              {item.status === "ongoing" && (
                <div className="pallet a_flex">
                  <FingerprintIcon className="icon" />
                  <p>Live</p>
                </div>
              )}
            </div>
            <div className="details">
              {!item.status && (
                <div className="past_card">
                  <div className="tag_date c_flex">
                    <div className="tags">
                      <div className="list a_flex">
                        {item.sortCategory && (
                          <span className="tag c_flex">
                            <small className="bills_f_tag">
                              {item?.sortCategory[0]}
                            </small>
                          </span>
                        )}
                        {item?.sortStatus && (
                          <span className="tag c_flex">
                            <small className="bills_f_tag">
                              {item?.sortStatus[0]}
                            </small>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="date">
                      <small>{formatDateSlash(item?.createdAt)}</small>
                    </div>
                  </div>
                  <div className="candidate a_flex">
                    <div className="img">
                      <img src={item.user?.image} alt={item.user?.firstName} />
                    </div>
                    <div className="name_location">
                      <div className="name">
                        <TruncateMarkup lines={1}>
                          <h5>
                            {item?.user?.role === "user" ? (
                              <Link to={`/user-profile-view/${item.user?._id}`}>
                                {item.user?.lastName} {item.user?.firstName}
                              </Link>
                            ) : (
                              item?.user?.role === "politician" && (
                                <Link
                                  to={`/politician-profile-view/${item.user?._id}`}
                                >
                                  {item.user?.lastName} {item.user?.firstName}
                                </Link>
                              )
                            )}
                          </h5>
                        </TruncateMarkup>
                      </div>
                      <div className="location">
                        <TruncateMarkup lines={1}>
                          <p>
                            {" "}
                            {item.user?.region}, {item.user?.stateOfOrigin}
                          </p>
                        </TruncateMarkup>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="name">
                {item.status === "ongoing" ||
                item.status === "upcoming" ||
                item.status === "concluded" ? (
                  <TruncateMarkup lines={1}>
                    <h4>
                      <Link to={`/elections/${item.slug}`}>{item.title}</Link>
                    </h4>
                  </TruncateMarkup>
                ) : (
                  <Link to={`/bills/${item.slug}`}>
                    <TruncateMarkup lines={2}>
                      <h4>{item.title}</h4>
                    </TruncateMarkup>
                  </Link>
                )}
              </div>
              {!item.status && (
                <div className="past_card">
                  <div className="description">
                    <TruncateMarkup lines={3}>
                      <p>{parse(item.description)}</p>
                    </TruncateMarkup>
                  </div>
                  <div className="yea_nay">
                    <div className="yea c_flex">
                      <div className="tomb a_flex">
                        <i className="fa-regular fa-thumbs-up"></i>
                        <small>Yea</small>
                      </div>
                      <div className="progress_bar home_progress_bar">
                        <Line
                          percent={item?.yeaPercentage}
                          strokeWidth={1}
                          trailWidth={1}
                          strokeColor="var(--color-bg-green)"
                        />
                      </div>
                      <div className="count_vote">
                        <small>
                          {formatNumberShort(item?.totalYeaVotes ?? 0)}
                        </small>
                      </div>
                    </div>
                    <div className="nay c_flex">
                      <div className="tomb a_flex">
                        <i className="fa-regular fa-thumbs-down"></i>
                        <small>Nay</small>
                      </div>
                      <div className="progress_bar home_progress_bar">
                        <Line
                          percent={item.nayPercentage}
                          strokeWidth={1}
                          trailWidth={1}
                          strokeColor="var(--color-red)"
                        />
                      </div>
                      <div className="count_vote">
                        <small>
                          {formatNumberShort(item?.totalNayVotes ?? 0)}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {item.status === "ongoing" && (
                <span className="on_going">
                  <div className="status_vote_count c_flex">
                    <div className="status ongoing_status l_flex">
                      <small className="status-text">{item.status}</small>
                    </div>
                    <div className="ongoing_count count a_flex">
                      <FingerprintIcon className="icon" />
                      <small>
                        {formatNumberWithCommas(item?.totalVotes ?? 0)}
                      </small>
                      <small className="votes">votes</small>
                    </div>
                  </div>
                  <div className="progress_bar_description">
                    <div className="progress_bar">
                      <Line
                        percent={item?.progress}
                        strokeWidth={2}
                        trailWidth={2}
                        strokeColor="var(--color-primary)"
                      />
                    </div>
                    <div className="description">
                      <TruncateMarkup lines={1}>
                        <p>{item.pollOverview}</p>
                      </TruncateMarkup>
                    </div>
                  </div>
                </span>
              )}
              {item.status === "upcoming" && (
                <span className="up_coming">
                  <div className="status_vote_count c_flex">
                    <div className="status upcoming_status l_flex">
                      <small className="status-text">{item.status}</small>
                    </div>
                    <div className="upcoming_count count a_flex">
                      <FingerprintIcon className="icon" />
                      <small>Not started</small>
                    </div>
                  </div>
                  <div className="date a_flex">
                    <CalendarMonthIcon className="icon" />
                    <small>{formatDateOrdinal(item?.startDate ?? "")}</small>
                  </div>
                </span>
              )}
              {item.status === "concluded" && (
                <span className="up_coming">
                  <div className="status_vote_count c_flex">
                    <div className="status concluded_status l_flex">
                      <small className="status-text">{item.status}</small>
                    </div>
                    <div className="upcoming_count count a_flex">
                      <FingerprintIcon className="icon conc_icon" />
                      <small className="conc_votes">
                        {formatNumberWithCommas(item?.totalVotes ?? 0)}
                      </small>
                      <small className="conc_votes votes">votes</small>
                    </div>
                  </div>
                  <div className="date a_flex">
                    <CalendarMonthIcon className="icon" />
                    <small>
                      {formatDateOrdinal(item?.expirationDate ?? "")}
                    </small>
                  </div>
                </span>
              )}
              <div className="comments_share a_flex">
                <Link to="" className="comments_count a_flex">
                  <img src={commentImg} alt="comment icon" />
                  <small>{item?.comments?.length}</small>
                </Link>
                <RWebShare
                  data={{
                    text: `${item.title}`,
                    url: `${pageURL}/post/${item.slug}`,
                    title: item.title,
                  }}
                  onClick={() => console.log("shared successfully!")}
                >
                  <div className="share a_flex">
                    <img src={shareImg} alt="share icon" />
                    <small>Share</small>
                  </div>
                </RWebShare>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;
