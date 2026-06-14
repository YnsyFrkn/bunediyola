export type PollOptionResult = {
  id: string;
  text: string;
  voteCount: number;
  percentage: number;
};

export type PollVoteState = {
  selectedOptionId: string | null;
  totalVotes: number;
  options: PollOptionResult[];
  message?: string;
};
