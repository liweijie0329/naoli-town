import { createClient } from '@supabase/supabase-js';

export interface SessionPayload {
  gender: string;
  age: number;
}

export interface StageAnswer {
  stageId: string;
  isCorrect: boolean;
  answer: string;
}

export interface SessionRecord {
  id: string;
  gender: string;
  age: number;
  status: 'in_progress' | 'completed';
  completed_stages: number;
  total_score: number;
  answers: StageAnswer[] | null;
}

type SessionStatus = 'in_progress' | 'completed';

interface BrainSessionRow {
  id: string;
  gender: string;
  age: number;
  status: SessionStatus;
  completed_stages: number;
  total_score: number;
  answers: StageAnswer[] | null;
}

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY 环境变量。');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createSession(payload: SessionPayload): Promise<SessionRecord> {
  const { data, error } = await supabase
    .from('brain_sessions')
    .insert({
      gender: payload.gender,
      age: payload.age,
      status: 'in_progress',
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`创建会话失败：${error?.message || '未知错误'}`);
  }

  return data as BrainSessionRow;
}

export async function completeSession(
  id: string,
  answers: StageAnswer[],
  totalScore: number,
): Promise<SessionRecord> {
  const { data, error } = await supabase
    .from('brain_sessions')
    .update({
      status: 'completed',
      completed_stages: answers.length,
      total_score: totalScore,
      answers,
      finished_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`保存测评结果失败：${error?.message || '未知错误'}`);
  }

  return data as BrainSessionRow;
}
