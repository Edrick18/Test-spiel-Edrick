import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { query, get, run } from './database';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export const UserModel = {
  async create(username: string, email: string, password: string): Promise<User> {
    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    
    run(
      `INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)`,
      [id, username, email, password_hash]
    );
    
    return this.findById(id) as Promise<User>;
  },

  async findByEmail(email: string): Promise<User | null> {
    return get(`SELECT * FROM users WHERE email = ?`, [email]) as Promise<User | null>;
  },

  async findById(id: string): Promise<User | null> {
    return get(`SELECT * FROM users WHERE id = ?`, [id]) as Promise<User | null>;
  },

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    const valid = await bcrypt.compare(password, user.password_hash);
    return valid ? user : null;
  }
};
