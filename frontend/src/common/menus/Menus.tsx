import "./styles.scss";
import { Drawer } from "antd";

import { useAppContext } from "../../utilities/utils/Utils";

import RegisterDropDownMenu from "../../components/form/register/Register";
import OtpVerificationDropDownMenu from "../../components/form/otp/Otp";
import CreatedAccountDropDownMenu from "../../components/form/created/Created";
import PendingAccountDropDownMenu from "../../components/form/pending/Pending";
import LoginDropDownMenu from "../../components/form/login/Login";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { Box, Divider } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import p1 from "../../assets/nav/p.png";
import { Link } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

export function AuthFlowMenu() {
  const { open, onClose, currentMenu, setMenu } = useAppContext();

  const renderMenu = () => {
    switch (currentMenu) {
      case "register":
        return <RegisterDropDownMenu onClose={onClose} setMenu={setMenu} />;
      case "otp":
        return (
          <OtpVerificationDropDownMenu onClose={onClose} setMenu={setMenu} />
        );
      case "created":
        return (
          <CreatedAccountDropDownMenu onClose={onClose} setMenu={setMenu} />
        );
      case "pending":
        return (
          <PendingAccountDropDownMenu onClose={onClose} setMenu={setMenu} />
        );
      case "login":
        return <LoginDropDownMenu onClose={onClose} setMenu={setMenu} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Drawer
        placement="right"
        closable={true}
        onClose={onClose}
        width={window.innerWidth < 900 ? "100%" : "auto"}
        open={open}
        zIndex={900}
        rootClassName="antd_drawer"
      >
        {renderMenu()}
      </Drawer>
    </div>
  );
}

export function UserDropDownMenu() {
  //CONTACT MENU
  const [anchorEle, setAnchorEle] = useState<null | HTMLElement>(null);
  const openInfo = Boolean(anchorEle);

  const handleClickNav = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEle(event.currentTarget);
  };

  const handleCloseNav = () => {
    setAnchorEle(null);
  };

  const { state, dispatch: ctxDispatch } = useAppContext();
  const { userInfo } = state;

  //========
  //SIGN OUT
  //========
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };
  return (
    <React.Fragment>
      <Box>
        <Tooltip title="Open Menu">
          <IconButton
            onClick={handleClickNav}
            disableRipple
            size="small"
            className="icon-button"
            aria-controls={openInfo ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openInfo ? "true" : undefined}
          >
            <span
              // to={`/profile-dashboard/${userInfo._id}`}
              className="user_img_icon a_flex"
            >
              <div className="img">
                <img src={userInfo ? userInfo?.image : p1} alt="user image" />
              </div>
              <div className="down_icon">
                <KeyboardArrowDownOutlinedIcon className="icon" />
              </div>
            </span>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEle}
        id="account-menu"
        className="user_drop_menu"
        open={openInfo}
        onClose={handleCloseNav}
        disableScrollLock={true}
        // sx={}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "10px",
            overflow: "visible",
            zIndex: 2501,
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,

            ml: 2.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 28,
              width: 15,
              height: 15,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="menu_content">
          <ul className="list">
            <li>
              <Link
                to={`/profile-dashboard/${userInfo?._id}`}
                className="a_flex btn"
              >
                {" "}
                <AccountCircleOutlinedIcon className="icon" />
                <span> Profile</span>
              </Link>
            </li>{" "}
            <Divider />
            <li>
              <span onClick={signoutHandler} className="a_flex btn">
                {" "}
                <LogoutOutlinedIcon className="icon" />
                <span> Profile</span>
              </span>
            </li>
          </ul>
        </div>
      </Menu>
    </React.Fragment>
  );
}
