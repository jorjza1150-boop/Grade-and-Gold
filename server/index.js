import express from 'express';
import { fileURLToPath } from 'node:url';
import { GOLD_SOURCE, normalizeGold } from './gold.js';
const app = express();
let cached;
app.get('/api/gold', async (_req, res) => {
  try {
    if (cached && Date.now() - cached.time < 60_000) return res.json(cached.data);
    const response = await fetch(GOLD_SOURCE, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);
    const data = normalizeGold(await response.json());
    cached = { time: Date.now(), data };
    res.json(data);
  } catch (error) {
    console.error('Gold API:', error.message);
    res.status(502).json({ error: 'ไม่สามารถดึงราคาทองคำได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง' });
  }
});
app.use(express.static(fileURLToPath(new URL('../dist', import.meta.url))));
app.listen(Number(process.env.PORT) || 3001, '127.0.0.1', () => console.log('Server: http://127.0.0.1:3001'));
