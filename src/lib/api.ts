const RESULTS_URL = "https://functions.poehali.dev/80632650-4ac6-4631-9ee0-ca630174c64a";
const USER_ID = "user_ivanov_ps";

const headers = {
  "Content-Type": "application/json",
  "X-User-Id": USER_ID,
};

export interface ExamResult {
  id?: number;
  exam_id: number;
  exam_title: string;
  score: number;
  correct_count: number;
  total_questions: number;
  time_spent: number;
  passed: boolean;
  answers: Record<string, number>;
  created_at?: string;
}

export interface TrainerResult {
  id?: number;
  trainer_id: number;
  trainer_title: string;
  score: number;
  correct_count: number;
  total_steps: number;
  time_spent: number;
  created_at?: string;
}

export async function saveExamResult(data: Omit<ExamResult, "id" | "created_at">): Promise<{ ok: boolean; id: number }> {
  const res = await fetch(RESULTS_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ type: "exam", ...data }),
  });
  const text = await res.text();
  return JSON.parse(text);
}

export async function saveTrainerResult(data: Omit<TrainerResult, "id" | "created_at">): Promise<{ ok: boolean; id: number }> {
  const res = await fetch(RESULTS_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ type: "trainer", ...data }),
  });
  const text = await res.text();
  return JSON.parse(text);
}

export async function getExamHistory(): Promise<ExamResult[]> {
  const res = await fetch(`${RESULTS_URL}?type=exam`, { headers });
  const text = await res.text();
  const data = JSON.parse(text);
  return data.results || [];
}

export async function getTrainerHistory(): Promise<TrainerResult[]> {
  const res = await fetch(`${RESULTS_URL}?type=trainer`, { headers });
  const text = await res.text();
  const data = JSON.parse(text);
  return data.results || [];
}
