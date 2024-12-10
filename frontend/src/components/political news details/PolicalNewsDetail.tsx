import { PoliticalNews } from "../../types/political news/types";
import "./styles.scss";
import parse from "html-react-parser";

interface PolicalNewsDetailProps {
  news: PoliticalNews;
}
function PolicalNewsDetail({ news }: PolicalNewsDetailProps) {
  return (
    <div className="political_news_details l_flex">
      <div className="details_content">
        <div className="image">
          <img src={news?.image} alt={news?.title} />
        </div>
        <div className="title">
          <h2>{news?.title}</h2>
        </div>
        <div className="description">
          <p>{parse(news?.description)}</p>
        </div>
      </div>
    </div>
  );
}

export default PolicalNewsDetail;
