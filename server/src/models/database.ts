import { Pool } from 'pg';

// PostgreSQL connection - works on Render.com
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});

export async function query(sql: string, params: any[] = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}

export async function run(sql: string, params: any[] = []) {
  await pool.query(sql, params);
}

export async function get(sql: string, params: any[] = []) {
  const result = await pool.query(sql, params);
  return result.rows[0] || null;
}

export { pool };
