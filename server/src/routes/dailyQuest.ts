import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, get, run } from '../models/database';

const router = Router();

// Tägliche Quests für Charakter laden/erstellen
router.get('/:charId', async (req: Request, res: Response) => {
  try {
    const { charId } = req.params;
    const today = new Date().toDateString();
    
    // Prüfe ob Quests für heute existieren
    let quests = query(
      `SELECT * FROM daily_quests WHERE character_id = ? AND date(created_at) = date('now')`,
      [charId]
    );
    
    // Wenn keine Quests für heute, erstelle neue
    if (quests.length === 0) {
      const durations = [5, 10, 15, 20, 25];
      const rarities = ['Common', 'Rare', 'Rare', 'Epic', 'Epic'];
      
      for (let i = 0; i < 5; i++) {
        const id = uuidv4();
        run(
          `INSERT INTO daily_quests (id, character_id, quest_type, duration, reward_gold, reward_xp, completed, created_at)
           VALUES (?, ?, 'monster', ?, ?, ?, 0, CURRENT_TIMESTAMP)`,
          [id, charId, durations[i], durations[i] * 10, durations[i] * 20]
        );
      }
      
      quests = query(`SELECT * FROM daily_quests WHERE character_id = ? AND date(created_at) = date('now')`, [charId]);
    }
    
    res.json(quests);
  } catch (error: any) {
    console.error('Daily Quests Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Quest als abgeschlossen markieren
router.put('/:questId/complete', async (req: Request, res: Response) => {
  try {
    const { questId } = req.params;
    
    run(`UPDATE daily_quests SET completed = 1 WHERE id = ?`, [questId]);
    
    const quest = get(`SELECT * FROM daily_quests WHERE id = ?`, [questId]);
    res.json(quest);
  } catch (error: any) {
    console.error('Quest Complete Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;
