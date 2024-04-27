import {migrate} from 'drizzle-orm/better-sqlite3/migrator';
import { DB } from './_db';

function main () {
  // This will run migrations on the database, skipping the ones already applied
  migrate(DB, { migrationsFolder: '.migrations' });
  console.log('migration done');
}

main();