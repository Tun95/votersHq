import "./styles.scss";
import { Drawer } from "antd";

import { useAppContext } from "../../utilities/utils/Utils";

import RegisterDropDownMenu from "../../components/form/register/Register";
import OtpVerificationDropDownMenu from "../../components/form/otp/Otp";
import CreatedAccountDropDownMenu from "../../components/form/created/Created";
import PendingAccountDropDownMenu from "../../components/form/pending/Pending";
import LoginDropDownMenu from "../../components/form/login/Login";

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
