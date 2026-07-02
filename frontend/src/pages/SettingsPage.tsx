import { CloudCog, ShieldCheck, UserRound } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <CloudCog className="text-sky-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold">Platform Settings</h2>
          <p className="mt-1 text-slate-400">
            Configure profile, organization, and AI preferences.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <UserRound className="text-sky-400" size={25} />
          <h3 className="mt-4 font-semibold">Profile</h3>
          <p className="mt-2 text-sm text-slate-400">
            User profile and stakeholder role settings.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <ShieldCheck className="text-emerald-400" size={25} />
          <h3 className="mt-4 font-semibold">Responsible AI</h3>
          <p className="mt-2 text-sm text-slate-400">
            Human review, confidence visibility, and decision audit controls.
          </p>
        </article>
      </div>
    </div>
  );
}