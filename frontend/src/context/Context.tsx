import { createContext, useReducer, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export type MenuType =
  | "register"
  | "otp"
  | "verifyKyc"
  | "submitKyc"
  | "created"
  | "pending"
  | "login";

export interface ContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
  open: boolean;
  showDrawer: () => void;
  onClose: () => void;
  currentMenu: MenuType;
  setMenu: (menu: MenuType) => void;
}

// Define a type for userInfo, accommodating all fields
export interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isAccountVerified: boolean;
  token: string;
}

// Define types for the initial state and actions
interface State {
  loading: boolean;
  error: string;
  query: string;
  userInfo: UserInfo | null;
  tokenExpiration: number | null;
}

interface Action {
  type: "USER_SIGNIN" | "USER_SIGNOUT" | "SET_QUERY" | "CLEAR_QUERY";
  payload?: UserInfo | string;
}

export const Context = createContext<ContextProps | undefined>(undefined);

// INITIAL STATE
const initialState: State = {
  loading: true,
  error: "",
  query: localStorage.getItem("searchQuery") || "",
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null,
  tokenExpiration: localStorage.getItem("userInfo")
    ? jwtDecode<{ exp: number }>(
        JSON.parse(localStorage.getItem("userInfo")!).token
      ).exp
    : null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "USER_SIGNIN": {
      if (typeof action.payload === "object" && action.payload.token) {
        const decodedToken = jwtDecode<{ exp: number }>(action.payload.token);
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
        return {
          ...state,
          userInfo: action.payload,
          tokenExpiration: decodedToken.exp,
        };
      }
      return state;
    }

    case "USER_SIGNOUT":
      localStorage.removeItem("userInfo");
      localStorage.removeItem("searchQuery");
      return {
        ...state,
        userInfo: null,
        tokenExpiration: null,
        query: "",
      };

    case "SET_QUERY":
      if (typeof action.payload === "string") {
        localStorage.setItem("searchQuery", action.payload); // Store search query in localStorage
        return {
          ...state,
          query: action.payload,
        };
      }
      return state;

    case "CLEAR_QUERY":
      localStorage.removeItem("searchQuery"); // Remove search query from localStorage
      return {
        ...state,
        query: "",
      };

    default:
      return state;
  }
}

interface ContextProviderProps {
  children: React.ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // Check token expiration on initial load
  useEffect(() => {
    const checkTokenExpirationOnLoad = () => {
      if (state.tokenExpiration) {
        const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
        if (currentTime >= state.tokenExpiration) {
          toast.error("Token expired, please login again"); // Show toast message
          dispatch({ type: "USER_SIGNOUT" });
          navigate("/"); // Navigate to login screen
        }
      }
    };

    checkTokenExpirationOnLoad();
  }, [state.tokenExpiration, navigate]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (state.tokenExpiration) {
        const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
        if (currentTime >= state.tokenExpiration) {
          toast.error("Token expired, please login again"); // Show toast message
          dispatch({ type: "USER_SIGNOUT" });
          navigate("/"); // Navigate to login screen
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000 * 60); // Check every minute
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [state.tokenExpiration, navigate]);

  //USER

  //ANTD MENU
  const [open, setOpen] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<MenuType>("register");

  const showDrawer = () => {
    console.log("Drawer is opening");
    setOpen(true);
  };

  const onClose = () => {
    console.log("Drawer is closing");
    setOpen(false);
  };

  const setMenu = (menu: MenuType) => {
    console.log(`Switching to menu: ${menu}`);
    setCurrentMenu(menu);
  };

  const value: ContextProps = {
    state,
    dispatch,
    open,
    showDrawer,
    onClose,
    currentMenu,
    setMenu,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
