import { Bell, Search } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";

const pageTitles: Record<string, string> = {
  "/": "Executive Dashboard",
  "/decision-center": "AI Decision Center",
  "/mobility": "Smart Mobility",
  "/environment": "Environment Intelligence",
  "/citizen-reports": "Citizen Reports",
  "/reports": "Executive Reports",
  "/settings": "Platform Settings",
};

export default function AppLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Community Guardian AI";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 px-6 py-4 backdrop-blur md:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-sky-400">
                Community Guardian AI
              </p>
              <h1 className="mt-1 text-xl font-semibold">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400 md:flex">
                <Search size={17} />
                <span>Search intelligence...</span>
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                <Bell size={19} />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sm font-bold text-sky-300">
                CG
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-8 md:px-10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}