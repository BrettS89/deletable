import { Pool } from 'pg';

export interface ITable {
  readonly name: string

  getById<T>(id: string | number): Promise<T | null>
  find<T>(query?: any): Promise<T[]>
  create<T>(data: Record<string, any>): Promise<T>
  findByIdAndUpdate<T>(id: string | number, data: Record<string, any>): Promise<T | null>
  remove<T>(id: string | number): Promise<T | null>
  pool?(): Pool;
}

export interface IDb {
  table(name: string): ITable
}
