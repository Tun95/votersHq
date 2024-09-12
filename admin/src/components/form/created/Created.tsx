import Box from "@mui/material/Box";
import v2 from "../../../assets/others/v2.png";
import "../styles.scss";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../utilities/utils/Utils";
import { useEffect } from "react";

function CreatedAccountComponent() {
  const navigate = useNavigate();
  const { state: appState } = useAppContext();
  const { userInfo } = appState;
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <Box className="menu_modal otp_menu created_account_menu">
      <div className="otp_created_pending_login light_shadow header_box">
        <div className="img_width l_flex">
          {" "}
          <div className="img l_flex">
            <img src={v2} alt="created account" />
          </div>
        </div>
        <div className="form_box">
          <div className="inner_form">
            <div className="form_group">
              <div className="text_details l_flex">
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
                  onClick={() => navigate("/login")}
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

export default CreatedAccountComponent;
