import { Camera, ClipboardList, MapPin } from "lucide-react";

export default function CitizenReportsPage() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <ClipboardList className="text-sky-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold">Citizen Reports</h2>
          <p className="mt-1 text-slate-400">
            Capture, classify, and track community issues with multimodal AI.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <Camera className="text-sky-400" size={25} />
          <h3 className="mt-4 text-lg font-semibold">Submit a community issue</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            The next phase will add image upload, Gemini Vision analysis,
            severity classification, and department assignment.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-sky-500 px-4 py-2.5 font-medium text-slate-950"
          >
            Create report
          </button>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <MapPin className="text-emerald-400" size={25} />
          <h3 className="mt-4 text-lg font-semibold">Recent incident activity</h3>
          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-xl bg-slate-950 p-4">
              Road damage · Zone C · Under review
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              Waste accumulation · Zone B · Assigned
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              Streetlight issue · Zone E · Resolved
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}