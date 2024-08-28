import { Election } from "../types";

//======
// TYPES
//=======

export interface Candidate {
  totalVotes: number;
  candidate: {
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
    timeline: Array<{
      timelineYear: number;
      timelineTitle: string;
      timelineDetails: string;
      _id: string;
      createdAt: string;
      updatedAt: string;
    }>;
    user: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    __v: number;
  };
  votePercentage: number;
}

export interface AgeRange {
  ageRange: string;
  percentage: number;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ElectionViewScreenState {
  loading: boolean;
  election: Election | null;
  totalVotes: number;
  maleVotes: number;
  femaleVotes: number;
  leaderboardTop5: Candidate[];
  leaderboardTop3: Candidate[];
  ageRangeDistribution: AgeRange[];
  error: string;
  countdown: Countdown;
}

export type ElectionViewAction =
  | { type: "FETCH_REQUEST" }
  | {
      type: "FETCH_SUCCESS";
      payload: {
        election: Election;
        totalVotes: number;
        maleVotes: number;
        femaleVotes: number;
        leaderboardTop5: Candidate[];
        leaderboardTop3: Candidate[];
        ageRangeDistribution: AgeRange[];
      };
    }
  | { type: "FETCH_FAIL"; payload: string }
  | { type: "UPDATE_COUNTDOWN"; payload: Countdown };

export interface ElectionResponse {
  election: Election;
  totalVotes: number;
  maleVotes: number;
  femaleVotes: number;
  leaderboardTop5: Candidate[];
  leaderboardTop3: Candidate[];
  ageRangeDistribution: AgeRange[];
  fetchElection: () => Promise<void>;
}
