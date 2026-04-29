import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, get, run } from '../models/database';

const router = Router();

// MMR für Charakter berechnen (Basis: Level * 10)
function calculateBaseMMR(level: number): number {
  return level * 10;
}

// PvP-Match durchführen
router.post('/fight', async (req: Request, res: Response) => {
  try {
    const { challenger_id, defender_id } = req.body;
    
    if (!challenger_id || !defender_id) {
      return res.status(400).json({ error: 'challenger_id und defender_id erforderlich' });
    }

    const challenger = get(`SELECT * FROM characters WHERE id = ?`, [challenger_id]);
    const defender = get(`SELECT * FROM characters WHERE id = ?`, [defender_id]);
    
    if (!challenger || !defender) {
      return res.status(404).json({ error: 'Charakter nicht gefunden' });
    }

    const challengerMMR = calculateBaseMMR(challenger.level);
    const defenderMMR = calculateBaseMMR(defender.level);

    // Einfacher Kampf-Simulator (wie im Frontend)
    const cAttack = challenger.strength * 2 + challenger.intelligence * 2;
    const dAttack = defender.strength * 2 + defender.intelligence * 2;
    const cDefense = challenger.armor / 2;
    const dDefense = defender.armor / 2;
    
    let cHP = challenger.hp;
    let dHP = defender.hp;
    let winner = null;
    
    while (cHP > 0 && dHP > 0) {
      // Challenger angriff
      let dmgToDefender = Math.max(1, cAttack - dDefense);
      if (Math.random() * 100 < challenger.crit_chance) dmgToDefender *= 2;
      if (Math.random() * 100 < defender.dodge_chance) dmgToDefender = 0;
      dHP -= dmgToDefender;
      
      if (dHP <= 0) { winner = challenger; break; }
      
      // Defender angriff
      let dmgToChallenger = Math.max(1, dAttack - cDefense);
      if (Math.random() * 100 < defender.crit_chance) dmgToChallenger *= 2;
      if (Math.random() * 100 < challenger.dodge_chance) dmgToChallenger = 0;
      cHP -= dmgToChallenger;
      
      if (cHP <= 0) { winner = defender; break; }
    }

    const id = uuidv4();
    run(
      `INSERT INTO pvp_matches (id, challenger_id, defender_id, winner_id, challenger_mmr_before, defender_mmr_before, challenger_mmr_after, defender_mmr_after)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, challenger_id, defender_id, winner.id, challengerMMR, defenderMMR, challengerMMR, defenderMMR]
    );

    // Belohnung
    const goldReward = 50 + winner.level * 5;
    const xpReward = 20 + winner.level * 3;
    
    run(`UPDATE characters SET gold = gold + ?, xp = xp + ? WHERE id = ?`, [goldReward, xpReward, winner.id]);

    res.json({
      winner: winner.name,
      winner_id: winner.id,
      gold_reward: goldReward,
      xp_reward: xpReward,
      challenger_hp_remaining: Math.max(0, cHP),
      defender_hp_remaining: Math.max(0, dHP)
    });
  } catch (error: any) {
    console.error('PvP-Fight Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// PvP-Rangliste
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const chars = query(`
      SELECT c.id, c.name, c.level, c.class_type, u.username,
             (c.level * 10) as mmr
      FROM characters c
      JOIN users u ON c.user_id = u.id
      ORDER BY mmr DESC
      LIMIT 100
    `);
    res.json(chars);
  } catch (error: any) {
    console.error('Leaderboard Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// PvP-Historie für Charakter
router.get('/history/:charId', async (req: Request, res: Response) => {
  try {
    const { charId } = req.params;
    const history = query(`
      SELECT pm.*, 
             c1.name as challenger_name, 
             c2.name as defender_name,
             c3.name as winner_name
      FROM pvp_matches pm
      JOIN characters c1 ON pm.challenger_id = c1.id
      JOIN characters c2 ON pm.defender_id = c2.id
      JOIN characters c3 ON pm.winner_id = c3.id
      WHERE pm.challenger_id = ? OR pm.defender_id = ?
      ORDER BY pm.fought_at DESC
      LIMIT 50
    `, [charId, charId]);
    res.json(history);
  } catch (error: any) {
    console.error('PvP-Historie Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;
