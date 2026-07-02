import { BrainCircuit, Send, Sparkles } from "lucide-react";

const suggestedQuestions = [
  "Which zone needs immediate attention today?",
  "What is the biggest community risk today?",
  "Which traffic area should receive resources?",
  "What environmental risk may increase tomorrow?",
];

export default function DecisionCenterPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-sky-500/15 p-3 text-sky-300">
            <BrainCircuit size={25} />
          </div>
          <div>
            <p className="text-sm font-medium text-sky-300">
              Gemini Decision Intelligence
            </p>
            <h2 className="text-2xl font-bold">Ask your community data</h2>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-sky-900/70 bg-sky-950/30 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 text-sky-300" size={20} />
            <div>
              <p className="font-semibold">AI Decision Preview</p>
              <p className="mt-2 leading-7 text-slate-300">
                Ask a natural-language question. In the next phase, the
                platform will query BigQuery, analyze evidence with Gemini, and
                return an explainable recommendation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <textarea
            aria-label="Ask a community intelligence question"
            placeholder="Example: Which zone needs immediate attention today?"
            className="min-h-32 w-full resize-none bg-transparent text-slate-100 outline-none placeholder:text-slate-600"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-sky-400"
            >
              Ask AI
              <Send size={17} />
            </button>
          </div>
        </div>
      </section>

      <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm font-medium text-sky-300">Suggested questions</p>
        <div className="mt-4 space-y-3">
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-left text-sm text-slate-300 transition hover:border-sky-800 hover:text-sky-200"
            >
              {question}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}