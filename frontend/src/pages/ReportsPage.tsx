import { FileBarChart, FileText, Sparkles } from "lucide-react";

export default function ReportsPage() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <FileBarChart className="text-sky-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold">Executive Reports</h2>
          <p className="mt-1 text-slate-400">
            Generate explainable AI summaries for community stakeholders.
          </p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-sky-900/70 bg-gradient-to-br from-sky-950/50 to-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-sky-300" size={24} />
          <h3 className="text-lg font-semibold">AI Executive Report</h3>
        </div>
        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          Combine BigQuery analytics, active incidents, environmental trends,
          and Gemini recommendations into a decision-ready report.
        </p>
        <button
          type="button"
          className="mt-6 flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 font-medium text-slate-950"
        >
          <FileText size={18} />
          Generate report
        </button>
      </section>
    </div>
  );
}