import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  LoaderCircle,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  askDecisionIntelligence,
  type DecisionAnswerResponse,
} from "../services/api";

const suggestedQuestions = [
  "Which zone needs immediate attention today?",
  "What is the biggest community risk today?",
  "Which traffic area should receive resources?",
  "What environmental risk may increase tomorrow?",
];

export default function DecisionCenterPage() {
  const [question, setQuestion] = useState(suggestedQuestions[0]);
  const [result, setResult] = useState<DecisionAnswerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (question.trim().length < 5) {
      setError("Enter a question with at least 5 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await askDecisionIntelligence(question.trim());
      setResult(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate AI decision intelligence.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-sky-500/15 p-3 text-sky-300">
            <BrainCircuit size={25} />
          </div>
          <div>
            <p className="text-sm font-medium text-sky-300">
              Vertex AI Gemini + BigQuery
            </p>
            <h2 className="text-2xl font-bold">Ask your community data</h2>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-sky-900/70 bg-sky-950/30 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 text-sky-300" size={20} />
            <p className="leading-7 text-slate-300">
              Gemini receives verified BigQuery evidence, then produces an
              explainable recommendation. Human review is required before any
              action.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <textarea
            aria-label="Ask a community intelligence question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Example: Which zone needs immediate attention today?"
            className="min-h-28 w-full resize-none bg-transparent text-slate-100 outline-none placeholder:text-slate-600"
          />

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" size={17} />
                  Analyzing evidence...
                </>
              ) : (
                <>
                  Ask AI
                  <Send size={17} />
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {result && (
          <section className="mt-6 space-y-5">
            <article className="rounded-2xl border border-sky-900/70 bg-gradient-to-br from-sky-950/60 to-slate-900 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-sky-300">
                    AI Decision Recommendation
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">
                    {result.summary}
                  </h3>
                </div>
                <span className="rounded-full bg-sky-500/15 px-3 py-1 text-sm text-sky-200">
                  {result.priority_zone}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Recommended action
                  </p>
                  <p className="mt-1 leading-7 text-slate-400">
                    {result.recommendation}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Expected impact
                  </p>
                  <p className="mt-1 leading-7 text-slate-400">
                    {result.expected_impact}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                  Confidence: {result.confidence}%
                </span>
                <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-sm text-amber-300">
                  <ShieldCheck size={15} />
                  Human review required
                </span>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold">Evidence used</h3>

              <div className="mt-5 space-y-4">
                {result.evidence.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="rounded-xl bg-slate-950 p-4"
                  >
                    <p className="font-medium text-slate-200">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-sky-300">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <div className="flex gap-3 rounded-xl border border-amber-900/70 bg-amber-950/30 p-4 text-sm text-amber-100">
              <AlertTriangle className="shrink-0 text-amber-400" size={19} />
              <p>{result.disclaimer}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Generated by {result.generated_by}
            </div>
          </section>
        )}
      </section>

      <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm font-medium text-sky-300">Suggested questions</p>

        <div className="mt-4 space-y-3">
          {suggestedQuestions.map((suggestedQuestion) => (
            <button
              key={suggestedQuestion}
              type="button"
              onClick={() => setQuestion(suggestedQuestion)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-left text-sm text-slate-300 transition hover:border-sky-800 hover:text-sky-200"
            >
              {suggestedQuestion}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}