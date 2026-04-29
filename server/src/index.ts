import express from 'express';
import cors from 'cors';
import apiRouter from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database wird automatisch initialisiert beim ersten Aufruf
console.log('Datenbank wird initialisiert...');

app.use('/api', apiRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});

export { app };
