
CREATE TABLE IF NOT EXISTS exam_results (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL DEFAULT 'default',
  exam_id INTEGER NOT NULL,
  exam_title TEXT NOT NULL,
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_spent INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trainer_results (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL DEFAULT 'default',
  trainer_id INTEGER NOT NULL,
  trainer_title TEXT NOT NULL,
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  total_steps INTEGER NOT NULL,
  time_spent INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_results_user ON exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_trainer_results_user ON trainer_results(user_id);
