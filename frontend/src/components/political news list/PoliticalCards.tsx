import { FC } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TruncateMarkup from "react-truncate-markup";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import { formatDateLong } from "../../utilities/utils/Utils";
import { PoliticalCardsProps } from "../../types/political news/types";

const PoliticalCards: FC<PoliticalCardsProps> = ({ item, index }) => {
  return (
    <div className="political_cards" key={index}>
      <div className="img">
        <Link to={`/news/${item.slug}`}>
          <img src={item?.image} alt={item.title} />
        </Link>
      </div>
      <div className="details">
        <div className="date">
          <small className="a_flex">
            <CalendarMonthIcon className="icon" />
            <p>{formatDateLong(item.createdAt)}</p>
          </small>
        </div>
        <div className="title">
          <TruncateMarkup lines={2}>
            <h3>
              <Link to={`/news/${item.slug}`}>{item.title}</Link>
            </h3>
          </TruncateMarkup>
        </div>
        <div className="description">
          <TruncateMarkup lines={2}>
            <p>{parse(item.description)}</p>
          </TruncateMarkup>
        </div>
        <div className="read_more">
          <Link to="">Read More</Link>
        </div>
      </div>
    </div>
  );
};

export default PoliticalCards;
