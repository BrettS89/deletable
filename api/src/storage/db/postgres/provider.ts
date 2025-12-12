import { Pool } from 'pg';
import { IDb, ITable } from '../types';
import { BaseQueryObject } from '../../../utils/query/schema';
import { postgres } from './db';
import { generateSqlAndParams } from '../../../utils/query';

class PostgresTable implements ITable {
  readonly name: string;

  constructor(tableName: string) {
    this.name = tableName
  }

  pool(): Pool {
    return postgres.pool;
  }

  async getById<T>(id: number | string): Promise<T | null> {
    const sql = `SELECT * FROM ${this.name} WHERE id = $1`;

    const res = await postgres.pool.query(sql, [id]);

    return res.rows[0] as T ?? null;
  }

  async find<T>(query?: BaseQueryObject & Record<string, any>): Promise<T[]> {
    const { sql, values } = generateSqlAndParams({
      sqlString: `SELECT * FROM ${this.name}`,
      filter: query ?? {},
    })

    const res = await postgres.pool.query(sql, values);

    return res.rows as T[];
  }

  async create<T>(data: Record<string, any>): Promise<T> {
    const keys: string[] = [];
    const nums: string[] = []
    const values: any[] = [];

    Object.entries(data).forEach(([k, v], i) => {
      keys.push(k);
      nums.push(`$${i + 1}`);
      values.push(v);
    });

    const sql = `INSERT INTO ${this.name} (${keys.join(', ')}) VALUES(${nums.join(', ')}) RETURNING *`;

    const res = await postgres.pool.query(sql, values);

    return res.rows[0] as T;
  }

  async findByIdAndUpdate<T>(id: number | string, data: Record<string, any>): Promise<T | null> {
    const keys: string[] = [];
    const values: any[] = []; 

    Object.entries(data).forEach(([k, v], i) => {
      keys.push(`${k} = $${i + 1}`);
      values.push(v);
    });

    values.push(id);

    const sql = `UPDATE ${this.name} SET ${keys.join(', ')} WHERE id = $${keys.length + 1} RETURNING *`;

    const res = await postgres.pool.query(sql, values);

    return res.rows[0] as T ?? null;
  }

  async remove<T>(id: number | string): Promise<T | null> {
    const sql = `DELETE FROM ${this.name} WHERE id = $1 RETURNING *`;

    const res = await postgres.pool.query(sql, [id]);

    return res.rows[0] as T ?? null;
  }
}

export class PostgresProvider implements IDb {
  table(name: string) {
    return new PostgresTable(name)
  }

}
