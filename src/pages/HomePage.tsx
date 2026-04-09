import Icon from "@/components/ui/icon";

const stats = [
  { label: "Пройдено курсов", value: "12", sub: "из 24 назначенных", icon: "BookOpen", color: "text-blue-400" },
  { label: "Средний балл", value: "87.4", sub: "+3.2 за месяц", icon: "TrendingUp", color: "text-green-400" },
  { label: "Сертификатов", value: "5", sub: "действующих", icon: "Award", color: "text-yellow-400" },
  { label: "Рейтинг", value: "14", sub: "место из 312", icon: "Trophy", color: "text-orange-400" },
];

const deadlines = [
  { title: "Охрана труда 2024", type: "Экзамен", date: "15 апр 2026", urgent: true },
  { title: "Корпоративная этика", type: "Курс", date: "30 апр 2026", urgent: false },
  { title: "Пожарная безопасность", type: "Тренажёр", date: "05 мая 2026", urgent: false },
];

const activity = [
  { action: "Завершён модуль", target: "Управление проектами — Модуль 3", time: "2 часа назад", icon: "CheckCircle", color: "text-green-400" },
  { action: "Получен сертификат", target: "Информационная безопасность", time: "Вчера", icon: "Award", color: "text-yellow-400" },
  { action: "Начат курс", target: "Финансовая отчётность для руководителей", time: "3 дня назад", icon: "PlayCircle", color: "text-blue-400" },
  { action: "Пройден экзамен", target: "Противодействие коррупции — 94 балла", time: "Неделю назад", icon: "ClipboardCheck", color: "text-green-400" },
];

export default function HomePage() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Добро пожаловать, Павел</h1>
          <p className="text-sm text-muted-foreground mt-1">Среда, 9 апреля 2026 · Отдел кадрового развития</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded px-3 py-2">
          <Icon name="AlertTriangle" size={14} className="text-yellow-400" />
          <span className="text-xs font-medium text-yellow-400">1 дедлайн на этой неделе</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="corp-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <Icon name={s.icon} size={14} className={s.color} />
            </div>
            <div className="stat-number">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Progress */}
        <div className="lg:col-span-2 corp-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Текущие курсы</h2>
          <div className="space-y-4">
            {[
              { title: "Управление проектами", progress: 68, modules: "7/10 модулей" },
              { title: "Финансовая отчётность", progress: 24, modules: "2/8 модулей" },
              { title: "Деловая переписка", progress: 100, modules: "5/5 модулей" },
            ].map((c) => (
              <div key={c.title}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-foreground">{c.title}</span>
                  <span className="text-xs font-mono text-muted-foreground">{c.modules}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${c.progress}%`, background: c.progress === 100 ? 'hsl(158,64%,40%)' : undefined }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{c.progress}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines */}
        <div className="corp-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Ближайшие дедлайны</h2>
          <div className="space-y-3">
            {deadlines.map((d) => (
              <div key={d.title} className={`p-3 rounded border ${d.urgent ? 'border-red-500/30 bg-red-500/5' : 'border-border bg-muted/30'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium text-foreground leading-tight">{d.title}</div>
                  {d.urgent && <Icon name="AlertCircle" size={13} className="text-red-400 mt-0.5 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="corp-badge text-muted-foreground">{d.type}</span>
                  <span className="text-xs font-mono text-muted-foreground">{d.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="corp-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Последняя активность</h2>
        <div className="space-y-3">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
              <Icon name={a.icon} size={15} className={`${a.color} mt-0.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-muted-foreground">{a.action}: </span>
                <span className="text-sm text-foreground">{a.target}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
