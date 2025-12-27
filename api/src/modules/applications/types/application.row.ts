export type ApplicationRow = {
  id: bigint;
  name: string;
  account_id: bigint;
  created_at: Date;
  updated_at: Date;
};

export type ApplicationApiKeyRow = {
  id: bigint;
  application_id: bigint;
  public_key: string;
  secret_hash: string;
  status: 'active' | 'inactive';
  account_id: bigint;
  created_at: Date;
  updated_at: Date;
};
