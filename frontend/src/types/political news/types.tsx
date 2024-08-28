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