import { Router, Request, Response } from 'express';
import { query, get, run } from '../models/database';

const router = Router();

// Item-Präfixe für zufällige Namen
const PREFIXES = {
  weapon: ['Scharfe', 'Wütende', 'Brennende', 'Göttliche', 'Dunkle', 'Heldenhafte', 'Mystische', 'Alte', 'Königs-', 'Drachen-'],
  armor: ['Schützende', 'Eiserne', 'Drachen-', 'Göttliche', 'Helden-', 'Mystische', 'Wuchtige', 'Leichte', 'Schwere', 'Königs-'],
  accessory: ['Glänzende', 'Magische', 'Mächtige', 'Weise', 'Glückliche', 'Mystische', 'Alte', 'Dunkle', 'Leuchtende', 'Königs-']
};

// Basis-Item-Namen
const BASE_NAMES = {
  weapon: ['Schwert', 'Axt', 'Bogen', 'Stab', 'Dolch', 'Kriegshammer', 'Zauberbuch', 'Fäustlinge'],
  armor: ['Helm', 'Brustplatte', 'Handschuhe', 'Stiefel', 'Schild', 'Roben', 'Kettenhemd', 'Plattenrüstung'],
  accessory: ['Ring', 'Amulett', 'Talisman', 'Siegel', 'Medaillon', 'Anhänger', 'Armreif', 'Ohrring']
};

// Zufälligen Item-Namen generieren
function generateItemName(type: string, rarity: string): string {
  const prefixes = PREFIXES[type as keyof typeof PREFIXES] || PREFIXES.weapon;
  const baseNames = BASE_NAMES[type as keyof typeof BASE_NAMES] || BASE_NAMES.weapon;
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const base = baseNames[Math.floor(Math.random() * baseNames.length)];
  return `${prefix} ${base}`;
}

// Item-Preis berechnen
function calculatePrice(level: number, rarity: string, type: string): number {
  const basePrice = 10;
  const rarityMultiplier: { [key: string]: number } = {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3
  };
  const multiplier = rarityMultiplier[rarity] || 1;
  return Math.floor(basePrice * Math.pow(level, 1.5) * multiplier);
}

// Shop-Inventar generieren (6 Slots pro Kategorie)
router.get('/inventory/:charLevel', async (req: Request, res: Response) => {
  try {
    const charLevel = parseInt(req.params.charLevel);
    const maxLevel = charLevel + 5;
    
    const inventory: any[] = [];
    const types = ['weapon', 'armor', 'accessory'];
    const rarities = ['common', 'rare', 'epic', 'legendary'];
    
    for (const type of types) {
      for (let i = 0; i < 6; i++) {
        const level = Math.floor(Math.random() * (maxLevel - 1)) + 1;
        const rarity = rarities[Math.floor(Math.random() * rarities.length)];
        const name = generateItemName(type, rarity);
        
        const item = {
          id: `shop_${type}_${i}_${Date.now()}`,
          name,
          type,
          rarity,
          level,
          price: calculatePrice(level, rarity, type),
          vitality_bonus: type === 'armor' ? Math.floor(level * 1.5) : Math.floor(level * 0.5),
          strength_bonus: type === 'weapon' ? Math.floor(level * 2) : Math.floor(level * 0.5),
          intelligence_bonus: type === 'weapon' ? Math.floor(level * 2) : Math.floor(level * 0.5),
          dexterity_bonus: Math.floor(level * 0.5),
          luck_bonus: Math.floor(level * 0.3),
          wisdom_bonus: Math.floor(level * 0.3),
          hp_bonus: type === 'armor' ? level * 10 : 0,
          mana_bonus: type === 'armor' ? level * 5 : 0,
          armor_bonus: type === 'armor' ? level * 2 : 0,
          slot: type
        };
        
        inventory.push(item);
      }
    }
    
    res.json(inventory);
  } catch (error: any) {
    console.error('Shop-Inventar Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Item kaufen
router.post('/buy', async (req: Request, res: Response) => {
  try {
    const { character_id, item } = req.body;
    
    const char = get(`SELECT * FROM characters WHERE id = ?`, [character_id]);
    if (!char) {
      return res.status(404).json({ error: 'Charakter nicht gefunden' });
    }
    
    if (char.gold < item.price) {
      return res.status(400).json({ error: 'Nicht genug Gold' });
    }
    
    // Gold abziehen
    run(`UPDATE characters SET gold = gold - ? WHERE id = ?`, [item.price, character_id]);
    
    // Item hinzufügen
    const { v4: uuidv4 } = require('uuid');
    const itemId = uuidv4();
    run(
      `INSERT INTO items (id, character_id, name, type, rarity, level, vitality_bonus, strength_bonus, intelligence_bonus, dexterity_bonus, luck_bonus, wisdom_bonus, hp_bonus, mana_bonus, armor_bonus, slot)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [itemId, character_id, item.name, item.type, item.rarity, item.level, 
       item.vitality_bonus, item.strength_bonus, item.intelligence_bonus, 
       item.dexterity_bonus, item.luck_bonus, item.wisdom_bonus,
       item.hp_bonus, item.mana_bonus, item.armor_bonus, item.slot]
    );
    
    const updatedChar = get(`SELECT * FROM characters WHERE id = ?`, [character_id]);
    const newItem = get(`SELECT * FROM items WHERE id = ?`, [itemId]);
    
    res.json({ character: updatedChar, item: newItem });
  } catch (error: any) {
    console.error('Kauf-Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Item verkaufen
router.post('/sell', async (req: Request, res: Response) => {
  try {
    const { character_id, item_id } = req.body;
    
    const item = get(`SELECT * FROM items WHERE id = ? AND character_id = ?`, [item_id, character_id]);
    if (!item) {
      return res.status(404).json({ error: 'Item nicht gefunden' });
    }
    
    // Item-Preis berechnen (50% des Kaufpreises)
    const sellPrice = Math.floor(calculatePrice(item.level, item.rarity, item.type) * 0.5);
    
    // Gold hinzufügen
    run(`UPDATE characters SET gold = gold + ? WHERE id = ?`, [sellPrice, character_id]);
    
    // Item löschen
    run(`DELETE FROM items WHERE id = ?`, [item_id]);
    
    // Wenn Item ausgerüstet war, Ausrüstung zurücksetzen
    const char = get(`SELECT * FROM characters WHERE id = ?`, [character_id]);
    if (char.equipped_weapon === item_id) {
      run(`UPDATE characters SET equipped_weapon = NULL WHERE id = ?`, [character_id]);
    }
    if (char.equipped_armor === item_id) {
      run(`UPDATE characters SET equipped_armor = NULL WHERE id = ?`, [character_id]);
    }
    if (char.equipped_accessory === item_id) {
      run(`UPDATE characters SET equipped_accessory = NULL WHERE id = ?`, [character_id]);
    }
    
    const updatedChar = get(`SELECT * FROM characters WHERE id = ?`, [character_id]);
    res.json({ character: updatedChar, sell_price: sellPrice });
  } catch (error: any) {
    console.error('Verkauf-Fehler:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;
