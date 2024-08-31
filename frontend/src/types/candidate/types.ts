// Candidate Type
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
  about: string;
  education: string;
  achievement: string;
  manifesto: string;
  timeline: {
    timelineYear: number;
    timelineTitle: string;
    timelineDetails: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  }[];
  user: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  id: string;
}

// State Type
export interface candidateState {
  loading: boolean;
  error: string;
  candidate?: Candidate;
}

// Action Type
export type candidateAction =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: Candidate }
  | { type: "FETCH_FAIL"; payload: string };

// Initial State
export const candidateInitialState: candidateState = {
  loading: false,
  error: "",
  candidate: undefined,
};

export interface CandidateProps {
  candidate?: Candidate;
}
