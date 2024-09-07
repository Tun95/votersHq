import { CommentType } from "../../election/types";

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

export type Bill = {
  _id: string;
  title: string;
  slug: string;
  banner: string;
  image: string;
  description: string;
  sortType: string[];
  sortStatus: string[];
  sortCategory: string[];
  sortState: string[];
  views: number;
  expirationDate: string;
  user: User;
  candidates: ShortedCandidate[];
  comments: CommentType[];
  yeaVotes: Vote[];
  nayVotes: Vote[];
  createdAt: string;
  updatedAt: string;
  totalVotes: number;
  totalYeaVotes: number;
  totalNayVotes: number;
  yeaPercentage: number;
  nayPercentage: number;
  regionalVotes: RegionalVote[];
};

export type User = {
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

export type Vote = {
  voterId: string;
  region: string;
  _id: string;
  createdAt: string;
};

export type RegionalVote = {
  region: string;
  totalVotes: number;
  percentageVotes: number;
};

export type BillsDetailsState = {
  loading: boolean;
  error: string | null;
  bill: Bill | null;
};

export type BillsDetailsAction =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: Bill }
  | { type: "FETCH_FAIL"; payload: string };

// Initial State
export const billsDetailsInitialState: BillsDetailsState = {
  loading: false,
  error: null,
  bill: null,
};

export interface BillsResponse {
  bill: Bill | null;
  fetchBill: (slug: string, triggerLoading?: boolean) => Promise<void>;
}

