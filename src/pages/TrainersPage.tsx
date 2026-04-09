import { useState } from "react";
import Icon from "@/components/ui/icon";

const trainers = [
  {
    id: 1, title: "Тренажёр по охране труда", category: "Безопасность",
    type: "Симуляция", sessions: 12, bestScore: 95, avgTime: "18 мин",
    icon: "ShieldCheck", description: "Практические сценарии по технике безопасности на производстве",
    levels: ["Базовый", "Стандартный", "Продвинутый"], completed: true,
  },
  {
    id: 2, title: "Деловая переписка", category: "Коммуникации",
    type: "Упражнение", sessions: 7, bestScore: 88, avgTime: "12 мин",
    icon: "Mail", description: "Составление официальных писем, приказов и служебных записок",
    levels: ["Базовый", "Стандартный"], completed: true,
  },
  {
    id: 3, title: "Управление конфликтами", category: "Soft Skills",
    type: "Кейс-симуляция", sessions: 3, bestScore: 74, avgTime: "25 мин",
    icon: "Users", description: "Разбор реальных конфликтных ситуаций в рабочей среде",
    levels: ["Базовый", "Стандартный", "Продвинутый"], completed: false,
  },
  {
    id: 4, title: "Финансовый анализ", category: "Финансы",
    type: "Расчёты", sessions: 0, bestScore: null, avgTime: "—",
    icon: "Calculator", description: "Практические задания по чтению балансовых отчётов",
    levels: ["Базовый", "Стандартный"], completed: false,
  },
];

export default function TrainersPage() {
  const [active, setActive] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("Базовый");

  const trainer = trainers.find(t => t.id === active);

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-foreground">Тренажёры</h1>
        <p className="text-sm text-muted-foreground mt-1">Интерактивные практические упражнения для закрепления навыков</p>
      </div>

      {active && trainer ? (
        /* Trainer detail view */
        <div className="space-y-4">
          <button onClick={() => setActive(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ChevronLeft" size={14} /> Назад к списку
          </button>
          <div className="corp-card p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon name={trainer.icon} size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{trainer.title}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{trainer.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Сессий", val: `${trainer.sessions}` },
                { label: "Лучший результат", val: trainer.bestScore ? `${trainer.bestScore}%` : "—" },
                { label: "Среднее время", val: trainer.avgTime },
              ].map(s => (
                <div key={s.label} className="bg-muted/50 border border-border rounded p-3 text-center">
                  <div className="font-mono text-lg font-semibold text-primary">{s.val}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-foreground mb-2">Уровень сложности</div>
              <div className="flex gap-2">
                {trainer.levels.map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-4 py-2 text-sm rounded border transition-colors ${
                      selectedLevel === lvl
                        ? "bg-primary text-white border-primary"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button className="bg-primary text-white px-6 py-3 rounded font-semibold text-sm hover:bg-primary/80 transition-colors flex items-center gap-2">
              <Icon name="Play" size={15} />
              Начать тренажёр · {selectedLevel}
            </button>
          </div>

          {/* Session history */}
          {trainer.sessions > 0 && (
            <div className="corp-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">История сессий</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground py-2 font-medium">Дата</th>
                    <th className="text-left text-muted-foreground py-2 font-medium">Уровень</th>
                    <th className="text-left text-muted-foreground py-2 font-medium">Время</th>
                    <th className="text-right text-muted-foreground py-2 font-medium">Результат</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: "08 апр 2026", level: "Продвинутый", time: "19 мин", score: 95 },
                    { date: "02 апр 2026", level: "Стандартный", time: "17 мин", score: 91 },
                    { date: "25 мар 2026", level: "Базовый", time: "14 мин", score: 88 },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/40 last:border-0">
                      <td className="font-mono py-2 text-muted-foreground">{row.date}</td>
                      <td className="py-2 text-foreground">{row.level}</td>
                      <td className="font-mono py-2 text-muted-foreground">{row.time}</td>
                      <td className="font-mono py-2 text-right text-green-400 font-semibold">{row.score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Trainers grid */
        <div className="grid sm:grid-cols-2 gap-4">
          {trainers.map(t => (
            <div
              key={t.id}
              onClick={() => { setActive(t.id); setSelectedLevel(t.levels[0]); }}
              className="corp-card p-5 cursor-pointer hover:border-primary/40 transition-colors group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon name={t.icon} size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{t.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="corp-badge text-muted-foreground">{t.category}</span>
                    <span className="corp-badge text-muted-foreground">{t.type}</span>
                  </div>
                </div>
                {t.completed && <Icon name="CheckCircle" size={14} className="text-green-400 shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{t.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">{t.sessions} сессий</span>
                  {t.bestScore && <span className="text-xs font-mono text-green-400">{t.bestScore}%</span>}
                </div>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
