import { Router } from 'express';
import authRouter from './auth';
import characterRouter from './character';
import guildRouter from './guild';
import pvpRouter from './pvp';
import dungeonRouter from './dungeon';
import shopRouter from './shop';
import dailyQuestRouter from './dailyQuest';

const router = Router();

// API-Routen
router.use('/auth', authRouter);
router.use('/characters', characterRouter);
router.use('/guilds', guildRouter);
router.use('/pvp', pvpRouter);
router.use('/dungeon', dungeonRouter);
router.use('/shop', shopRouter);
router.use('/daily-quests', dailyQuestRouter);

// Health-Check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
