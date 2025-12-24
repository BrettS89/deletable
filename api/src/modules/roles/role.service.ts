import { Pool } from 'pg';
import { TABLES } from '../../storage/db/postgres/tables';
import { CreateRoleDto } from './types/role.dto';
import { PostgresCrud } from '../../storage/db/postgres/crud';
import { RoleRow } from './types/role.row';
import { RoleModel } from './types/role.domain';

export class RoleService {
  constructor(private db: Pool) {}

  async createRole(data: CreateRoleDto): Promise<RoleModel> {
    const pgCrud = new PostgresCrud(this.db, TABLES.ROLES);
    return pgCrud.create<RoleRow>(data);
  }
}
