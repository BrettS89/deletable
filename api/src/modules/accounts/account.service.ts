import { Pool } from 'pg';
import { TABLES } from '../../storage/db/postgres/tables';
import { CreateAccountDto } from './types/account.dto';
import { PostgresCrud } from '../../storage/db/postgres/crud';
import { AccountRow } from './types/account.row';
import { AccountModel } from './types/account.domain';

export class AccountService {
  constructor(private db: Pool) {}

  async createAccount(data: CreateAccountDto): Promise<AccountModel> {
    const pgCrud = new PostgresCrud(this.db, TABLES.ACCOUNTS);
    return pgCrud.create<AccountRow>(data);
  }
}
