import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, get, run } from '../models/database';

const router = Router();

// Gilden auflisten
router.get('/', async (req: Request, res: Response) => {
  try {
    const guilds = query(`SELECT g.*, u.username as leader_name FROM guilds g JOIN users u ON g.leader_id = u.id ORDER BY g.level DESC, g.xp DESC`);
    res.json(guilds);
  } catch (error: any) {
    console.error('Gilden-Liste Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Gilde erstellen
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, leader_id } = req.body;
    
    if (!name || !leader_id) {
      return res.status(400).json({ error: 'Name und leader_id erforderlich' });
    }

    const existing = get(`SELECT * FROM guilds WHERE name = ?`, [name]);
    if (existing) {
      return res.status(409).json({ error: 'Gildenname bereits vergeben' });
    }

    const id = uuidv4();
    run(
      `INSERT INTO guilds (id, name, description, leader_id) VALUES (?, ?, ?, ?)`,
      [id, name, description || '', leader_id]
    );
    
    // Leader als Mitglied hinzufügen
    run(
      `INSERT INTO guild_members (guild_id, user_id, role) VALUES (?, ?, 'leader')`,
      [id, leader_id]
    );
    
    const guild = get(`SELECT * FROM guilds WHERE id = ?`, [id]);
    res.status(201).json(guild);
  } catch (error: any) {
    console.error('Gilden-Erstellung Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Gilde beitreten
router.post('/:guildId/join', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const { user_id } = req.body;
    
    const existing = get(`SELECT * FROM guild_members WHERE guild_id = ? AND user_id = ?`, [guildId, user_id]);
    if (existing) {
      return res.status(409).json({ error: 'Benutzer ist bereits Mitglied' });
    }

    run(
      `INSERT INTO guild_members (guild_id, user_id) VALUES (?, ?)`,
      [guildId, user_id]
    );
    
    res.json({ message: 'Gilde beigetreten' });
  } catch (error: any) {
    console.error('Gilden-Beitritt Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Gilden-Mitglieder auflisten
router.get('/:guildId/members', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const members = query(`
      SELECT gm.*, u.username 
      FROM guild_members gm 
      JOIN users u ON gm.user_id = u.id 
      WHERE gm.guild_id = ?
    `, [guildId]);
    res.json(members);
  } catch (error: any) {
    console.error('Mitglieder-Liste Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Gilden-Beitrag aktualisieren
router.put('/:guildId/member/:userId', async (req: Request, res: Response) => {
  try {
    const { guildId, userId } = req.params;
    const { contribution_percent } = req.body;
    
    run(
      `UPDATE guild_members SET contribution_percent = ? WHERE guild_id = ? AND user_id = ?`,
      [contribution_percent, guildId, userId]
    );
    
    res.json({ message: 'Beitrag aktualisiert' });
  } catch (error: any) {
    console.error('Beitrag-Aktualisierung Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;
