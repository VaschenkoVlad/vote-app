export type Poll = {
  id: number;
  title: string;
  votes: Vote[];
  options: string[];
  created_at: string;
};

export type Vote = {
  id: number;
  poll_id: number;
  option: string;
};
