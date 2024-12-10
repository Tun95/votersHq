// POLITICAL NEWS TYPES
export type PoliticalSlideItem = {
  title: string;
  slug?: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export interface PoliticalNewsCardsProps {
  item: PoliticalSlideItem;
  index: number;
}

export interface State {
  loading: boolean;
  error: string;
  politicalNews?: PoliticalSlideItem[]; // Change this to an array
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
  payload?: PoliticalSlideItem[] | string; // Allow the payload to be an array
}
export const initialState: State = {
  loading: true,
  error: "",
  loadingUpdate: false,
  loadingUpload: false,
};

//NEWS LIST
export interface PoliticalNews {
  id: string;
  title: string;
  slug?: string;
  image: string;
  user: User;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPoliticalNews {
  politicalNews: PoliticalNews[];
  page: number;
  pages: number;
  totalPages: number;
}

export interface NewsState {
  loading: boolean;
  error: string;
  politicalNews: PoliticalNews[];
  page: number;
  pages: number;
  totalPages: number;
}

export type NewsAction =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: PaginatedPoliticalNews }
  | { type: "FETCH_FAIL"; payload: string };

export interface PoliticalCardsProps {
  item: {
    id: string;
    title: string;
    slug?: string;
    image: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  index: number;
}

//NEWS DETAILS
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface NewsDetailsState {
  loading: boolean;
  error: string | null;
  news: PoliticalNews | null;
}

export type NewsDetailsAction =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: PoliticalNews }
  | { type: "FETCH_FAIL"; payload: string };

export const newsDetailsInitialState: NewsDetailsState = {
  loading: false,
  error: null,
  news: null,
};
