import { useState } from "react";
import Icon from "@/components/ui/icon";
import ExamModule from "@/components/ExamModule";

const exams = [
  { id: 1, title: "Охрана труда 2026", course: "Охрана труда", date: "15 апр 2026", duration: "45 мин", questions: 10, attempts: 2, maxAttempts: 3, status: "available", score: null, passing: 80 },
  { id: 2, title: "Итоговый: Управление проектами", course: "Управление проектами", date: "28 апр 2026", duration: "90 мин", questions: 60, attempts: 0, maxAttempts: 2, status: "scheduled", score: null, passing: 75 },
  { id: 3, title: "Противодействие коррупции", course: "Антикоррупционный", date: "02 мар 2026", duration: "45 мин", questions: 30, attempts: 1, maxAttempts: 3, status: "passed", score: 94, passing: 80 },
  { id: 4, title: "Информационная безопасность", course: "ИБ основы", date: "14 фев 2026", duration: "45 мин", questions: 35, attempts: 2, maxAttempts: 3, status: "passed", score: 88, passing: 80 },
  { id: 5, title: "Пожарная безопасность", course: "Пожарная безопасность", date: "05 мая 2026", duration: "30 мин", questions: 25, attempts: 0, maxAttempts: 3, status: "locked", score: null, passing: 80 },
];

const statusMap = {
  scheduled: { label: "Запланирован", icon: "Calendar", color: "text-blue-400" },
  available: { label: "Доступен", icon: "PlayCircle", color: "text-green-400" },
  passed: { label: "Сдан", icon: "CheckCircle", color: "text-green-400" },
  failed: { label: "Не сдан", icon: "XCircle", color: "text-red-400" },
  locked: { label: "Недоступен", icon: "Lock", color: "text-muted-foreground" },
};

export default function ExamsPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [examOpen, setExamOpen] = useState(false);

  const selectedExam = exams.find(e => e.id === selected);

  return (
    <>
      {examOpen && (
        <ExamModule onClose={() => setExamOpen(false)} />
      )}

      <div className="p-6 animate-fade-in">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-foreground">Экзамены</h1>
          <p className="text-sm text-muted-foreground mt-1">Аттестация и контрольные проверки знаний</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Сдано", val: exams.filter(e => e.status === "passed").length, color: "text-green-400" },
            { label: "Предстоит", val: exams.filter(e => e.status === "scheduled" || e.status === "available").length, color: "text-blue-400" },
            { label: "Средний балл", val: Math.round(exams.filter(e => e.score).reduce((a, c) => a + (c.score || 0), 0) / exams.filter(e => e.score).length), color: "text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="corp-card p-4 text-center">
              <div className={`text-2xl font-mono font-semibold ${s.color}`}>{s.val}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Exam list */}
          <div className="lg:col-span-2 space-y-2">
            {exams.map(exam => {
              const st = statusMap[exam.status];
              const isSelected = selected === exam.id;
              return (
                <div
                  key={exam.id}
                  onClick={() => setSelected(isSelected ? null : exam.id)}
                  className={`corp-card p-4 cursor-pointer transition-all ${isSelected ? "border-primary/50 bg-primary/5" : "hover:border-border/80"}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon name={st.icon} size={16} className={`${st.color} mt-0.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{exam.title}</h3>
                        {exam.score && (
                          <span className={`font-mono text-sm font-semibold shrink-0 ${exam.score >= exam.passing ? "text-green-400" : "text-red-400"}`}>
                            {exam.score}/100
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{exam.course}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs font-mono text-muted-foreground">{exam.date}</span>
                        <span className="text-xs text-muted-foreground">{exam.duration}</span>
                        <span className="text-xs text-muted-foreground">{exam.questions} вопросов</span>
                        <span className={`corp-badge ${st.color}`}>{st.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="corp-card p-5">
            {selectedExam ? (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">{selectedExam.title}</h2>
                <div className="space-y-3">
                  {[
                    { label: "Дисциплина", value: selectedExam.course },
                    { label: "Дата проведения", value: selectedExam.date },
                    { label: "Продолжительность", value: selectedExam.duration },
                    { label: "Кол-во вопросов", value: `${selectedExam.questions}` },
                    { label: "Проходной балл", value: `${selectedExam.passing}%` },
                    { label: "Попытки", value: `${selectedExam.attempts} / ${selectedExam.maxAttempts}` },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center py-1.5 border-b border-border/50">
                      <span className="text-xs text-muted-foreground">{r.label}</span>
                      <span className="text-xs font-mono text-foreground">{r.value}</span>
                    </div>
                  ))}
                </div>
                {selectedExam.score && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-3 text-center">
                    <div className="text-2xl font-mono font-semibold text-green-400">{selectedExam.score}</div>
                    <div className="text-xs text-green-400/80 mt-0.5">баллов — Сдан</div>
                  </div>
                )}
                {selectedExam.status === "available" && (
                  <button
                    onClick={() => setExamOpen(true)}
                    className="w-full bg-primary text-white py-2.5 rounded text-sm font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="Play" size={14} />
                    Начать экзамен
                  </button>
                )}
                {selectedExam.status === "passed" && (
                  <button className="w-full bg-muted text-foreground py-2.5 rounded text-sm font-medium border border-border hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                    <Icon name="Download" size={14} />
                    Скачать сертификат
                  </button>
                )}
                {selectedExam.status === "scheduled" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 border border-border rounded p-2.5">
                    <Icon name="Calendar" size={12} />
                    Экзамен откроется {selectedExam.date}
                  </div>
                )}
                {selectedExam.status === "locked" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 border border-border rounded p-2.5">
                    <Icon name="Lock" size={12} />
                    Сначала завершите соответствующий курс
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <Icon name="ClipboardCheck" size={32} className="text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">Выберите экзамен для просмотра деталей</p>
                <p className="text-xs text-muted-foreground mt-1">Первый в списке — уже доступен</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
