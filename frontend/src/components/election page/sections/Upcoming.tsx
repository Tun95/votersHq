import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TruncateMarkup from "react-truncate-markup";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { RWebShare } from "react-web-share";
import { Link } from "react-router-dom";
import commentImg from "../../../assets/home/comment.png";
import shareImg from "../../../assets/home/share.png";
import { pageURL } from "../../../base url/BaseUrl";
import { formatDateOrdinal } from "../../../utilities/utils/Utils";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Election } from "../../../types/election/types";

interface UpcomingProps {
  upcoming: Election[];
  toggleBox: (section: string) => void;
  isOpen: boolean;
}

const Upcoming: React.FC<UpcomingProps> = ({ upcoming, toggleBox, isOpen }) => {
  return (
    <div className="section_box">
      <div className="content">
        <div className="head a_flex" onClick={() => toggleBox("upcoming")}>
          <h2>
            Upcoming <span className="bold">Election Polls</span>
          </h2>
          {isOpen ? (
            <KeyboardArrowUpIcon className="icon" />
          ) : (
            <KeyboardArrowDownIcon className="icon" />
          )}
        </div>
        {isOpen && (
          <>
            {upcoming?.length === 0 && (
              <div className="no_review l_flex">
                <p>No Upcoming Election Found</p>
              </div>
            )}
            <div className="main_list">
              <div className="list_item">
                {upcoming.map((item) => (
                  <div className="featured_card" key={item._id}>
                    <div className="slider_content">
                      <div className="slide_list">
                        <div className="list">
                          <div className="img_pallet">
                            <div className="img">
                              <Link to={`/elections/${item.slug}`}>
                                <img src={item.image} alt={item.title} />
                              </Link>
                            </div>
                          </div>
                          <div className="details">
                            <div className="name">
                              <TruncateMarkup lines={1}>
                                <h4>
                                  <Link to={`/elections/${item.slug}`}>
                                    {item.title}
                                  </Link>
                                </h4>
                              </TruncateMarkup>
                            </div>
                            <span className="up_coming">
                              <div className="status_vote_count c_flex">
                                <div className="status upcoming_status l_flex">
                                  <small className="status-text">
                                    {item.status}
                                  </small>
                                </div>
                                <div className="upcoming_count count a_flex">
                                  <FingerprintIcon className="icon" />
                                  <small>Not started</small>
                                </div>
                              </div>
                              {item?.startDate && (
                                <div className="date a_flex">
                                  <CalendarMonthIcon className="icon" />
                                  <small>
                                    {formatDateOrdinal(item?.startDate ?? "")}
                                  </small>
                                </div>
                              )}
                            </span>
                            <div className="comments_share a_flex">
                              <Link
                                to={`/elections/${item.slug}#comments`}
                                className="comments_count a_flex"
                              >
                                <img src={commentImg} alt="comment icon" />
                                <small>{item.comments?.length}</small>
                              </Link>
                              <RWebShare
                                data={{
                                  text: `${item.title}`,
                                  url: `${pageURL}/elections/${item.slug}`,
                                  title: item.title,
                                }}
                                onClick={() =>
                                  console.log("shared successfully!")
                                }
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
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
