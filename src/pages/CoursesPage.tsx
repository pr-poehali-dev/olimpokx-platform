import { useState } from "react";
import Icon from "@/components/ui/icon";

const courses = [
  { id: 1, title: "Охрана труда и техника безопасности", category: "Обязательный", duration: "4 ч", modules: 6, status: "required", progress: 0, rating: 4.7, enrolled: 891 },
  { id: 2, title: "Управление проектами по стандарту PMBOk", category: "Профессиональный", duration: "12 ч", modules: 10, status: "in_progress", progress: 68, rating: 4.9, enrolled: 432 },
  { id: 3, title: "Деловая переписка и коммуникации", category: "Общий", duration: "3 ч", modules: 5, status: "completed", progress: 100, rating: 4.5, enrolled: 1204 },
  { id: 4, title: "Финансовая отчётность для руководителей", category: "Профессиональный", duration: "8 ч", modules: 8, status: "in_progress", progress: 24, rating: 4.6, enrolled: 287 },
  { id: 5, title: "Противодействие коррупции", category: "Обязательный", duration: "2 ч", modules: 4, status: "completed", progress: 100, rating: 4.3, enrolled: 1456 },
  { id: 6, title: "Информационная безопасность", category: "Обязательный", duration: "3 ч", modules: 5, status: "completed", progress: 100, rating: 4.8, enrolled: 1102 },
  { id: 7, title: "Корпоративная культура и этика", category: "Общий", duration: "2 ч", modules: 3, status: "not_started", progress: 0, rating: 4.4, enrolled: 756 },
  { id: 8, title: "Эффективные переговоры", category: "Профессиональный", duration: "6 ч", modules: 7, status: "not_started", progress: 0, rating: 4.7, enrolled: 341 },
];

const statusMap = {
  required: { label: "Обязателен к прохождению", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  in_progress: { label: "В процессе", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  completed: { label: "Пройден", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  not_started: { label: "Не начат", color: "text-muted-foreground bg-muted/50 border-border" },
};

const categories = ["Все", "Обязательный", "Профессиональный", "Общий"];

export default function CoursesPage() {
  const [filter, setFilter] = useState("Все");
  const [search, setSearch] = useState("");

  const filtered = courses.filter(c => {
    const matchCat = filter === "Все" || c.category === filter;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Учебные курсы</h1>
          <p className="text-sm text-muted-foreground mt-1">Каталог назначенных и доступных курсов</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="stat-number text-lg">{courses.filter(c => c.status === "completed").length}/{courses.length}</div>
          <div className="text-xs text-muted-foreground">пройдено</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-2 text-xs font-medium rounded border transition-colors ${
                filter === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-muted text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course list */}
      <div className="space-y-2">
        {filtered.map(course => {
          const st = statusMap[course.status];
          return (
            <div key={course.id} className="corp-card p-4 hover:border-primary/40 transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon name="BookOpen" size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground leading-snug">{course.title}</h3>
                    <span className={`corp-badge border px-2 py-0.5 rounded shrink-0 ${st.color}`}>{st.label}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Layers" size={11} /> {course.modules} модулей
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Clock" size={11} /> {course.duration}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Star" size={11} className="text-yellow-400" /> {course.rating}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Users" size={11} /> {course.enrolled}
                    </span>
                  </div>
                  {(course.status === "in_progress" || course.status === "completed") && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="progress-bar flex-1">
                        <div className="progress-fill" style={{ width: `${course.progress}%`, background: course.progress === 100 ? 'hsl(158,64%,40%)' : undefined }} />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-8 text-right">{course.progress}%</span>
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  <button className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    course.status === "completed"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
                      : course.status === "in_progress"
                        ? "bg-primary text-white hover:bg-primary/80"
                        : "bg-muted text-foreground border border-border hover:bg-secondary"
                  }`}>
                    {course.status === "completed" ? "Пройден" : course.status === "in_progress" ? "Продолжить" : "Начать"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
