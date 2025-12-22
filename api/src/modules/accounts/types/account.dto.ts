export type AccountResponseDto = {
  id: bigint;
  name: string;
  created_at: string;
  updated_at: string;
};

export type CreateAccountDto = {
  name: string;
};
