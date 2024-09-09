import "./widget.scss";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";

interface WidgetProps {
  type: "user" | "bill" | "election" | "news";
  TotalUsers?: number;
  TotalBills?: number;
  TotalElections?: number;
  TotalNews?: number;
}

const Widget: React.FC<WidgetProps> = ({
  type,
  TotalUsers = 0,
  TotalBills = 0,
  TotalElections = 0,
  TotalNews = 0,
}) => {
  let data:
    | {
        title: string;
        isMoney: boolean;
        link: string;
        icon: JSX.Element;
      }
    | undefined;

  // Determine the amount based on the type prop
  const dataType =
    type === "user"
      ? TotalUsers
      : type === "bill"
      ? TotalBills
      : type === "election"
      ? TotalElections
      : type === "news"
      ? TotalNews
      : 0;

  // Switch statement to handle different widget types
  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "Number of users",
        icon: (
          <PersonOutlineOutlinedIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "rgba(255,0,0,0.2)" }}
          />
        ),
      };
      break;
    case "bill":
      data = {
        title: "BILLS",
        isMoney: false,
        link: "All bills",
        icon: (
          <ReceiptOutlinedIcon
            className="icon"
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218,165,32,0.2)",
            }}
          />
        ),
      };
      break;
    case "election":
      data = {
        title: "ELECTION",
        isMoney: false,
        link: "All election",
        icon: (
          <HowToVoteOutlinedIcon
            className="icon"
            style={{ color: "green", backgroundColor: "rgba(0,128,0,0.2)" }}
          />
        ),
      };
      break;
    case "news":
      data = {
        title: "NEWS",
        isMoney: false,
        link: "All news",
        icon: (
          <NewspaperOutlinedIcon
            className="icon"
            style={{ color: "purple", backgroundColor: "rgba(128,0,128,0.2)" }}
          />
        ),
      };
      break;
    default:
      data = undefined;
      break;
  }

  if (!data) return null; // Handle invalid type

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {" "}
          {data.isMoney ? `$${dataType.toLocaleString()}` : dataType}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          {/* Placeholder for percentage change */}
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
