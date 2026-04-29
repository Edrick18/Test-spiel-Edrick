import { Router, Request, Response } from 'express';
import { UserModel } from '../models/User';

const router = Router();

// Registrierung
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Benutzername, E-Mail und Passwort erforderlich' });
    }

    // Prüfen ob E-Mail bereits existiert
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'E-Mail bereits registriert' });
    }

    // Prüfen ob Username bereits existiert
    const existingUsername = get(`SELECT * FROM users WHERE username = ?`, [username]);
    if (existingUsername) {
      return res.status(409).json({ error: 'Benutzername bereits vergeben' });
    }

    const user = await UserModel.create(username, email, password);
    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (error: any) {
    console.error('Registrierungsfehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserModel.verifyPassword(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
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
