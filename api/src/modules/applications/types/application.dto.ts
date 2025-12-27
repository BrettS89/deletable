export type ApplicationResponseDto = {
  id: bigint;
  name: string;
  account_id: bigint;
  created_at: string;
  updated_at: string;
}

export type ApplicationApiKeyResponseDto = {
  id: bigint;
  application_id: bigint;
  public_key: string;
  secret_Key?: string;
  status: 'active' | 'inactive';
  account_id: bigint;
  created_at: string;
  updated_at: string;
}

export type CreateApplicationDto = {
  name: string;
}
