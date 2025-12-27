import { AccountModel } from './types/account.domain'
import { AccountResponseDto } from './types/account.dto'

export const toAccountResponseDto = (account: AccountModel): AccountResponseDto => {
  return {
    ...account,
    created_at: account.created_at.toISOString(),
    updated_at: account.updated_at.toISOString(),
  };
};
