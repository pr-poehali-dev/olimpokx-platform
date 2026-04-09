import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { getExamHistory, getTrainerHistory, ExamResult, TrainerResult } from "@/lib/api";

const certs = [
  { title: "Противодействие коррупции", date: "02 мар 2026", exp: "02 мар 2027", id: "CERT-2026-0312" },
  { title: "Информационная безопасность", date: "14 фев 2026", exp: "14 фев 2027", id: "CERT-2026-0287" },
  { title: "Охрана труда и ТБ", date: "10 янв 2025", exp: "10 янв 2026", id: "CERT-2025-0091", expired: true },
  { title: "Деловая переписка", date: "22 ноя 2025", exp: "22 ноя 2026", id: "CERT-2025-0412" },
  { title: "Корпоративная культура", date: "05 сен 2025", exp: "05 сен 2026", id: "CERT-2025-0367" },
];

const skillRadar = [
  { skill: "Управление проектами", level: 72 },
  { skill: "Коммуникации", level: 88 },
  { skill: "Финансовая грамотность", level: 54 },
  { skill: "Информационная безопасность", level: 91 },
  { skill: "Охрана труда", level: 67 },
];

export default function ProfilePage() {
  const [examHistory, setExamHistory] = useState<ExamResult[]>([]);
  const [trainerHistory, setTrainerHistory] = useState<TrainerResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getExamHistory(), getTrainerHistory()])
      .then(([exams, trainers]) => {
        setExamHistory(exams);
        setTrainerHistory(trainers);
      })
      .finally(() => setLoading(false));
  }, []);

  const avgExamScore = examHistory.length > 0
    ? Math.round(examHistory.reduce((a, r) => a + r.score, 0) / examHistory.length)
    : null;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold text-foreground">Личный кабинет</h1>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="corp-card p-6">
          <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center mb-3">
              <span className="text-xl font-semibold font-mono text-primary">ИП</span>
            </div>
            <h2 className="text-base font-semibold text-foreground">Иванов Павел Сергеевич</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Ведущий специалист</p>
            <p className="text-xs text-muted-foreground">Отдел кадрового развития</p>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Табельный №", value: "00-4721", icon: "Hash" },
              { label: "Подразделение", value: "HR & Development", icon: "Building2" },
              { label: "Должность", value: "Ведущий специалист", icon: "Briefcase" },
              { label: "Дата найма", value: "15 марта 2019", icon: "Calendar" },
              { label: "Email", value: "ivanov.p@corp.ru", icon: "Mail" },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-2.5">
                <Icon name={r.icon} size={13} className="text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground flex-1">{r.label}</span>
                <span className="text-xs font-mono text-foreground">{r.value}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-5 border border-border text-foreground text-xs py-2 rounded hover:bg-muted transition-colors">
            Редактировать профиль
          </button>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Рейтинг", val: "#14", sub: "из 312", color: "text-orange-400" },
              { label: "Баллов XP", val: "4 820", sub: "за год", color: "text-primary" },
              { label: "Курсов пройдено", val: "12", sub: "из 24", color: "text-green-400" },
              { label: "Сертификатов", val: "4", sub: "действующих", color: "text-yellow-400" },
            ].map(s => (
              <div key={s.label} className="corp-card p-3 text-center">
                <div className={`text-xl font-mono font-semibold ${s.color}`}>{s.val}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="corp-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Компетенции</h2>
            <div className="space-y-3">
              {skillRadar.map(s => (
                <div key={s.skill}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-foreground">{s.skill}</span>
                    <span className="text-xs font-mono text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="corp-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Сертификаты</h2>
              <button className="text-xs text-primary hover:underline">Скачать все</button>
            </div>
            <div className="space-y-2">
              {certs.map(c => (
                <div key={c.id} className={`flex items-center gap-3 p-3 rounded border ${c.expired ? 'border-red-500/20 bg-red-500/5 opacity-60' : 'border-border bg-muted/30'}`}>
                  <Icon name="Award" size={14} className={c.expired ? "text-red-400" : "text-yellow-400"} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">{c.title}</div>
                    <div className="text-xs font-mono text-muted-foreground">{c.id} · до {c.exp}</div>
                  </div>
                  {c.expired ? (
                    <span className="corp-badge text-red-400">Истёк</span>
                  ) : (
                    <button className="text-xs text-primary hover:underline shrink-0">
                      <Icon name="Download" size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* History from DB */}
      {!loading && (examHistory.length > 0 || trainerHistory.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-5">
          {examHistory.length > 0 && (
            <div className="corp-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">История экзаменов</h2>
                {avgExamScore !== null && (
                  <span className="text-xs font-mono text-primary">Ср. балл: {avgExamScore}</span>
                )}
              </div>
              <div className="space-y-2">
                {examHistory.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                    <Icon name={r.passed ? "CheckCircle" : "XCircle"} size={13}
                      className={r.passed ? "text-green-400" : "text-red-400"} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{r.exam_title}</div>
                      <div className="text-xs font-mono text-muted-foreground">
                        {r.correct_count}/{r.total_questions} верных
                      </div>
                    </div>
                    <span className={`text-sm font-mono font-semibold ${r.passed ? "text-green-400" : "text-red-400"}`}>
                      {r.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {trainerHistory.length > 0 && (
            <div className="corp-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">История тренажёров</h2>
              <div className="space-y-2">
                {trainerHistory.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                    <Icon name="Dumbbell" size={13} className="text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{r.trainer_title}</div>
                      <div className="text-xs font-mono text-muted-foreground">
                        {r.correct_count}/{r.total_steps} заданий
                      </div>
                    </div>
                    <span className={`text-sm font-mono font-semibold ${r.score >= 75 ? "text-green-400" : "text-yellow-400"}`}>
                      {r.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}