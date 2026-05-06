import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  }),
);
app.use(express.json());

const port = Number(process.env.PORT || 4000);
const normalizedUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '');
const supabaseUrl = normalizedUrl;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing SUPABASE_URL and key. Set SUPABASE_SERVICE_ROLE_KEY (recommended) or SUPABASE_KEY.',
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/sessions', async (req, res) => {
  const { gender, age } = req.body as { gender?: string; age?: number };

  if (!gender || typeof age !== 'number' || Number.isNaN(age)) {
    res.status(400).json({ error: 'Invalid payload: gender and age are required.' });
    return;
  }

  const { data, error } = await supabase
    .from('brain_sessions')
    .insert({
      gender,
      age,
      status: 'in_progress',
    })
    .select('*')
    .single();

  if (error) {
    console.error('Create session failed:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    res.status(500).json({
      error: error.message || 'Supabase insert failed',
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return;
  }

  res.status(201).json(data);
});

app.patch('/api/sessions/:id', async (req, res) => {
  const sessionId = req.params.id;
  const {
    status,
    completedStages,
    totalScore,
    answers,
  } = req.body as {
    status?: 'in_progress' | 'completed';
    completedStages?: number;
    totalScore?: number;
    answers?: Array<{ stageId: string; isCorrect: boolean; answer: string }>;
  };

  const payload: Record<string, unknown> = {};
  if (status) payload.status = status;
  if (typeof completedStages === 'number') payload.completed_stages = completedStages;
  if (typeof totalScore === 'number') payload.total_score = totalScore;
  if (answers) payload.answers = answers;
  if (status === 'completed') payload.finished_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('brain_sessions')
    .update(payload)
    .eq('id', sessionId)
    .select('*')
    .single();

  if (error) {
    console.error('Update session failed:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    res.status(500).json({
      error: error.message || 'Supabase update failed',
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return;
  }

  res.json(data);
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
