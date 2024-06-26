import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');

export const DB: BetterSQLite3Database = drizzle(sqlite);