import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import v2 from "../../../assets/others/v2.png";
import "../styles.scss";

interface CreatedAccountDropDownMenuProps {
  onClose: () => void;
  setMenu: (menu: "register" | "otp" |"kyc"| "created" | "pending" | "login") => void;
}
function CreatedAccountDropDownMenu({
  onClose,
  setMenu,
}: CreatedAccountDropDownMenuProps) {
  const handleCreatedSubmit = () => {
    setMenu("login");
  };
  return (
    <Box className="menu_modal otp_menu created_account_menu">
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
            <img src={v2} alt="created account" />
          </div>
        </div>
        <div className="form_box">
          <div className="inner_form">
            <div className="form_group">
              <div className="text_details">
                <h3>
                  VotersHQ Access <span className="green"> Secured</span>
                </h3>
                <small className="">
                  Your account has been created successfully, you can now log in
                  to your new account and enjoy!!!
                </small>
              </div>
              <div className="btn l_flex">
                <button
                  onClick={handleCreatedSubmit}
                  type="submit"
                  className="main_btn"
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default CreatedAccountDropDownMenu;
