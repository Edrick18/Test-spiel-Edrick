import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, get, run } from '../models/database';

const router = Router();

// Charaktere eines Users auflisten
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const chars = query(`SELECT * FROM characters WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
    res.json(chars);
  } catch (error: any) {
    console.error('Charakter-Liste Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Charakter erstellen
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, name, class_type } = req.body;
    
    if (!user_id || !name || !class_type) {
      return res.status(400).json({ error: 'user_id, name und class_type erforderlich' });
    }

    // Prüfen ob Name bereits existiert
    const existing = get(`SELECT * FROM characters WHERE name = ?`, [name]);
    if (existing) {
      return res.status(409).json({ error: 'Charaktername bereits vergeben' });
    }

    const id = uuidv4();
    run(
      `INSERT INTO characters (id, user_id, name, class_type) VALUES (?, ?, ?, ?)`,
      [id, user_id, name, class_type]
    );
    
    const char = get(`SELECT * FROM characters WHERE id = ?`, [id]);
    res.status(201).json(char);
  } catch (error: any) {
    console.error('Charakter-Erstellungsfehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Charakter abrufen (inkl. Items)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const char = get(`SELECT * FROM characters WHERE id = ?`, [id]);
    
    if (!char) {
      return res.status(404).json({ error: 'Charakter nicht gefunden' });
    }
    
    // Items laden
    const items = query(`SELECT * FROM items WHERE character_id = ?`, [id]);
    (char as any).items = items;
    
    res.json(char);
  } catch (error: any) {
    console.error('Charakter-Abruffehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Charakter aktualisieren (nach Kampf/Level-Up)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const char = get(`SELECT * FROM characters WHERE id = ?`, [id]);
    if (!char) {
      return res.status(404).json({ error: 'Charakter nicht gefunden' });
    }
    
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'Keine Aktualisierungsfelder' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    run(
      `UPDATE characters SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );
    
    const updated = get(`SELECT * FROM characters WHERE id = ?`, [id]);
    res.json(updated);
  } catch (error: any) {
    console.error('Charakter-Aktualisierungsfehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Item hinzufügen
router.post('/:id/items', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, rarity, level, vitality_bonus, strength_bonus, intelligence_bonus, dexterity_bonus, luck_bonus, wisdom_bonus, hp_bonus, mana_bonus, armor_bonus, slot } = req.body;
    
    const itemId = uuidv4();
    run(
      `INSERT INTO items (id, character_id, name, type, rarity, level, vitality_bonus, strength_bonus, intelligence_bonus, dexterity_bonus, luck_bonus, wisdom_bonus, hp_bonus, mana_bonus, armor_bonus, slot)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [itemId, id, name, type, rarity, level, vitality_bonus, strength_bonus, intelligence_bonus, dexterity_bonus, luck_bonus, wisdom_bonus, hp_bonus, mana_bonus, armor_bonus, slot]
    );
    
    const item = get(`SELECT * FROM items WHERE id = ?`, [itemId]);
    res.status(201).json(item);
  } catch (error: any) {
    console.error('Item-Hinzufügen Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Item ausrüsten
router.put('/:id/equip', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { item_id, slot } = req.body;
    
    // Item dem Charakter zuordnen im entsprechenden Slot
    if (slot === 'weapon') {
      run(`UPDATE characters SET equipped_weapon = ? WHERE id = ?`, [item_id, id]);
    } else if (slot === 'armor') {
      run(`UPDATE characters SET equipped_armor = ? WHERE id = ?`, [item_id, id]);
    } else if (slot === 'accessory') {
      run(`UPDATE characters SET equipped_accessory = ? WHERE id = ?`, [item_id, id]);
    }
    
    const char = get(`SELECT * FROM characters WHERE id = ?`, [id]);
    res.json(char);
  } catch (error: any) {
    console.error('Ausrüstungsfehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;
