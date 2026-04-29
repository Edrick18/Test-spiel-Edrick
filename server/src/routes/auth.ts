import { Router, Request, Response } from 'express';
import { UserModel } from '../models/User';

const router = Router();

// Registrierung
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
    }

    // Prüfen ob Username bereits existiert
    const existingUsername = get(`SELECT * FROM users WHERE username = ?`, [username]);
    if (existingUsername) {
      return res.status(409).json({ error: 'Benutzername bereits vergeben' });
    }

    const user = await UserModel.create(username, password);
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error: any) {
    console.error('Registrierungsfehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    const user = await UserModel.verifyPassword(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    res.json({ id: user.id, username: user.username });
  } catch (error: any) {
    console.error('Login-Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;

function get(sql: string, params: any[]) {
  const { get } = require('../models/database');
  return get(sql, params);
}
