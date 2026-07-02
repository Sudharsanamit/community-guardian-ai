import { Car, Route, TrafficCone } from "lucide-react";

export default function SmartMobilityPage() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Car className="text-sky-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold">Smart Mobility Intelligence</h2>
          <p className="mt-1 text-slate-400">
            Traffic patterns, congestion risk, and resource recommendations.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <TrafficCone className="text-amber-400" size={25} />
          <h3 className="mt-4 text-lg font-semibold">Congestion Monitoring</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            BigQuery traffic analytics and predictive congestion insights will
            appear here.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <Route className="text-emerald-400" size={25} />
          <h3 className="mt-4 text-lg font-semibold">Route Recommendations</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            AI-supported route and traffic-resource recommendations will appear
            here.
          </p>
        </article>
      </div>
    </div>
  );
}