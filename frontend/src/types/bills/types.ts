// Types for user information related to a bill
export interface ShortedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  role: string;
  image: string;
  region: string;
}

// Types for comments on a bill
export interface Comment {
  _id: string;
  userId: string;
  content: string;
  createdAt: string;
}

// Types for yea/nay votes on a bill
export interface Vote {
  voterId: string;
  _id: string;
  createdAt: string;
}

// Updated Bill interface
export interface Bill {
  _id: string;
  title: string;
  slug: string;
  banner: string;
  description: string;
  sortType: string[];
  sortStatus: string[];
  sortCategory: string[];
  sortState: string[];
  views: number;
  expirationDate: string;
  user: ShortedUser;
  comments: Comment[];
  yeaVotes: Vote[];
  nayVotes: Vote[];
  totalYeaVotes: number;
  totalNayVotes: number;
  totalComments: number;
  yeaPercentage: number;
  nayPercentage: number;
  createdAt: string;
  updatedAt: string;
  image: string;
}

// State for managing the list of bills
export interface BillsState {
  bills: Bill[];
  loading: boolean;
  error: string;
  page: number;
  pages: number;
  countBills: number;
}

// Action types for fetching bills
export interface BillsAction {
  type: "FETCH_REQUEST" | "FETCH_SUCCESS" | "FETCH_FAIL";
  payload?: {
    bills?: Bill[];
    page?: number;
    pages?: number;
    countBills?: number;
    error?: string;
  };
}

// Filters for fetching bills
export interface BillsFilterParams {
  searchQuery?: string;
  sortType?: string;
  sortStatus?: string;
  sortCategory?: string;
  sortState?: string;
  sortOrder?: string;
  page?: number;
}

// Props for the BillsCard component
export interface BillsCardProps {
  bill: Bill;
}
