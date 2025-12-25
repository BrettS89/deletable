export type ApplicationResponseDto = {
  id: bigint;
  name: string;
  account_id: bigint;
  created_at: string;
  updated_at: string;
};

export type CreateApplicationDto = {
  name: string;
};
