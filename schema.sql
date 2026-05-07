CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  participant_name TEXT,
  birth_year INTEGER,
  gender TEXT,
  education_level TEXT,
  participant_json TEXT NOT NULL DEFAULT '{}',
  started_at TEXT,
  finished_at TEXT,
  saved_at TEXT NOT NULL,
  total_duration_ms INTEGER NOT NULL DEFAULT 0,
  raw_score INTEGER NOT NULL DEFAULT 0,
  education_bonus INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  risk_band TEXT,
  domain_scores_json TEXT NOT NULL DEFAULT '{}',
  payload_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_sessions_saved_at ON sessions(saved_at);
CREATE INDEX IF NOT EXISTS idx_sessions_participant_name ON sessions(participant_name);

CREATE TABLE IF NOT EXISTS item_responses (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  domain TEXT,
  title TEXT,
  modality TEXT,
  max_score INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  started_at TEXT,
  ended_at TEXT,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  answer_json TEXT NOT NULL DEFAULT '{}',
  behavior_json TEXT NOT NULL DEFAULT '{}',
  ai_json TEXT,
  drawing_image TEXT,
  has_drawing INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_item_responses_session_id ON item_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_item_responses_task_id ON item_responses(task_id);
