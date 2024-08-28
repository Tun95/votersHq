export interface TimelineItem {
  timelineYear: number;
  timelineTitle: string;
  timelineDetails: string;
}

// Define types for the user and state
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  about: string;
  background: string;
  education: string;
  achievement: string;
  identificationType: string;
  ninNumber: number;
  stateOfOrigin: string;
  stateOfResidence: string;
  role: string;
  emailNotification: boolean;
  smsNotification: boolean;
  twoStepVerification: boolean;
  isBlocked: boolean;
  isAdmin: boolean;
  password: string;
  isAccountVerified: boolean;
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  timeline: TimelineItem[]; // Use specific type
  createdAt: string;
  updatedAt: string;
  image: string; // Add the image field here
}

export interface State {
  loading: boolean;
  error: string;
  user?: User;
  loadingUpdate?: boolean;
  errorUpdate?: string;
  loadingUpload?: boolean;
  errorUpload?: string;
}

export interface Action {
  type:
    | "FETCH_REQUEST"
    | "FETCH_SUCCESS"
    | "FETCH_FAIL"
    | "CREATE_REQUEST"
    | "CREATE_SUCCESS"
    | "CREATE_FAIL"
    | "UPDATE_REQUEST"
    | "UPDATE_SUCCESS"
    | "UPDATE_FAIL"
    | "UPLOAD_REQUEST"
    | "UPLOAD_SUCCESS"
    | "UPLOAD_FAIL";
  payload?: User | string; // Adjusted to include user and string types
}

export const initialState: State = {
  loading: true,
  error: "",
  loadingUpdate: false,
  loadingUpload: false,
};

// PROFILE UPDATE
export interface SubmitHandlerParams {
  e?: React.FormEvent;
  updatedEducation?: string;
  updatedAchievement?: string;
  updatedAbout?: string;
  updatedPersonalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    image?: string;
    ninNumber?: string;
    stateOfOrigin?: string;
    stateOfResidence?: string;
  };
}

//REGULARS
export interface TabMainPanelProps {
  user: User;
  loadingUpdate: boolean;
  submitHandler: ({
    e,
    updatedEducation,
    updatedAchievement,
  }: SubmitHandlerParams) => Promise<void>;
}

//ACTIVITIES

// Define the types for your state and actions
export interface Activity {
  _id: string;
  activityType: string;
  activityDetails: string;
  relatedId: string;
  relatedModel: string;
  timestamp: string;
  createdAt: string;
}

export interface ActivityState {
  loading: boolean;
  error: string | null;
  activities: Activity[];
}

export type ActivityAction =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: Activity[] }
  | { type: "FETCH_FAIL"; error: string };

// Initial state for the reducer
export const activityInitialState: ActivityState = {
  loading: false,
  error: null,
  activities: [],
};

//FOLLOW AND UNFOLLOW
// Action Types
export type ActionType =
  | { type: "FOLLOW"; payload: string } // payload is the followed user's ID
  | { type: "UNFOLLOW"; payload: string } // payload is the unfollowed user's ID
  | { type: "FOLLOW_SUCCESS"; payload: string }
  | { type: "UNFOLLOW_SUCCESS"; payload: string }
  | { type: "ERROR"; payload: string };

// Initial State
export interface FollowState {
  following: string[]; // Array of user IDs that the current user is following
  error: string | null;
  loading: boolean;
}

