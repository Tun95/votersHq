export interface TimelineItem {
  timelineYear: number;
  timelineTitle: string;
  timelineDetails: string;
}

export enum UserRole {
  USER = "user",
  POLITICIAN = "politician",
}

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
  role: UserRole; // Changed to UserRole enum
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
  image: string; // Added field
}


export interface userState {
  loading: boolean;
  error: string;
  user?: User;
  loadingUpdate?: boolean;
  errorUpdate?: string;
  loadingUpload?: boolean;
  errorUpload?: string;
}

export interface userAction {
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

export const initialState: userState = {
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
    age?: number;
    gender?: string;
    image?: string;
    ninNumber?: number;
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
  | { type: "FOLLOW"; payload: string }
  | { type: "UNFOLLOW"; payload: string }
  | { type: "FOLLOW_SUCCESS"; payload: string }
  | { type: "UNFOLLOW_SUCCESS"; payload: string }
  | { type: "UPGRADE"; payload: string } // payload is the user ID to be upgraded
  | { type: "UPGRADE_SUCCESS"; payload: User } // payload is the upgraded user object
  | { type: "ERROR"; payload: string };

// Initial State
export interface FollowState {
  followers: string[];
  user: User | null;
  error: string | null;
  loading: boolean;
  loadingUpgrade: boolean; // Separate loading state for upgrading account
}
