// Define types for the state and action
export interface UserList {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  role: string;
  isPoliticianRequest: string;
  isAccountVerified: boolean;
  isBlocked: boolean;
  isAdmin: boolean;
  // Add other user fields as needed
}

export interface userState {
  loading: boolean;
  users: UserList[];
  error: string;
}

export type userAction =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: { users: UserList[] } }
  | { type: "FETCH_FAIL"; payload: string };

// Define the initial state
export const initialUserListState: userState = {
  loading: true,
  users: [],
  error: "",
};

export const userReducer = (
  state: userState,
  action: userAction
): userState => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload.users };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// LIST SCREEN
export interface ListStateType {
  loading: boolean;
  error: string;
  users: UserList[];
  loadingBlock?: boolean;
  successBlock?: boolean;
  loadingUnBlock?: boolean;
  successUnBlock?: boolean;
  loadingDelete?: boolean;
  successDelete?: boolean;
}

export type ListActionType =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: UserList[] }
  | { type: "FETCH_FAIL"; payload: string }
  | { type: "BLOCK_REQUEST" }
  | { type: "BLOCK_SUCCESS" }
  | { type: "BLOCK_FAIL" }
  | { type: "BLOCK_RESET" }
  | { type: "UNBLOCK_REQUEST" }
  | { type: "UNBLOCK_SUCCESS" }
  | { type: "UNBLOCK_FAIL" }
  | { type: "UNBLOCK_RESET" }
  | { type: "DELETE_REQUEST" }
  | { type: "DELETE_SUCCESS" }
  | { type: "DELETE_FAIL" }
  | { type: "DELETE_RESET" };
