import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ExamConfig {
  title: string;
  subject: string;
  duration: number; // seconds
  passingScore: number;
  questions: Question[];
}

interface ExamModuleProps {
  config: ExamConfig;
  onClose: () => void;
}

type ExamPhase = "intro" | "exam" | "result";

const defaultExam: ExamConfig = {
  title: "Охрана труда и техника безопасности 2026",
  subject: "Охрана труда",
  duration: 45 * 60,
  passingScore: 80,
  questions: [
    {
      id: 1,
      text: "Что необходимо сделать работнику при обнаружении неисправности оборудования?",
      options: [
        "Продолжить работу и сообщить о неисправности в конце смены",
        "Немедленно прекратить работу, отключить оборудование и сообщить руководителю",
        "Попытаться самостоятельно устранить неисправность",
        "Перейти на другое рабочее место",
      ],
      correct: 1,
      explanation: "Работник обязан немедленно прекратить работу при обнаружении неисправности, так как продолжение может привести к травме. Самостоятельный ремонт без допуска запрещён.",
    },
    {
      id: 2,
      text: "Какой инструктаж проводится при переводе работника на другую работу?",
      options: [
        "Вводный инструктаж",
        "Первичный инструктаж на рабочем месте",
        "Внеплановый инструктаж",
        "Целевой инструктаж",
      ],
      correct: 1,
      explanation: "При переводе на другую работу проводится первичный инструктаж на рабочем месте, так как работник знакомится с новыми условиями труда.",
    },
    {
      id: 3,
      text: "Через какое время после начала работы проводится повторный инструктаж по охране труда?",
      options: [
        "Не реже одного раза в квартал",
        "Не реже одного раза в полугодие",
        "Не реже одного раза в год",
        "По мере необходимости",
      ],
      correct: 1,
      explanation: "Повторный инструктаж проводится не реже одного раза в шесть месяцев для всех работников, кроме тех, кто выполняет работы повышенной опасности.",
    },
    {
      id: 4,
      text: "Что такое производственная травма?",
      options: [
        "Любое повреждение здоровья работника",
        "Травма, полученная только на рабочем месте в рабочее время",
        "Повреждение здоровья, полученное вследствие воздействия производственных факторов",
        "Травма, зафиксированная в медицинских документах",
      ],
      correct: 2,
      explanation: "Производственная травма — повреждение здоровья вследствие воздействия вредных и опасных производственных факторов при исполнении трудовых обязанностей.",
    },
    {
      id: 5,
      text: "Кто несёт ответственность за обеспечение безопасных условий труда на предприятии?",
      options: [
        "Только работники службы охраны труда",
        "Только непосредственный руководитель работника",
        "Работодатель и должностные лица в пределах их полномочий",
        "Сами работники",
      ],
      correct: 2,
      explanation: "Ответственность за обеспечение безопасных условий труда возлагается на работодателя и уполномоченных им должностных лиц в пределах их полномочий.",
    },
    {
      id: 6,
      text: "При каком значении уровня шума обязательно применение СИЗ органов слуха?",
      options: [
        "Свыше 70 дБА",
        "Свыше 75 дБА",
        "Свыше 80 дБА",
        "Свыше 85 дБА",
      ],
      correct: 2,
      explanation: "Средства индивидуальной защиты органов слуха обязательны при уровне шума свыше 80 дБА на рабочем месте.",
    },
    {
      id: 7,
      text: "Как должны храниться легковоспламеняющиеся жидкости (ЛВЖ) на рабочем месте?",
      options: [
        "В любых закрытых ёмкостях",
        "В специальных металлических шкафах в количестве, не превышающем сменную потребность",
        "В пластиковой таре с плотной крышкой",
        "На открытых стеллажах в прохладном месте",
      ],
      correct: 1,
      explanation: "ЛВЖ на рабочем месте допускается хранить в специальных металлических шкафах в количестве, не превышающем суточную или сменную потребность.",
    },
    {
      id: 8,
      text: "Что такое вводный инструктаж по охране труда?",
      options: [
        "Инструктаж, проводимый непосредственным руководителем на рабочем месте",
        "Инструктаж, проводимый специалистом по ОТ при поступлении на работу",
        "Инструктаж при выполнении разовых работ повышенной опасности",
        "Плановый инструктаж раз в полгода",
      ],
      correct: 1,
      explanation: "Вводный инструктаж проводит специалист по охране труда со всеми лицами, поступающими на работу, до начала их трудовой деятельности.",
    },
    {
      id: 9,
      text: "Какое действие следует выполнить в первую очередь при возникновении пожара?",
      options: [
        "Попытаться потушить огонь самостоятельно",
        "Покинуть здание через ближайший выход",
        "Сообщить о пожаре по телефону 101 и руководству, затем эвакуироваться",
        "Собрать личные вещи и документы",
      ],
      correct: 2,
      explanation: "При пожаре необходимо: сообщить по телефону 101, оповестить работников, эвакуироваться в соответствии с планом. Тушить следует только если это не угрожает жизни.",
    },
    {
      id: 10,
      text: "С какой периодичностью проводится специальная оценка условий труда (СОУТ)?",
      options: [
        "Ежегодно",
        "Не реже одного раза в 3 года",
        "Не реже одного раза в 5 лет",
        "По требованию работника",
      ],
      correct: 2,
      explanation: "СОУТ проводится не реже одного раза в 5 лет. Внеплановая СОУТ проводится при изменении условий труда, после несчастных случаев и в других предусмотренных законом случаях.",
    },
  ],
};

export default function ExamModule({ config = defaultExam, onClose }: ExamModuleProps) {
  const [phase, setPhase] = useState<ExamPhase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [showExplanation, setShowExplanation] = useState(false);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  const q = config.questions[current];
  const totalQ = config.questions.length;

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;
    if (timeLeft <= 0) { setPhase("result"); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const confirmAnswer = useCallback(() => {
    if (selected === null) return;
    setAnswers(a => ({ ...a, [current]: selected }));
    setConfirmed(true);
    setShowExplanation(true);
  }, [selected, current]);

  const nextQuestion = () => {
    setSelected(null);
    setConfirmed(false);
    setShowExplanation(false);
    if (current < totalQ - 1) {
      setCurrent(c => c + 1);
    } else {
      setPhase("result");
    }
  };

  const goTo = (idx: number) => {
    if (confirmed || answers[current] !== undefined) {
      setSelected(null);
      setConfirmed(false);
      setShowExplanation(false);
      setCurrent(idx);
    }
  };

  const score = () => {
    const correct = Object.entries(answers).filter(
      ([idx, ans]) => config.questions[Number(idx)].correct === ans
    ).length;
    return Math.round((correct / totalQ) * 100);
  };

  const correctCount = () =>
    Object.entries(answers).filter(
      ([idx, ans]) => config.questions[Number(idx)].correct === ans
    ).length;

  const timerColor = timeLeft < 300 ? "text-red-400" : timeLeft < 600 ? "text-yellow-400" : "text-foreground";
  const answered = Object.keys(answers).length;

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-lg corp-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded flex items-center justify-center">
              <Icon name="ClipboardCheck" size={18} className="text-primary" />
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="X" size={18} />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-1">{config.title}</h2>
          <p className="text-sm text-muted-foreground mb-6">{config.subject}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: "HelpCircle", label: "Вопросов", val: `${totalQ}` },
              { icon: "Clock", label: "Время", val: formatTime(config.duration) },
              { icon: "Target", label: "Проходной балл", val: `${config.passingScore}%` },
              { icon: "RefreshCw", label: "Попытки", val: "2 / 3" },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-3 bg-muted/50 border border-border rounded p-3">
                <Icon name={r.icon} size={14} className="text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">{r.label}</div>
                  <div className="text-sm font-mono font-semibold text-foreground">{r.val}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 mb-6">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={13} className="text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-xs text-yellow-400/90">После начала экзамена таймер не останавливается. Убедитесь, что у вас есть свободное время для прохождения.</p>
            </div>
          </div>
          <button
            onClick={() => setPhase("exam")}
            className="w-full bg-primary text-white py-3 rounded font-semibold text-sm hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="Play" size={15} />
            Начать экзамен
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (phase === "result") {
    const finalScore = score();
    const passed = finalScore >= config.passingScore;
    const correct = correctCount();

    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-2xl corp-card p-8">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center mb-4 ${
              passed ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"
            }`}>
              <span className={`text-3xl font-mono font-bold ${passed ? "text-green-400" : "text-red-400"}`}>
                {finalScore}
              </span>
            </div>
            <h2 className={`text-xl font-semibold mb-1 ${passed ? "text-green-400" : "text-red-400"}`}>
              {passed ? "Экзамен сдан!" : "Экзамен не сдан"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {passed
                ? "Поздравляем! Сертификат будет доступен в личном кабинете."
                : `Для прохождения необходимо набрать ${config.passingScore}%. Попробуйте ещё раз.`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Правильных", val: `${correct}/${totalQ}`, color: "text-green-400" },
              { label: "Неверных", val: `${totalQ - correct}`, color: "text-red-400" },
              { label: "Время", val: formatTime(config.duration - timeLeft), color: "text-primary" },
            ].map(s => (
              <div key={s.label} className="bg-muted/50 border border-border rounded p-3 text-center">
                <div className={`text-xl font-mono font-semibold ${s.color}`}>{s.val}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Answer review */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 mb-6 pr-1">
            {config.questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correct;
              return (
                <div key={q.id} className={`flex items-start gap-2.5 p-2.5 rounded border text-xs ${
                  isCorrect ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
                }`}>
                  <Icon name={isCorrect ? "CheckCircle" : "XCircle"} size={13}
                    className={`${isCorrect ? "text-green-400" : "text-red-400"} shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground font-medium truncate">В{i + 1}. {q.text}</div>
                    {!isCorrect && userAns !== undefined && (
                      <div className="text-muted-foreground mt-0.5">
                        Ваш ответ: <span className="text-red-400">{q.options[userAns]}</span> →{" "}
                        Правильно: <span className="text-green-400">{q.options[q.correct]}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            {passed ? (
              <button className="flex-1 bg-green-600 text-white py-2.5 rounded font-semibold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Icon name="Download" size={14} />
                Скачать сертификат
              </button>
            ) : (
              <button
                onClick={() => {
                  setPhase("intro");
                  setCurrent(0);
                  setAnswers({});
                  setSelected(null);
                  setConfirmed(false);
                  setTimeLeft(config.duration);
                  setFlagged(new Set());
                }}
                className="flex-1 bg-primary text-white py-2.5 rounded font-semibold text-sm hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="RefreshCw" size={14} />
                Пройти ещё раз
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 border border-border text-foreground py-2.5 rounded text-sm hover:bg-muted transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── EXAM ──
  const isAnswered = answers[current] !== undefined;
  const isCorrect = confirmed && selected === q.correct;
  const isWrong = confirmed && selected !== q.correct;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border bg-card/80">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="X" size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-foreground truncate">{config.title}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground">
            {answered}/{totalQ} отвечено
          </div>
          <div className={`font-mono text-lg font-semibold tabular-nums ${timerColor}`}>
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setPhase("result")}
            className="px-3 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary/80 transition-colors"
          >
            Завершить
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question nav sidebar */}
        <div className="hidden lg:flex flex-col w-52 border-r border-border bg-card/50 p-3 overflow-y-auto">
          <div className="text-xs text-muted-foreground font-medium mb-2 px-1">Вопросы</div>
          <div className="grid grid-cols-5 gap-1">
            {config.questions.map((_, i) => {
              const ans = answers[i];
              const isCur = i === current;
              const isAns = ans !== undefined;
              const isCor = isAns && config.questions[i].correct === ans;
              const isFlag = flagged.has(i);
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-8 h-8 text-xs font-mono rounded transition-all ${
                    isCur
                      ? "bg-primary text-white"
                      : isAns
                        ? isCor
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                        : isFlag
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-muted text-muted-foreground border border-border hover:border-primary/40"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary" /> Текущий</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500/30 border border-green-500/40" /> Верно</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/40" /> Неверно</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-muted border border-border" /> Не отвечено</div>
          </div>
        </div>

        {/* Main question area */}
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 px-6 py-6 max-w-3xl mx-auto w-full">
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-muted-foreground">Вопрос {current + 1} из {totalQ}</span>
              <button
                onClick={() => setFlagged(f => {
                  const n = new Set(f);
                  if (n.has(current)) { n.delete(current); } else { n.add(current); }
                  return n;
                })}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  flagged.has(current) ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-400"
                }`}
              >
                <Icon name="Flag" size={12} />
                {flagged.has(current) ? "Отмечен" : "Отметить"}
              </button>
            </div>
            <div className="progress-bar mb-6">
              <div className="progress-fill" style={{ width: `${((current + 1) / totalQ) * 100}%` }} />
            </div>

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-foreground leading-relaxed">{q.text}</h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-6">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrectOpt = i === q.correct;
                let cls = "border-border bg-muted/30 text-foreground hover:border-primary/40";
                if (confirmed) {
                  if (isCorrectOpt) cls = "border-green-500/50 bg-green-500/10 text-green-300";
                  else if (isSelected && !isCorrectOpt) cls = "border-red-500/50 bg-red-500/10 text-red-300";
                  else cls = "border-border bg-muted/20 text-muted-foreground";
                } else if (isSelected) {
                  cls = "border-primary bg-primary/10 text-foreground";
                }

                return (
                  <button
                    key={i}
                    disabled={confirmed || isAnswered}
                    onClick={() => !confirmed && !isAnswered && setSelected(i)}
                    className={`w-full flex items-start gap-3 p-3.5 rounded border text-left transition-all ${cls} ${
                      !confirmed && !isAnswered ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded border flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 ${
                      confirmed && isCorrectOpt
                        ? "border-green-500 bg-green-500/20 text-green-400"
                        : confirmed && isSelected && !isCorrectOpt
                          ? "border-red-500 bg-red-500/20 text-red-400"
                          : isSelected
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-border text-muted-foreground"
                    }`}>
                      {confirmed && isCorrectOpt
                        ? <Icon name="Check" size={11} />
                        : confirmed && isSelected && !isCorrectOpt
                          ? <Icon name="X" size={11} />
                          : String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`p-4 rounded border mb-4 ${isCorrect ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={isCorrect ? "CheckCircle" : "XCircle"} size={14} className={isCorrect ? "text-green-400" : "text-red-400"} />
                  <span className={`text-sm font-semibold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                    {isCorrect ? "Верно!" : "Неверно"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="sticky bottom-0 border-t border-border bg-card/80 backdrop-blur px-6 py-3 flex items-center justify-between gap-3">
            <button
              onClick={() => current > 0 && goTo(current - 1)}
              disabled={current === 0}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              <Icon name="ChevronLeft" size={15} /> Назад
            </button>

            {!confirmed && !isAnswered ? (
              <button
                onClick={confirmAnswer}
                disabled={selected === null}
                className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/80 transition-colors disabled:opacity-40"
              >
                Подтвердить ответ
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/80 transition-colors flex items-center gap-2"
              >
                {current < totalQ - 1 ? "Следующий вопрос" : "Завершить экзамен"}
                <Icon name="ChevronRight" size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}