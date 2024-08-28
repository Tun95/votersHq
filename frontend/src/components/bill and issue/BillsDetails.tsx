import "./styles.scss";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import candidate from "../../assets/bill/candidate.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import b1 from "../../assets/bill/b1.png";
import DetailsContent from "./DetailsContent";
import { BillsResponse } from "../../types/bills/bills details/types";
import { Link } from "react-router-dom";
import {
  formatDateSlash,
  formatNumberShort,
} from "../../utilities/utils/Utils";

function BillsDetails({ fetchBill, bill }: BillsResponse) {
  return (
    <div className="bill_details">
      <div className="bill_content">
        <div className="header">
          <div className="tags a_flex">
            {bill?.sortCategory && (
              <div className="type tag_box bills_f_tag">
                <p>{bill?.sortCategory[0]}</p>
              </div>
            )}
            {bill?.sortType && (
              <div className="category tag_box bills_f_tag">
                <p>{bill?.sortType[0]}</p>
              </div>
            )}
          </div>
          <div className="bill_head">
            <h1>{bill?.title}</h1>
          </div>
          <div className="candidate c_flex">
            <div className="left a_flex">
              <div className="img">
                <img
                  src={bill ? bill.user.image : candidate}
                  alt={bill?.user?.firstName}
                />
              </div>
              <div className="name_location a_flex">
                <div className="name">
                  <h4>
                    {bill?.user?.role === "user" ? (
                      <Link to={`/user-profile-view/${bill.user?._id}`}>
                        {bill.user?.lastName} {bill.user?.firstName}
                      </Link>
                    ) : (
                      bill?.user?.role === "politician" && (
                        <Link to={`/politician-profile-view/${bill.user?._id}`}>
                          {bill.user?.lastName} {bill.user?.firstName}
                        </Link>
                      )
                    )}
                  </h4>
                </div>
                <div className="location">
                  <small>
                    {bill?.user?.region}, {bill?.user?.stateOfOrigin}
                  </small>
                </div>
              </div>
            </div>
            <div className="right a_flex">
              <div className="views a_flex">
                <VisibilityOutlinedIcon className="icon" />
                <div className="view_count">
                  <small>{formatNumberShort(bill?.views ?? 0)}</small>
                </div>
                <small>Viewed</small>
              </div>
              <div className="tag_date a_flex">
                {bill?.sortStatus && (
                  <div className="sec_reading tag_box">
                    <p>{bill?.sortStatus[0]}</p>
                  </div>
                )}
                <div className="date a_flex">
                  <CalendarMonthIcon className="icon" />
                  <small>{formatDateSlash(bill?.createdAt ?? "")}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="perse_content">
          <div className="img">
            <img src={bill ? bill?.banner : b1} alt={bill?.title} />
          </div>
          <div className="mobile_side_content"></div>
          <div className="perse">
            <DetailsContent fetchBill={fetchBill} bill={bill} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillsDetails;
