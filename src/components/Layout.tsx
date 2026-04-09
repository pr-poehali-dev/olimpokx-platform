import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "courses" | "exams" | "trainers" | "profile" | "reports" | "admin" | "contacts";

interface LayoutProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  children: React.ReactNode;
}

const navItems = [
  { id: "home" as Page, label: "Главная", icon: "LayoutDashboard" },
  { id: "courses" as Page, label: "Курсы", icon: "BookOpen" },
  { id: "exams" as Page, label: "Экзамены", icon: "ClipboardCheck" },
  { id: "trainers" as Page, label: "Тренажёры", icon: "Dumbbell" },
  { id: "profile" as Page, label: "Личный кабинет", icon: "User" },
  { id: "reports" as Page, label: "Отчёты", icon: "BarChart3" },
  { id: "admin" as Page, label: "Админпанель", icon: "Settings2" },
  { id: "contacts" as Page, label: "Контакты", icon: "Phone" },
];

export default function Layout({ currentPage, setPage, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
              <Icon name="GraduationCap" size={14} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground leading-none">КорпОбучение</div>
              <div className="text-xs text-muted-foreground mt-0.5 font-mono">v2.1 / ОАО «Компания»</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-150 text-left ${
                currentPage === item.id
                  ? "bg-primary text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User block */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-mono font-medium text-primary">
              ИП
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">Иванов П.С.</div>
              <div className="text-xs text-muted-foreground truncate">Сотрудник</div>
            </div>
            <Icon name="LogOut" size={14} className="text-muted-foreground cursor-pointer hover:text-foreground" />
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center gap-4 px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(true)}>
            <Icon name="Menu" size={20} />
          </button>
          <div className="flex-1">
            <span className="text-xs font-mono text-muted-foreground">
              {navItems.find(n => n.id === currentPage)?.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="Bell" size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-mono rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs font-mono text-muted-foreground">2026-04-09</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
