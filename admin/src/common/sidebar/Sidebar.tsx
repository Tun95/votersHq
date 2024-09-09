import "./styles.scss";
import React from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import logo from "../../assets/logo/logo.png";
import { useAppContext } from "../../utilities/utils/Utils";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";

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
  const { state: cState, dispatch: ctxDispatch } = useAppContext();
  const { userInfo } = cState;

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
            sx={{ zIndex: 1600 }}
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
                      className="a_flex"
                    >
                      <HomeOutlinedIcon className="icon" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor as Anchor, false)}
                      to="/users"
                      className="a_flex"
                    >
                      <PeopleAltOutlinedIcon className="icon" />
                      <span>Users</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor as Anchor, false)}
                      to="/bills"
                      className="a_flex"
                    >
                      <ReceiptOutlinedIcon className="icon" />
                      <span>Bills</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggleDrawer(anchor as Anchor, false)}
                      to="/elections"
                      className="a_flex"
                    >
                      <HowToVoteOutlinedIcon className="icon" />
                      <span>Elections</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      onClick={toggleDrawer(anchor as Anchor, false)}
                      to="/news"
                      className="a_flex"
                    >
                      <NewspaperOutlinedIcon className="a_flex" />
                      <span> Political News</span>
                    </Link>
                  </li>
                </ul>
                {userInfo && (
                  <span>
                    <Divider className="white" />
                    <ul className="list user_list">
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
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Sidebar;
