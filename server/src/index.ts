import express from 'express';
import cors from 'cors';
import { initDatabase } from './models/database';
import apiRouter from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initDatabase().then(() => {
  console.log('Datenbank initialisiert (SQLite)');
}).catch(err => {
  console.error('Datenbank-Fehler:', err);
});

app.use('/api', apiRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});

export { app };
