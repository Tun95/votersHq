import "./styles.scss";
import React from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import logo from "../../assets/logo/logo.png";
import { useAppContext } from "../../utilities/utils/Utils";

type Anchor = "left" | "right";

function Sidebar() {
  //MUI DRAWER
  const [state, setState] = React.useState({
    left: false,
    right: false,
  });
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  //ANTD DRAWER
  const {
    state: cState,
    dispatch: ctxDispatch,
    showDrawer,
    setMenu,
  } = useAppContext();
  const { userInfo } = cState;

  //Login Menu
  const navigateToLogin = () => {
    setMenu("created");
    showDrawer();
    setState({ ...state, left: false, right: false });
  };

  //Register Menu
  const navigateToRegister = () => {
    setMenu("register");
    showDrawer();
    setState({ ...state, left: false, right: false });
  };

  //========
  //SIGN OUT
  //========
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  return (
    <div>
      {["left"].map((anchor, index) => (
        <React.Fragment key={index}>
          <MenuIcon
            onClick={toggleDrawer(anchor as Anchor, true)}
            className="menu_icon"
          />
          <Drawer
            anchor={anchor as Anchor}
            open={state[anchor as Anchor]}
            onClose={toggleDrawer(anchor as Anchor, false)}
            className="side_bar_drawer"
            // sx={{ zIndex: 1600 }}
            PaperProps={{
              sx: {
                backgroundColor: "var(--color-primary)",
              },
            }}
          >
            <div className="main">
              <span className="toggle_width">
                <span className="logo_span d_flex">
                  <div className="logo_text a_flex">
                    <img src={logo} alt="logo" className="logo" />
                    <h2>votersHQ</h2>
                  </div>
                  <CloseIcon
                    className="icon"
                    onClick={toggleDrawer(anchor as Anchor, false)}
                  />
                </span>
              </span>
              <div className="list_info">
                <ul>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor as Anchor, false)}
                      to="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor as Anchor, false)}
                      to="/bills"
                    >
                      Bills
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor as Anchor, false)}
                      to="/elections"
                    >
                      E-Elections
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor as Anchor, false)}
                      to="/about"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor as Anchor, false)}
                      to="/news"
                    >
                      News
                    </Link>
                  </li>
                </ul>
                {userInfo && (
                  <span>
                    <Divider className="white" />
                    <Divider className="white" />
                    <ul className="list user_list">
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
                        <span
                          onClick={signoutHandler}
                          className="a_flex btn cursor"
                        >
                          {" "}
                          <LogoutOutlinedIcon className="icon" />
                          <span> Log out</span>
                        </span>
                      </li>
                    </ul>
                  </span>
                )}
              </div>
              {!userInfo && (
                <div className="login_register f_flex">
                  <div className="register">
                    <button className="main_btn" onClick={navigateToRegister}>
                      Register
                    </button>
                  </div>
                  <div className="login">
                    <button className="main_btn" onClick={navigateToLogin}>
                      Log In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Sidebar;
