import { useState } from "react";
import Icon from "@/components/ui/icon";

const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const monthData = [42, 58, 71, 65, 80, 87, 74, 68, 83, 79, 88, 87];

const deptData = [
  { dept: "HR & Development", total: 24, completed: 19, avg: 84 },
  { dept: "Финансовый отдел", total: 18, completed: 15, avg: 79 },
  { dept: "IT-департамент", total: 32, completed: 28, avg: 91 },
  { dept: "Юридический отдел", total: 14, completed: 10, avg: 76 },
  { dept: "Производство", total: 41, completed: 38, avg: 88 },
];

const topEmployees = [
  { name: "Смирнова А.В.", dept: "IT-департамент", score: 97, courses: 18 },
  { name: "Петров Д.И.", dept: "Финансы", score: 95, courses: 14 },
  { name: "Козлов Р.Е.", dept: "Производство", score: 93, courses: 20 },
  { name: "Иванов П.С.", dept: "HR & Dev", score: 87, courses: 12 },
  { name: "Сидорова Е.Н.", dept: "Юридический", score: 85, courses: 10 },
];

const maxBar = Math.max(...monthData);

export default function ReportsPage() {
  const [period, setPeriod] = useState("2026");

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Аналитика и отчёты</h1>
          <p className="text-sm text-muted-foreground mt-1">Данные по обучению сотрудников организации</p>
        </div>
        <div className="flex items-center gap-2">
          {["2024", "2025", "2026"].map(y => (
            <button key={y} onClick={() => setPeriod(y)}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                period === y ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border"
              }`}>
              {y}
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted border border-border rounded text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Download" size={12} /> Экспорт
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Охват обучением", val: "87%", delta: "+4%", icon: "Users", up: true },
          { label: "Средний балл", val: "84.3", delta: "+3.2", icon: "TrendingUp", up: true },
          { label: "Выдано сертификатов", val: "1 204", delta: "+187", icon: "Award", up: true },
          { label: "Не прошли аттестацию", val: "23", delta: "-11", icon: "AlertTriangle", up: false },
        ].map(k => (
          <div key={k.label} className="corp-card p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">{k.label}</span>
              <Icon name={k.icon} size={13} className="text-muted-foreground" />
            </div>
            <div className="stat-number text-xl">{k.val}</div>
            <div className={`text-xs font-mono mt-1 ${k.up ? "text-green-400" : "text-red-400"}`}>
              {k.delta} за год
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="corp-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Активность обучения по месяцам, {period}</h2>
        <div className="flex items-end gap-2 h-32">
          {monthData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-primary/20 rounded-sm relative overflow-hidden" style={{ height: `${(val / maxBar) * 112}px` }}>
                <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-sm" style={{ height: '100%', opacity: i <= 3 ? 1 : 0.35 }} />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{months[i]}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-primary rounded-sm"/><span className="text-xs text-muted-foreground">Факт {period}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-primary/35 rounded-sm"/><span className="text-xs text-muted-foreground">Прогноз</span></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* By department */}
        <div className="corp-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">По подразделениям</h2>
          <div className="space-y-3">
            {deptData.map(d => (
              <div key={d.dept}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-foreground">{d.dept}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">{d.completed}/{d.total}</span>
                    <span className="text-xs font-mono text-primary">{d.avg}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(d.completed / d.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="corp-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Рейтинг сотрудников</h2>
          <div className="space-y-2">
            {topEmployees.map((e, i) => (
              <div key={e.name} className={`flex items-center gap-3 p-2.5 rounded ${i === 3 ? "bg-primary/10 border border-primary/20" : ""}`}>
                <span className={`w-6 text-center text-xs font-mono font-bold ${i < 3 ? "text-yellow-400" : "text-muted-foreground"}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.dept} · {e.courses} курсов</div>
                </div>
                <span className="text-sm font-mono font-semibold text-primary">{e.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
