import initSqlJs from 'sql.js';
import { Pool } from 'pg';

// Check if we're in production (Render.com) or development (local)
const isProduction = process.env.NODE_ENV === 'production';

let query: (sql: string, params?: any[]) => Promise<any>;
let run: (sql: string, params?: any[]) => Promise<void>;
let get: (sql: string, params?: any[]) => Promise<any>;

if (isProduction) {
  // PostgreSQL for production (Render.com)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  query = async (sql: string, params: any[] = []) => {
    const result = await pool.query(sql, params);
    return result.rows;
  };

  run = async (sql: string, params: any[] = []) => {
    await pool.query(sql, params);
  };

  get = async (sql: string, params: any[] = []) => {
    const result = await pool.query(sql, params);
    return result.rows[0] || null;
  };

  console.log('Using PostgreSQL database');
} else {
  // SQLite (sql.js) for local development
  let db: any;

  const initDb = async () => {
    const SQL = await initSqlJs();
    try {
      // Try to load existing database
      const fs = require('fs');
      if (fs.existsSync('game.db')) {
        const buffer = fs.readFileSync('game.db');
        db = new SQL.Database(buffer);
        console.log('Loaded existing database');
      } else {
        db = new SQL.Database();
        console.log('Created new database');
      }
    } catch (e) {
      db = new SQL.Database();
      console.log('Created new database (no existing file found)');
    }
  };

  query = async (sql: string, params: any[] = []) => {
    if (!db) await initDb();
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const result: any[] = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();
    return result;
  };

  run = async (sql: string, params: any[] = []) => {
    if (!db) await initDb();
    db.run(sql, params);
    // Save to file
    const fs = require('fs');
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync('game.db', buffer);
  };

  get = async (sql: string, params: any[] = []) => {
    if (!db) await initDb();
    const stmt = db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
      const result = stmt.getAsObject();
      stmt.free();
      return result;
    }
    stmt.free();
    return null;
  };

  console.log('Using SQLite database (sql.js)');
}

export { query, run, get };
