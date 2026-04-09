import { useState } from "react";
import Icon from "@/components/ui/icon";

const contacts = [
  { name: "Морозов Алексей Дмитриевич", role: "Методист по обучению", dept: "HR & Development", email: "morozov.a@corp.ru", phone: "+7 (495) 123-45-01", avatar: "МА" },
  { name: "Воробьёва Наталья Ивановна", role: "Куратор учебных программ", dept: "HR & Development", email: "vorobeva.n@corp.ru", phone: "+7 (495) 123-45-02", avatar: "ВН" },
  { name: "Техническая поддержка", role: "IT-департамент", dept: "IT & Инфраструктура", email: "support@corp.ru", phone: "+7 (495) 123-45-90", avatar: "IT" },
];

const faq = [
  { q: "Как записаться на курс?", a: "Перейдите в раздел «Курсы» и нажмите «Начать» или «Записаться» рядом с нужным курсом." },
  { q: "Что делать, если не прошёл экзамен?", a: "Вы можете пройти повторную попытку согласно числу допустимых попыток. Если попытки исчерпаны — обратитесь к методисту." },
  { q: "Как получить сертификат?", a: "Сертификат выдаётся автоматически после успешного прохождения итогового экзамена. Скачайте его в разделе «Личный кабинет»." },
  { q: "Можно ли пройти курс на мобильном устройстве?", a: "Да, платформа адаптирована для работы на планшетах и смартфонах." },
  { q: "Как изменить данные профиля?", a: "В разделе «Личный кабинет» нажмите «Редактировать профиль». Некоторые данные изменяются только через HR-отдел." },
];

export default function ContactsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [form, setForm] = useState({ topic: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Контакты и поддержка</h1>
        <p className="text-sm text-muted-foreground mt-1">Обратитесь к специалистам или найдите ответ в разделе FAQ</p>
      </div>

      {/* Contacts */}
      <div className="grid sm:grid-cols-3 gap-4">
        {contacts.map(c => (
          <div key={c.email} className="corp-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono font-semibold text-primary">
                {c.avatar}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.role}</div>
              </div>
            </div>
            <div className="space-y-2">
              <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-xs text-primary hover:underline">
                <Icon name="Mail" size={12} />{c.email}
              </a>
              <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                <Icon name="Phone" size={12} />{c.phone}
              </a>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Building2" size={12} />{c.dept}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* FAQ */}
        <div className="corp-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Частые вопросы</h2>
          <div className="space-y-1">
            {faq.map((item, i) => (
              <div key={i} className="border border-border rounded overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{item.q}</span>
                  <Icon name={expanded === i ? "ChevronUp" : "ChevronDown"} size={14} className="text-muted-foreground shrink-0" />
                </button>
                {expanded === i && (
                  <div className="px-4 pb-3 text-sm text-muted-foreground border-t border-border/50 pt-2.5 bg-muted/20">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="corp-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Написать в поддержку</h2>
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
                <Icon name="CheckCircle" size={20} className="text-green-400" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Обращение отправлено</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">Методист свяжется с вами в течение одного рабочего дня</p>
              <button onClick={() => setSent(false)} className="mt-4 text-xs text-primary hover:underline">Отправить ещё</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Тема обращения</label>
                <select
                  value={form.topic}
                  onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-muted border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Выберите тему...</option>
                  <option>Проблема с доступом к курсу</option>
                  <option>Вопрос по экзамену</option>
                  <option>Получение сертификата</option>
                  <option>Технические неполадки</option>
                  <option>Другое</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Сообщение</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={5}
                  placeholder="Опишите ваш вопрос подробно..."
                  className="w-full px-3 py-2 text-sm bg-muted border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <button
                onClick={() => form.topic && form.message && setSent(true)}
                className="w-full bg-primary text-white py-2.5 rounded text-sm font-semibold hover:bg-primary/80 transition-colors disabled:opacity-40"
              >
                Отправить обращение
              </button>
              <p className="text-xs text-muted-foreground text-center">Срок ответа — 1 рабочий день</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
