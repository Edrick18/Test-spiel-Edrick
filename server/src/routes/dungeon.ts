import { Router, Request, Response } from 'express';
import { get, run } from '../models/database';

const router = Router();

// Boss-Level-Tabelle (linear: Boss N = Level N)
function getBossStats(bossLevel: number) {
  const baseHP = 100 + bossLevel * 50;
  const baseAttack = 10 + bossLevel * 5;
  const baseGold = 50 + bossLevel * 10;
  const baseXP = 30 + bossLevel * 8;
  
  return {
    name: `Boss Level ${bossLevel}`,
    level: bossLevel,
    hp: baseHP * 5, // Boss multiplier x5
    attack: baseAttack * 5,
    gold: baseGold * 3,
    xp: baseXP * 3,
    armor: bossLevel * 3
  };
}

// Dungeon-Status für Charakter abrufen
router.get('/:charId', async (req: Request, res: Response) => {
  try {
    const { charId } = req.params;
    
    let progress = get(`SELECT * FROM dungeon_progress WHERE character_id = ?`, [charId]);
    
    if (!progress) {
      // Initialisiere Dungeon-Progress
      run(`INSERT INTO dungeon_progress (character_id, current_boss, highest_boss) VALUES (?, 0, 0)`, [charId]);
      progress = { character_id: charId, current_boss: 0, highest_boss: 0 };
    }
    
    res.json(progress);
  } catch (error: any) {
    console.error('Dungeon-Status Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Boss-Kampf durchführen
router.post('/:charId/fight', async (req: Request, res: Response) => {
  try {
    const { charId } = req.params;
    const { boss_level } = req.body;
    
    const char = get(`SELECT * FROM characters WHERE id = ?`, [charId]);
    if (!char) {
      return res.status(404).json({ error: 'Charakter nicht gefunden' });
    }

    const progress = get(`SELECT * FROM dungeon_progress WHERE character_id = ?`, [charId]);
    const targetBoss = boss_level || (progress ? progress.current_boss + 1 : 1);
    
    const boss = getBossStats(targetBoss);
    
    // Kampf-Simulation
    let cHP = char.hp;
    let bHP = boss.hp;
    const cAttack = char.strength * 2 + char.intelligence * 2;
    const cDefense = char.armor / 2;
    
    while (cHP > 0 && bHP > 0) {
      // Charakter angreift
      let dmgToBoss = Math.max(1, cAttack - boss.armor / 2);
      if (Math.random() * 100 < char.crit_chance) dmgToBoss *= 2;
      if (Math.random() * 100 < 0) dmgToBoss = 0; // Boss dodge = 0
      bHP -= dmgToBoss;
      
      if (bHP <= 0) break;
      
      // Boss angreift
      let dmgToChar = Math.max(1, boss.attack - cDefense);
      if (Math.random() * 100 < 5) dmgToChar *= 2; // Boss crit 5%
      if (Math.random() * 100 < char.dodge_chance) dmgToChar = 0;
      cHP -= dmgToChar;
    }

    const won = bHP <= 0;
    let reward = null;
    
    if (won) {
      // Belohnung
      run(`UPDATE characters SET gold = gold + ?, xp = xp + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
        [boss.gold, boss.xp, charId]);
      
      // Progress aktualisieren
      const newHighest = Math.max(progress ? progress.highest_boss : 0, targetBoss);
      run(`UPDATE dungeon_progress SET current_boss = ?, highest_boss = ?, last_fought_at = CURRENT_TIMESTAMP WHERE character_id = ?`,
        [targetBoss, newHighest, charId]);
      
      reward = { gold: boss.gold, xp: boss.xp };
    } else {
      // Bei Niederlage: Progress zurücksetzen auf letzten erfolgreichen Boss
      if (progress) {
        run(`UPDATE dungeon_progress SET current_boss = ? WHERE character_id = ?`, 
          [progress.highest_boss, charId]);
      }
    }

    res.json({
      won,
      char_hp_remaining: Math.max(0, cHP),
      boss_hp_remaining: Math.max(0, bHP),
      reward,
      boss_name: boss.name,
      boss_level: targetBoss
    });
  } catch (error: any) {
    console.error('Dungeon-Fight Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Verfügbare Bosse auflisten
router.get('/bosses/:fromLevel/:toLevel', async (req: Request, res: Response) => {
  try {
    const { fromLevel, toLevel } = req.params;
    const bosses = [];
    
    for (let i = parseInt(fromLevel); i <= parseInt(toLevel); i++) {
      bosses.push(getBossStats(i));
    }
    
    res.json(bosses);
  } catch (error: any) {
    console.error('Boss-Liste Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;
