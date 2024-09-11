import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import v3 from "../../../assets/others/v3.png";
import { useNavigate } from "react-router-dom";
import "../styles.scss";

interface PendingAccountDropDownMenuProps {
  setMenu: (menu: "register" | "otp" | "created" | "pending" | "login") => void;
  onClose: () => void;
}
function PendingAccountDropDownMenu({
  //setMenu,
  onClose,
}: PendingAccountDropDownMenuProps) {
  const navigate = useNavigate();

  const handlePendingSubmit = () => {
    navigate("/");
    onClose();
  };
  return (
    <Box className="menu_modal otp_menu verify_account_menu">
      <div className="close_icon">
        <span onClick={onClose} className="a_flex">
          <CloseIcon className="icon" />
          <small>Close</small>
        </span>
      </div>
      <div className="otp_created_pending_login header_box">
        <div className="img_width l_flex">
          {" "}
          <div className="img">
            <img src={v3} alt="otp verify" />
          </div>
        </div>
        <div className="form_box">
          <div className="inner_form">
            <div className="form_group">
              <div className="text_details">
                <h3>
                  Account Verification <span className="yellow"> Pending</span>
                </h3>
                <small className="">
                  You will be notified when your account is ready and confirmed
                </small>
              </div>
              <div className="btn l_flex">
                <button
                  type="submit"
                  className="main_btn"
                  onClick={handlePendingSubmit}
                >
                  Go back home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default PendingAccountDropDownMenu;
