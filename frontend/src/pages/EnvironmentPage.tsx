import { CloudSun, Leaf, Waves } from "lucide-react";

export default function EnvironmentPage() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Leaf className="text-emerald-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold">Environment Intelligence</h2>
          <p className="mt-1 text-slate-400">
            Environmental risk monitoring for healthier communities.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <CloudSun className="text-sky-400" size={25} />
          <h3 className="mt-4 font-semibold">Air Quality</h3>
          <p className="mt-2 text-sm text-slate-400">
            AQI patterns and pollution alerts.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <Waves className="text-sky-300" size={25} />
          <h3 className="mt-4 font-semibold">Flood Risk</h3>
          <p className="mt-2 text-sm text-slate-400">
            Rainfall, water-level, and flood-risk intelligence.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <Leaf className="text-emerald-400" size={25} />
          <h3 className="mt-4 font-semibold">Sustainability</h3>
          <p className="mt-2 text-sm text-slate-400">
            Community environmental health indicators.
          </p>
        </article>
      </div>
    </div>
  );
}