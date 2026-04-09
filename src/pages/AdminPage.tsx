import { useState } from "react";
import Icon from "@/components/ui/icon";

const tabs = ["Пользователи", "Курсы", "Назначения", "Настройки"];

const users = [
  { name: "Смирнова А.В.", dept: "IT", role: "Сотрудник", status: "active", courses: 18, last: "Сегодня" },
  { name: "Петров Д.И.", dept: "Финансы", role: "Руководитель", status: "active", courses: 14, last: "Вчера" },
  { name: "Козлов Р.Е.", dept: "Производство", role: "Сотрудник", status: "active", courses: 20, last: "Сегодня" },
  { name: "Иванов П.С.", dept: "HR & Dev", role: "Сотрудник", status: "active", courses: 12, last: "Сегодня" },
  { name: "Новикова К.Т.", dept: "Юридический", role: "Сотрудник", status: "inactive", courses: 4, last: "2 нед. назад" },
  { name: "Морозов А.Д.", dept: "HR & Dev", role: "Методист", status: "active", courses: 0, last: "3 дня назад" },
];

const allCourses = [
  { title: "Охрана труда и ТБ", category: "Обязательный", enrolled: 891, published: true },
  { title: "Управление проектами", category: "Профессиональный", enrolled: 432, published: true },
  { title: "Деловая переписка", category: "Общий", enrolled: 1204, published: true },
  { title: "Финансовый анализ 2026", category: "Профессиональный", enrolled: 0, published: false },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Пользователи");
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-semibold text-foreground">Администрирование</h1>
          <span className="corp-badge bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">Админ</span>
        </div>
        <p className="text-sm text-muted-foreground">Управление пользователями, контентом и настройками платформы</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Пользователей", val: "312", icon: "Users" },
          { label: "Активных сейчас", val: "47", icon: "Activity" },
          { label: "Курсов опубликовано", val: "24", icon: "BookOpen" },
          { label: "Назначений", val: "1 884", icon: "ClipboardList" },
        ].map(s => (
          <div key={s.label} className="corp-card p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <Icon name={s.icon} size={14} className="text-primary" />
            </div>
            <div>
              <div className="font-mono font-semibold text-foreground">{s.val}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border mb-5">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Пользователи" && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по имени или отделу..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-muted border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs bg-primary text-white rounded hover:bg-primary/80 transition-colors">
              <Icon name="UserPlus" size={13} /> Добавить
            </button>
          </div>
          <div className="corp-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {["Сотрудник", "Отдел", "Роль", "Курсов", "Последняя активность", "Статус", ""].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary">
                          {u.name[0]}
                        </div>
                        <span className="font-medium text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.dept}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.role}</td>
                    <td className="px-4 py-3 text-xs font-mono text-foreground">{u.courses}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{u.last}</td>
                    <td className="px-4 py-3">
                      <span className={`corp-badge px-2 py-0.5 rounded border ${
                        u.status === "active"
                          ? "text-green-400 bg-green-500/10 border-green-500/20"
                          : "text-muted-foreground bg-muted border-border"
                      }`}>
                        {u.status === "active" ? "Активен" : "Неактивен"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Icon name="MoreHorizontal" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Курсы" && (
        <div>
          <div className="flex justify-end mb-4">
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs bg-primary text-white rounded hover:bg-primary/80 transition-colors">
              <Icon name="Plus" size={13} /> Создать курс
            </button>
          </div>
          <div className="corp-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {["Курс", "Категория", "Записано", "Статус", ""].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allCourses.map((c, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground text-sm">{c.title}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.category}</td>
                    <td className="px-4 py-3 text-xs font-mono text-foreground">{c.enrolled}</td>
                    <td className="px-4 py-3">
                      <span className={`corp-badge px-2 py-0.5 rounded border ${
                        c.published
                          ? "text-green-400 bg-green-500/10 border-green-500/20"
                          : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                      }`}>
                        {c.published ? "Опубликован" : "Черновик"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-primary hover:underline">Изменить</button>
                        <button className="text-xs text-muted-foreground hover:text-foreground">Удалить</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Назначения" && (
        <div className="corp-card p-8 text-center">
          <Icon name="ClipboardList" size={36} className="text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Управление назначением курсов по подразделениям и сотрудникам</p>
          <button className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/80 transition-colors">
            Создать назначение
          </button>
        </div>
      )}

      {activeTab === "Настройки" && (
        <div className="space-y-4">
          {[
            { label: "Название организации", value: "ОАО «Компания»", type: "text" },
            { label: "Email администратора", value: "admin@corp.ru", type: "text" },
            { label: "Срок действия сертификатов (мес.)", value: "12", type: "number" },
            { label: "Проходной балл по умолчанию (%)", value: "80", type: "number" },
          ].map(f => (
            <div key={f.label} className="corp-card p-4 flex items-center gap-4">
              <label className="text-sm text-muted-foreground w-64">{f.label}</label>
              <input
                type={f.type}
                defaultValue={f.value}
                className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
          <button className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/80 transition-colors">
            Сохранить настройки
          </button>
        </div>
      )}
    </div>
  );
}
