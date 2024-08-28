import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Line } from "rc-progress";
import TruncateMarkup from "react-truncate-markup";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { RWebShare } from "react-web-share";
import { Link } from "react-router-dom";
import commentImg from "../../../assets/home/comment.png";
import shareImg from "../../../assets/home/share.png";
import { pageURL } from "../../../base url/BaseUrl";
import { formatNumberWithCommas } from "../../../utilities/utils/Utils";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Election } from "../../../types/election/types";
import parse from "html-react-parser";

interface OngoingProps {
  ongoing: Election[];
  toggleBox: (section: string) => void;
  isOpen: boolean;
}

const Ongoing: React.FC<OngoingProps> = ({ ongoing, toggleBox, isOpen }) => {
  return (
    <div className="section_box">
      <div className="content">
        <div className="head a_flex" onClick={() => toggleBox("ongoing")}>
          <h2>
            Ongoing <span className="bold">Election Polls</span>
          </h2>
          {isOpen ? (
            <KeyboardArrowUpIcon className="icon" />
          ) : (
            <KeyboardArrowDownIcon className="icon" />
          )}
        </div>
        {isOpen && (
          <>
            {ongoing?.length === 0 && (
              <div className="no_review l_flex">
                <p>No Ongoing Election Found</p>
              </div>
            )}
            <div className="main_list">
              <div className="list_item">
                {ongoing.map((item) => (
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
                            <div className="pallet a_flex">
                              <FingerprintIcon className="icon" />
                              <p>Live</p>
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

                            <span className="on_going">
                              <div className="status_vote_count c_flex">
                                <div className="status ongoing_status l_flex">
                                  <small className="status-text">
                                    {item.status}
                                  </small>
                                </div>
                                <div className="ongoing_count count a_flex">
                                  <FingerprintIcon className="icon" />
                                  <small>
                                    {formatNumberWithCommas(item.totalVotes)}
                                  </small>
                                  <small className="votes">votes</small>
                                </div>
                              </div>
                              <div className="progress_bar_description">
                                <div className="progress_bar">
                                  <Line
                                    percent={item.progress}
                                    strokeWidth={2}
                                    trailWidth={2}
                                    strokeColor="var(--color-primary)"
                                  />
                                </div>
                                <div className="description">
                                  <TruncateMarkup lines={1}>
                                    <p>{parse(item.pollOverview)}</p>
                                  </TruncateMarkup>
                                </div>
                              </div>
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

export default Ongoing;
