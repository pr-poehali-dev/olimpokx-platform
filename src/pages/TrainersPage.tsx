import { useState } from "react";
import Icon from "@/components/ui/icon";
import TrainerModule, { trainerData } from "@/components/TrainerModule";

const trainers = [
  {
    id: 1, category: "Безопасность",
    type: "Симуляция", sessions: 12, bestScore: 95, avgTime: "18 мин",
    icon: "ShieldCheck", description: "Практические сценарии по технике безопасности на производстве",
    levels: ["Базовый", "Стандартный", "Продвинутый"], completed: true,
  },
  {
    id: 2, category: "Коммуникации",
    type: "Упражнение", sessions: 7, bestScore: 88, avgTime: "12 мин",
    icon: "Mail", description: "Составление официальных писем, приказов и служебных записок",
    levels: ["Базовый", "Стандартный"], completed: true,
  },
  {
    id: 3, category: "Soft Skills",
    type: "Кейс-симуляция", sessions: 3, bestScore: 74, avgTime: "25 мин",
    icon: "Users", description: "Разбор реальных конфликтных ситуаций в рабочей среде",
    levels: ["Базовый", "Стандартный", "Продвинутый"], completed: false,
  },
  {
    id: 4, category: "Финансы",
    type: "Расчёты", sessions: 0, bestScore: null, avgTime: "—",
    icon: "Calculator", description: "Практические задания по чтению балансовых отчётов",
    levels: ["Базовый", "Стандартный"], completed: false,
  },
];

export default function TrainersPage() {
  const [activeTrainerId, setActiveTrainerId] = useState<number | null>(null);
  const [sessionScores, setSessionScores] = useState<Record<number, number[]>>({});

  const activeConfig = activeTrainerId ? trainerData[activeTrainerId] : null;

  const handleComplete = (score: number) => {
    if (activeTrainerId) {
      setSessionScores(prev => ({
        ...prev,
        [activeTrainerId]: [...(prev[activeTrainerId] || []), score],
      }));
    }
  };

  return (
    <>
      {activeConfig && (
        <TrainerModule
          config={activeConfig}
          onClose={() => setActiveTrainerId(null)}
          onComplete={handleComplete}
        />
      )}

      <div className="p-6 animate-fade-in">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-foreground">Тренажёры</h1>
          <p className="text-sm text-muted-foreground mt-1">Интерактивные практические упражнения для закрепления навыков</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Пройдено", val: trainers.filter(t => t.completed).length, color: "text-green-400" },
            { label: "Всего сессий", val: trainers.reduce((a, t) => a + t.sessions + (sessionScores[t.id]?.length || 0), 0), color: "text-primary" },
            { label: "Ср. результат", val: `${Math.round(trainers.filter(t => t.bestScore).reduce((a, t) => a + (t.bestScore || 0), 0) / trainers.filter(t => t.bestScore).length)}%`, color: "text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="corp-card p-4 text-center">
              <div className={`text-2xl font-mono font-semibold ${s.color}`}>{s.val}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Trainers grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {trainers.map(t => {
            const config = trainerData[t.id];
            const scores = sessionScores[t.id] || [];
            const latestScore = scores.length > 0 ? scores[scores.length - 1] : null;
            const best = t.bestScore || (scores.length > 0 ? Math.max(...scores) : null);

            return (
              <div key={t.id} className="corp-card p-5 flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon name={t.icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{config.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="corp-badge text-muted-foreground">{t.category}</span>
                      <span className="corp-badge text-muted-foreground">{t.type}</span>
                    </div>
                  </div>
                  {(t.completed || scores.length > 0) && (
                    <Icon name="CheckCircle" size={14} className="text-green-400 shrink-0 mt-0.5" />
                  )}
                </div>

                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{t.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Сессий", val: `${t.sessions + scores.length}` },
                    { label: "Лучший", val: best ? `${best}%` : "—" },
                    { label: "Время", val: config.duration },
                  ].map(m => (
                    <div key={m.label} className="bg-muted/50 border border-border/60 rounded p-2 text-center">
                      <div className="text-sm font-mono font-semibold text-foreground">{m.val}</div>
                      <div className="text-[10px] text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent score */}
                {latestScore !== null && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded border mb-3 text-xs ${
                    latestScore >= 75
                      ? "border-green-500/20 bg-green-500/5 text-green-400"
                      : "border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
                  }`}>
                    <Icon name={latestScore >= 75 ? "TrendingUp" : "AlertCircle"} size={12} />
                    Последний результат: <span className="font-mono font-semibold ml-1">{latestScore}%</span>
                  </div>
                )}

                {/* Steps preview dots */}
                <div className="flex items-center gap-1 mb-4">
                  {config.steps.map((step, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        step.type === "info" ? "bg-blue-500/30" : "bg-primary/40"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => setActiveTrainerId(t.id)}
                    className="w-full bg-primary text-white py-2.5 rounded text-sm font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name={t.sessions + scores.length > 0 ? "RefreshCw" : "Play"} size={14} />
                    {t.sessions + scores.length > 0 ? "Пройти ещё раз" : "Начать тренажёр"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
