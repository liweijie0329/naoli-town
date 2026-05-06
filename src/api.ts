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

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

function apiUrl(path: string): string {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path}`;
}

export async function createSession(payload: SessionPayload): Promise<SessionRecord> {
  const response = await fetch(apiUrl('/api/sessions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('创建会话失败，请检查后端和 Supabase 配置。');
  }

  return response.json();
}

export async function completeSession(
  id: string,
  answers: StageAnswer[],
  totalScore: number,
): Promise<SessionRecord> {
  const response = await fetch(apiUrl(`/api/sessions/${id}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'completed',
      completedStages: answers.length,
      totalScore,
      answers,
    }),
  });

  if (!response.ok) {
    throw new Error('保存测评结果失败，请稍后重试。');
  }

  return response.json();
}
