export interface ShortedCandidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  role: string;
  image: string;
  region: string;
  slug: string;
}

export interface CombinedItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  pollOverview: string;
  poll: string;
  views: number;

  createdAt: string;
  updatedAt: string;

  // Specific to Bill
  banner?: string;
  image?: string;
  sortType?: string[];
  sortStatus?: string[];
  sortCategory?: string[];
  sortState?: string[];
  startDate?: string;
  expirationDate?: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    stateOfOrigin: string;
    stateOfResidence: string;
    role: string;
    image: string;
    region: string;
  };

  candidates: ShortedCandidate[];

  comments?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    comment: string;
    user: string;
    likes: string[];
    dislikes: string[];
    replies?: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      image: string;
      comment: string;
      user: string;
      likes: string[];
      dislikes: string[];
      createdAt: Date;
      updatedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }[];
  yeaVotes?: {
    _id: string;
    voterId: string;
    candidateId: string;
    createdAt: Date;
  }[];
  nayVotes?: {
    _id: string;
    voterId: string;
    candidateId: string;
    createdAt: Date;
  }[];
  totalYeaVotes?: number;
  totalNayVotes?: number;
  totalComments?: number;
  yeaPercentage?: number;
  nayPercentage?: number;

  // Specific to Election

  status?: string;
  likes?: string[];
  dislikes?: string[];
  votes?: {
    _id: string;
    voterId: string;
    candidateId: string;
    createdAt: Date;
  }[];
  progress?: number;
  totalVotes?: number;
}

export interface GeneralState {
  items: CombinedItem[];
  loading: boolean;
  error?: string;
}

export type GeneralAction =
  | { type: "FETCH_ITEMS_REQUEST" }
  | { type: "FETCH_ITEMS_SUCCESS"; payload: CombinedItem[] }
  | { type: "FETCH_ITEMS_FAILURE"; payload: string };

// Initial State
export const generalInitialState: GeneralState = {
  items: [], // Start with an empty array of items
  loading: false, // Initially not loading
  error: undefined, // No errors initially
};
