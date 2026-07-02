import { BarChart3, BrainCircuit, Car, ClipboardList, FileText, LayoutDashboard, Leaf, Settings, ShieldCheck, TrendingUp } from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "AI Decision Center", to: "/decision-center", icon: BrainCircuit },
  { label: "Smart Mobility", to: "/mobility", icon: Car },
  { label: "Environment", to: "/environment", icon: Leaf },
  { label: "Forecast Intelligence", to: "/forecast", icon: TrendingUp },
  { label: "Citizen Reports", to: "/citizen-reports", icon: ClipboardList },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "Settings", to: "/settings", icon: Settings },
  
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-800 bg-slate-950 lg:flex lg:flex-col">
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-sky-500/15 p-2.5 text-sky-300">
            <ShieldCheck size={25} />
          </div>
          <div>
            <p className="font-semibold text-slate-100">Community Guardian</p>
            <p className="text-xs text-sky-400">AI Decision Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Platform
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-sky-500/15 text-sky-300"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="m-4 rounded-2xl border border-sky-900/70 bg-sky-950/30 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-sky-300">
          <BarChart3 size={18} />
          Google Cloud Native
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Analytics, AI reasoning, and incident intelligence for smarter
          communities.
        </p>
      </div>
    </aside>
  );
}