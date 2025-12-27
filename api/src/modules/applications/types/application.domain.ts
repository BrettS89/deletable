export type Application = {
  id: bigint;
  name: string;
  account_id: bigint;
  created_at: Date;
  updated_at: Date;
};

export type ApplicationApiKey = {
  id: bigint;
  application_id: bigint;
  public_key: string;
  secret_hash: string;
  secret_key?: string;
  status: 'active' | 'inactive';
  account_id: bigint;
  created_at: Date;
  updated_at: Date;
}

export type ApplicationWithApiKey = Application & { api_key: ApplicationApiKey }
