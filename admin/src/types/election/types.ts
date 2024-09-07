export interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  title: string;
  image: string;
  age: number;
  contestingFor: string;
  partyName: string;
  partyImage: string;
  runningMateName: string;
  runningMateTitle: string;
  runningMateImage: string;
  banner: string;
  biography: string;
  manifesto: string;
  timeline: TimelineEntry[];
  user: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  id: string;
}

export interface TimelineEntry {
  timelineYear: number;
  timelineTitle: string;
  timelineDetails: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentType {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  role: string;
  commentContent: string;
  user: string;
  likes: string[];
  dislikes: string[];
  _id: string;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  role: string;
  replyContent: string;
  user: string;
  likes: string[];
  dislikes: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Election {
  _id: string;
  title: string;
  image: string;
  banner: string;
  pollOverview: string;
  candidates: string[] | Candidate[];
  sortType: string[];
  sortStatus: string[];
  sortCategory: string[];
  status: string;
  views: number;
  likes: string[];
  dislikes: string[];
  startDate?: string;
  expirationDate: string;
  user: string;
  votes: Vote[];
  comments: CommentType[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  totalVotes: number;
  progress: number;
}

export interface Vote {
  voterId: string;
  candidateId: string;
  _id: string;
  createdAt: string;
}

export interface ElectionState {
  ongoing: Election[];
  upcoming: Election[];
  concluded: Election[];
  loading: boolean;
  error: string;
}

export type ElectionAction =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: ElectionState }
  | { type: "FETCH_FAIL"; payload: string };

// types.ts
export interface FilterParams {
  searchQuery?: string;
  sortType?: string;
  sortStatus?: string;
  sortCategory?: string;
  sortOrder?: string;
}

//VOTE
// Action types
export type VoteAction =
  | { type: "START_VOTING"; payload: string }
  | { type: "VOTE_SUCCESS"; payload: string }
  | { type: "VOTE_FAILURE"; payload: { candidateId: string; error: string } }
  | { type: "SET_LOADING"; payload: { candidateId: string; loading: boolean } }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: boolean };

// Initial state
export const initialVoteState: VoteState = {
  loading: {},
  error: null,
  success: false,
};

// State interface
export interface VoteState {
  loading: { [candidateId: string]: boolean };
  error: string | null;
  success: boolean;
}
