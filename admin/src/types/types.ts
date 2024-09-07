// types.ts

//POST
export type Comment = {
  name: string;
  createdAt: string;
  comment: string;
};

export type Candidate = {
  name: string;
  image: string;
  location: string;
};

export type SlideItem = {
  title: string;
  slug?: string;
  image: string;
  status: string;
  vote_count: number;
  vote_percentage: number;
  description: string;
  comments: Comment[];
  createdAt: string;
  down_vote_count: number;
  up_vote_count: number;
  down_vote_perc: number;
  up_vote_perc: number;
  candidate?: Candidate;
  tags?: string[];
};

export interface FeaturedCardProps {
  item: SlideItem;
  index: number;
}

export interface PostCardProps {
  post: SlideItem;
  index: number;
}
export interface BillsCardProps {
  post: SlideItem;
  index: number;
}



//SIDE BAR
export type Anchor = "left" | "right";


