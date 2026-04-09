import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface TrainerStep {
  id: number;
  type: "scenario" | "choice" | "input" | "info";
  title: string;
  description: string;
  hint?: string;
  options?: { text: string; correct: boolean; feedback: string }[];
  inputPrompt?: string;
  correctInput?: string;
  inputHint?: string;
}

interface TrainerConfig {
  id: number;
  title: string;
  category: string;
  icon: string;
  description: string;
  duration: string;
  steps: TrainerStep[];
}

interface TrainerModuleProps {
  config: TrainerConfig;
  onClose: () => void;
  onComplete: (score: number) => void;
}

type StepResult = { correct: boolean; answer: string };

const trainerData: Record<number, TrainerConfig> = {
  1: {
    id: 1,
    title: "Тренажёр по охране труда",
    category: "Безопасность",
    icon: "ShieldCheck",
    description: "Практические сценарии по технике безопасности на производстве",
    duration: "20 мин",
    steps: [
      {
        id: 1,
        type: "info",
        title: "Добро пожаловать в тренажёр",
        description: "Вы — сотрудник производственного цеха. В ходе тренажёра вы встретитесь с реальными ситуациями, требующими принятия решений по охране труда. Ваша задача — выбрать правильное действие в каждой ситуации.",
      },
      {
        id: 2,
        type: "scenario",
        title: "Ситуация 1: Неисправный станок",
        description: "Вы подходите к своему рабочему месту и замечаете, что защитный кожух токарного станка снят. Коллега говорит, что так быстрее и ничего страшного. До конца смены 4 часа.",
        options: [
          { text: "Согласиться с коллегой и начать работу", correct: false, feedback: "Неверно. Работа без защитного кожуха категорически запрещена — это прямая угроза для жизни." },
          { text: "Отказаться от работы и сообщить мастеру о нарушении", correct: true, feedback: "Правильно! Вы обязаны отказаться от небезопасной работы и уведомить непосредственного руководителя." },
          { text: "Самостоятельно установить кожух и начать работу", correct: false, feedback: "Неверно. Монтаж защитных устройств выполняется только уполномоченным персоналом, не самостоятельно." },
          { text: "Написать служебную записку и пока поработать", correct: false, feedback: "Неверно. Нельзя приступать к работе до устранения нарушения." },
        ],
        hint: "Подумайте: что важнее — скорость работы или безопасность жизни?",
      },
      {
        id: 3,
        type: "scenario",
        title: "Ситуация 2: Разлив химического вещества",
        description: "В лаборатории произошёл разлив реагента с резким запахом. Площадь пятна около 0,5 кв.м. Сигнализации не было, другие сотрудники продолжают работу.",
        options: [
          { text: "Быстро вытереть тряпкой и продолжить работу", correct: false, feedback: "Неверно. Без знания свойств вещества и СИЗ это опасно — возможны отравление и химический ожог." },
          { text: "Эвакуировать помещение, оповестить руководство, не трогать вещество", correct: true, feedback: "Правильно! При разливе неизвестного вещества — эвакуация и уведомление. Устранение только со знанием вещества и в СИЗ." },
          { text: "Открыть окна для проветривания и продолжить работу", correct: false, feedback: "Неверно. Проветривание не нейтрализует опасность разлитого вещества." },
          { text: "Надеть маску и самостоятельно ликвидировать разлив", correct: false, feedback: "Неверно. Без специальных СИЗ и знания вещества устранять разлив нельзя." },
        ],
        hint: "При работе с химическими веществами действует принцип: если сомневаешься — не трогай.",
      },
      {
        id: 4,
        type: "choice",
        title: "Проверка знаний: СИЗ",
        description: "При работе на высоте более 1,8 метра обязательно применение:",
        options: [
          { text: "Строительной каски", correct: false, feedback: "Каска защищает от падения предметов, но не страхует от падения работника." },
          { text: "Предохранительного пояса / страховочной привязи", correct: true, feedback: "Правильно! Страховочная привязь — обязательное СИЗ от падения при работе на высоте." },
          { text: "Нескользящей обуви", correct: false, feedback: "Обувь снижает риск скольжения, но не защищает при падении с высоты." },
          { text: "Сигнального жилета", correct: false, feedback: "Жилет обеспечивает видимость, но не защищает от падения." },
        ],
      },
      {
        id: 5,
        type: "scenario",
        title: "Ситуация 3: Травма коллеги",
        description: "Ваш коллега упал, сильно ударился головой, потерял сознание на несколько секунд. Сейчас в сознании, говорит, что всё нормально, и хочет продолжить работу.",
        options: [
          { text: "Согласиться, раз коллега говорит, что в порядке", correct: false, feedback: "Неверно. Потеря сознания после удара головой — повод для обязательного медицинского осмотра." },
          { text: "Вызвать скорую помощь и не позволить коллеге работать до осмотра врача", correct: true, feedback: "Правильно! Черепно-мозговая травма может проявиться не сразу. Медицинский осмотр обязателен." },
          { text: "Отвести коллегу в медпункт самостоятельно", correct: false, feedback: "При подозрении на ЧМТ нельзя транспортировать пострадавшего — нужна медицинская бригада." },
          { text: "Наблюдать за коллегой и при ухудшении вызвать скорую", correct: false, feedback: "Неверно. Ухудшение при ЧМТ может наступить внезапно — откладывать вызов нельзя." },
        ],
        hint: "Любая потеря сознания после травмы головы — медицинская ситуация, не бытовая.",
      },
      {
        id: 6,
        type: "info",
        title: "Итог тренажёра",
        description: "Вы завершили все ситуационные задачи. Помните: правила охраны труда написаны ценой жизней и здоровья людей. Их соблюдение — не формальность, а защита вас и ваших коллег.",
      },
    ],
  },
  2: {
    id: 2,
    title: "Деловая переписка",
    category: "Коммуникации",
    icon: "Mail",
    description: "Составление официальных писем, приказов и служебных записок",
    duration: "15 мин",
    steps: [
      {
        id: 1,
        type: "info",
        title: "Основы деловой переписки",
        description: "В тренажёре вы будете составлять реальные деловые документы: служебные записки, письма и ответы на запросы. Каждое задание оценивается по соответствию деловому стилю.",
      },
      {
        id: 2,
        type: "choice",
        title: "Задание 1: Структура делового письма",
        description: "Вам нужно ответить на письмо партнёра с запросом о переносе встречи. Какой из вариантов соответствует деловому стилю?",
        options: [
          { text: "«Привет! Конечно, перенесём. Напишите когда вам удобно»", correct: false, feedback: "Неверно. Обращение «Привет» неуместно в деловой переписке." },
          { text: "«Уважаемый Иван Петрович, сообщаем о готовности перенести встречу. Просим указать удобное время»", correct: true, feedback: "Правильно! Обращение по имени-отчеству, официальный тон, чёткая структура." },
          { text: "«Мы согласны на перенос»", correct: false, feedback: "Слишком коротко, нет обращения и предложения выбора даты." },
          { text: "«Добрый день! Да, хорошо, давайте перенесём, только напишите нам когда вам будет удобнее»", correct: false, feedback: "Разговорный стиль и небрежное оформление не соответствуют деловому формату." },
        ],
      },
      {
        id: 3,
        type: "scenario",
        title: "Задание 2: Служебная записка",
        description: "Вам необходимо написать служебную записку руководителю с просьбой о выделении компьютера для нового сотрудника. Какой элемент обязателен в служебной записке?",
        options: [
          { text: "Подпись автора, дата, должность и обоснование запроса", correct: true, feedback: "Правильно! Все реквизиты обязательны: кому, от кого, дата, суть вопроса, обоснование." },
          { text: "Только суть проблемы без формальностей", correct: false, feedback: "Без реквизитов документ не имеет юридической силы и не будет рассмотрен." },
          { text: "Печать организации на каждой странице", correct: false, feedback: "Внутренний документ не требует печати, но требует подписи и реквизитов." },
          { text: "Список приложений к документу", correct: false, feedback: "Список приложений нужен только при их наличии, а реквизиты — всегда." },
        ],
        hint: "Вспомните структуру любого официального документа: адресат, автор, дата, содержание.",
      },
      {
        id: 4,
        type: "choice",
        title: "Задание 3: Ошибки в письме",
        description: "Найдите грубую ошибку в деловом письме: «Уважаемые коллеги! В связи с производственной необходимостью просим Вас явиться на совещание в пятницу в 15:00. Явка строго обязательна для всех! Благодарю за понимание, Директор»",
        options: [
          { text: "Письмо слишком короткое", correct: false, feedback: "Краткость — не ошибка в деловом письме." },
          { text: "Не указана дата совещания (только день недели)", correct: true, feedback: "Верно! «Пятница» без конкретной даты — ошибка. Получатели могут неправильно понять, о какой именно пятнице речь." },
          { text: "Нельзя использовать слово «Благодарю»", correct: false, feedback: "Выражение благодарности уместно в деловом письме." },
          { text: "Слишком много восклицательных знаков", correct: false, feedback: "Восклицательный знак допустим, хотя и не обязателен." },
        ],
      },
      {
        id: 5,
        type: "info",
        title: "Тренажёр завершён",
        description: "Деловая переписка — лицо организации. Чёткость, вежливость и соблюдение реквизитов — три кита профессиональной коммуникации.",
      },
    ],
  },
  3: {
    id: 3,
    title: "Управление конфликтами",
    category: "Soft Skills",
    icon: "Users",
    description: "Разбор реальных конфликтных ситуаций в рабочей среде",
    duration: "25 мин",
    steps: [
      {
        id: 1,
        type: "info",
        title: "Управление конфликтами",
        description: "Конфликты — неотъемлемая часть рабочей жизни. Важно не избегать их, а уметь конструктивно разрешать. В этом тренажёре вы отработаете реальные сценарии.",
      },
      {
        id: 2,
        type: "scenario",
        title: "Ситуация: Конфликт с коллегой",
        description: "Коллега публично обвинил вас в срыве дедлайна на совещании, хотя часть задержки произошла по его вине. Руководитель смотрит на вас, ожидая реакции.",
        options: [
          { text: "Немедленно ответить и перечислить все ошибки коллеги публично", correct: false, feedback: "Публичная атака усилит конфликт и покажет неумение управлять эмоциями." },
          { text: "Спокойно заявить факты: «Давайте разберём детально после совещания»", correct: true, feedback: "Правильно! Вы не уходите от конфликта, но переносите его разбор в конструктивное русло." },
          { text: "Промолчать и потом пожаловаться руководителю", correct: false, feedback: "Молчание в момент публичного обвинения может быть воспринято как согласие с ним." },
          { text: "Извиниться, чтобы разрядить напряжение", correct: false, feedback: "Извинение за то, в чём вы не виноваты, подрывает вашу профессиональную репутацию." },
        ],
        hint: "Публичное пространство — не место для разбора конфликтов.",
      },
      {
        id: 3,
        type: "choice",
        title: "Техника «Я-высказывания»",
        description: "Какой вариант соответствует технике «Я-высказывания» при выражении претензии?",
        options: [
          { text: "«Ты всегда срываешь сроки и мешаешь работать»", correct: false, feedback: "«Ты-высказывание» вызывает защитную реакцию и эскалирует конфликт." },
          { text: "«Когда отчёт приходит после дедлайна, я не успеваю его обработать и это влияет на весь проект»", correct: true, feedback: "Правильно! Описание факта → ваше ощущение → последствие. Без обвинений." },
          { text: "«Это неприемлемо и так продолжаться не может»", correct: false, feedback: "Оценочное суждение без описания конкретной ситуации." },
          { text: "«Все в команде недовольны вашей работой»", correct: false, feedback: "Ссылка на «всех» без фактов — манипуляция, а не конструктив." },
        ],
      },
      {
        id: 4,
        type: "info",
        title: "Тренажёр завершён",
        description: "Ключ к управлению конфликтами: разделять факты и эмоции, говорить от первого лица, искать решение, а не виноватого. Эти навыки приходят с практикой.",
      },
    ],
  },
  4: {
    id: 4,
    title: "Финансовый анализ",
    category: "Финансы",
    icon: "Calculator",
    description: "Практические задания по чтению балансовых отчётов",
    duration: "20 мин",
    steps: [
      {
        id: 1,
        type: "info",
        title: "Основы финансового анализа",
        description: "В этом тренажёре вы научитесь читать ключевые финансовые показатели и принимать обоснованные управленческие решения на основе данных отчётности.",
      },
      {
        id: 2,
        type: "choice",
        title: "Ликвидность предприятия",
        description: "Текущие активы компании: 5 млн руб. Текущие обязательства: 3 млн руб. Коэффициент текущей ликвидности равен:",
        options: [
          { text: "1,67 — платёжеспособность нормальная", correct: true, feedback: "Правильно! КТЛ = 5/3 ≈ 1,67. Норма ≥ 1,5 означает, что компания может покрыть краткосрочные долги." },
          { text: "0,6 — риск неплатёжеспособности", correct: false, feedback: "Неверный расчёт. КТЛ = Текущие активы / Текущие обязательства = 5/3 = 1,67." },
          { text: "3,5 — избыток оборотных средств", correct: false, feedback: "Неверный расчёт. 3,5 означало бы, что активы в 3,5 раза превышают обязательства." },
          { text: "8 — компания нерационально использует активы", correct: false, feedback: "Неверный расчёт." },
        ],
        hint: "КТЛ = Текущие активы ÷ Текущие обязательства",
      },
      {
        id: 3,
        type: "scenario",
        title: "Анализ рентабельности",
        description: "Выручка компании за квартал: 12 млн руб. Чистая прибыль: 1,8 млн руб. Как называется этот показатель и каково его значение?",
        options: [
          { text: "Рентабельность продаж = 15% — хороший результат для промышленности", correct: true, feedback: "Правильно! ROS = Прибыль/Выручка × 100 = 1,8/12 × 100 = 15%. Средний показатель для производственных предприятий." },
          { text: "Рентабельность активов = 15% — компания эффективна", correct: false, feedback: "ROA считается иначе: Прибыль/Активы. Здесь у нас нет данных об активах." },
          { text: "Валовая маржа = 6,7%", correct: false, feedback: "Неверный расчёт. Валовая маржа считается иначе и требует данных о себестоимости." },
          { text: "Точка безубыточности = 15 млн руб.", correct: false, feedback: "Точка безубыточности — это объём продаж при нулевой прибыли, не отношение прибыли к выручке." },
        ],
      },
      {
        id: 4,
        type: "info",
        title: "Тренажёр завершён",
        description: "Три ключевых показателя для быстрой оценки компании: ликвидность (можем платить?), рентабельность (зарабатываем?), долговая нагрузка (выдержим обязательства?).",
      },
    ],
  },
};

export default function TrainerModule({ config, onClose, onComplete }: TrainerModuleProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [results, setResults] = useState<Record<number, StepResult>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [phase, setPhase] = useState<"trainer" | "complete">("trainer");
  const [elapsed, setElapsed] = useState(0);

  const step = config.steps[stepIdx];
  const totalSteps = config.steps.length;
  const interactiveSteps = config.steps.filter(s => s.type !== "info");

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const confirmAnswer = () => {
    if (selected === null) return;
    const opt = step.options![selected];
    setResults(r => ({ ...r, [stepIdx]: { correct: opt.correct, answer: opt.text } }));
    setAnswered(true);
  };

  const next = () => {
    if (stepIdx < totalSteps - 1) {
      setStepIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
      setShowHint(false);
    } else {
      const correct = Object.values(results).filter(r => r.correct).length;
      const score = interactiveSteps.length > 0
        ? Math.round((correct / interactiveSteps.length) * 100)
        : 100;
      onComplete(score);
      setPhase("complete");
    }
  };

  const correctCount = Object.values(results).filter(r => r.correct).length;
  const finalScore = interactiveSteps.length > 0
    ? Math.round((correctCount / interactiveSteps.length) * 100)
    : 100;

  const progressPct = ((stepIdx + 1) / totalSteps) * 100;

  if (phase === "complete") {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-md corp-card p-8 text-center">
          <div className={`w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center mb-4 ${
            finalScore >= 75
              ? "border-green-500/50 bg-green-500/10"
              : "border-yellow-500/50 bg-yellow-500/10"
          }`}>
            <span className={`text-3xl font-mono font-bold ${finalScore >= 75 ? "text-green-400" : "text-yellow-400"}`}>
              {finalScore}%
            </span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Тренажёр завершён!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {finalScore >= 75
              ? "Отличный результат! Материал усвоен хорошо."
              : "Рекомендуем повторить материал и пройти тренажёр ещё раз."}
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Верных", val: `${correctCount}/${interactiveSteps.length}`, color: "text-green-400" },
              { label: "Результат", val: `${finalScore}%`, color: finalScore >= 75 ? "text-green-400" : "text-yellow-400" },
              { label: "Время", val: formatTime(elapsed), color: "text-primary" },
            ].map(s => (
              <div key={s.label} className="bg-muted/50 border border-border rounded p-3">
                <div className={`text-lg font-mono font-semibold ${s.color}`}>{s.val}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setStepIdx(0);
                setResults({});
                setSelected(null);
                setAnswered(false);
                setPhase("trainer");
                setElapsed(0);
              }}
              className="flex-1 border border-border text-foreground py-2.5 rounded text-sm hover:bg-muted transition-colors"
            >
              Повторить
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-primary text-white py-2.5 rounded text-sm font-semibold hover:bg-primary/80 transition-colors"
            >
              Завершить
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">{stepIdx + 1}/{totalSteps}</span>
          <span className="text-xs font-mono text-primary">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex-1 overflow-auto flex items-start justify-center p-6">
        <div className="w-full max-w-2xl">

          {/* Step type badge */}
          <div className="flex items-center gap-2 mb-5">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium ${
              step.type === "info"
                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                : step.type === "scenario"
                  ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                  : "bg-primary/10 border-primary/20 text-primary"
            }`}>
              <Icon name={
                step.type === "info" ? "Info" :
                step.type === "scenario" ? "AlertTriangle" : "HelpCircle"
              } size={11} />
              {step.type === "info" ? "Информация" : step.type === "scenario" ? "Сценарий" : "Вопрос"}
            </div>
            <span className="text-xs text-muted-foreground">Шаг {stepIdx + 1} из {totalSteps}</span>
          </div>

          {/* Content */}
          <h2 className="text-xl font-semibold text-foreground mb-3">{step.title}</h2>
          <p className="text-sm text-foreground/80 leading-relaxed mb-6">{step.description}</p>

          {/* Options */}
          {step.type !== "info" && step.options && (
            <>
              <div className="space-y-2.5 mb-4">
                {step.options.map((opt, i) => {
                  let cls = "border-border bg-muted/30 text-foreground hover:border-primary/40 cursor-pointer";
                  if (answered) {
                    if (opt.correct) cls = "border-green-500/50 bg-green-500/10 text-green-300 cursor-default";
                    else if (selected === i) cls = "border-red-500/50 bg-red-500/10 text-red-300 cursor-default";
                    else cls = "border-border bg-muted/20 text-muted-foreground cursor-default";
                  } else if (selected === i) {
                    cls = "border-primary bg-primary/10 text-foreground cursor-pointer";
                  }

                  return (
                    <button
                      key={i}
                      disabled={answered}
                      onClick={() => !answered && setSelected(i)}
                      className={`w-full flex items-start gap-3 p-4 rounded border text-left transition-all ${cls}`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 ${
                        answered && opt.correct
                          ? "border-green-500 bg-green-500/20 text-green-400"
                          : answered && selected === i && !opt.correct
                            ? "border-red-500 bg-red-500/20 text-red-400"
                            : selected === i
                              ? "border-primary bg-primary/20 text-primary"
                              : "border-border text-muted-foreground"
                      }`}>
                        {answered && opt.correct
                          ? <Icon name="Check" size={11} />
                          : answered && selected === i && !opt.correct
                            ? <Icon name="X" size={11} />
                            : String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-sm leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {answered && selected !== null && (
                <div className={`p-4 rounded border mb-4 ${
                  step.options[selected].correct
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon
                      name={step.options[selected].correct ? "CheckCircle" : "XCircle"}
                      size={14}
                      className={step.options[selected].correct ? "text-green-400" : "text-red-400"}
                    />
                    <span className={`text-sm font-semibold ${step.options[selected].correct ? "text-green-400" : "text-red-400"}`}>
                      {step.options[selected].correct ? "Правильно!" : "Неверно"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.options[selected].feedback}
                  </p>
                </div>
              )}

              {/* Hint */}
              {step.hint && !answered && (
                <div>
                  {showHint ? (
                    <div className="p-3 rounded border border-yellow-500/20 bg-yellow-500/5 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name="Lightbulb" size={12} className="text-yellow-400" />
                        <span className="text-xs font-medium text-yellow-400">Подсказка</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{step.hint}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-yellow-400 transition-colors mb-4"
                    >
                      <Icon name="Lightbulb" size={12} /> Показать подсказку
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => stepIdx > 0 && setStepIdx(i => i - 1)}
              disabled={stepIdx === 0}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              <Icon name="ChevronLeft" size={15} /> Назад
            </button>

            {step.type === "info" ? (
              <button
                onClick={next}
                className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/80 transition-colors flex items-center gap-2"
              >
                {stepIdx < totalSteps - 1 ? "Далее" : "Завершить тренажёр"}
                <Icon name="ChevronRight" size={14} />
              </button>
            ) : !answered ? (
              <button
                onClick={confirmAnswer}
                disabled={selected === null}
                className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/80 transition-colors disabled:opacity-40"
              >
                Подтвердить
              </button>
            ) : (
              <button
                onClick={next}
                className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/80 transition-colors flex items-center gap-2"
              >
                {stepIdx < totalSteps - 1 ? "Следующий шаг" : "Завершить тренажёр"}
                <Icon name="ChevronRight" size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { trainerData };
