import { IDb } from './types';
import { PostgresProvider } from './postgres/provider';

export const dbProvider: IDb = new PostgresProvider();
