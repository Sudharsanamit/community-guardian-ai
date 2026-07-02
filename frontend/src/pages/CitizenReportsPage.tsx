import { ChangeEvent, FormEvent, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

import {
  analyzeCommunityImage,
  submitCitizenReport,
  type ImageAnalysisResponse,
} from "../services/api";

const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"];

export default function CitizenReportPage() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [zone, setZone] = useState("Zone C");
  const [analysis, setAnalysis] = useState<ImageAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      return;
    }

    if (!selectedImage.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setImage(selectedImage);
    setPreviewUrl(URL.createObjectURL(selectedImage));
    setAnalysis(null);
    setSuccessMessage(null);
    setError(null);
  }

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!image) {
      setError("Upload an image before requesting AI analysis.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await analyzeCommunityImage(image, description);
      setAnalysis(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to analyze the uploaded image.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleSubmitReport() {
    if (!image || !analysis) {
      setError("Analyze and review the image before submitting the report.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitCitizenReport({
        image,
        category: analysis.category,
        severity: analysis.severity,
        description:
          description.trim() ||
          `${analysis.summary} AI-detected signals: ${analysis.detected_signals.join(", ")}.`,
        zone,
        latitude: 9.9252,
        longitude: 78.1198,
      });

      setSuccessMessage(
        `Report ${result.report_id} was submitted and is now under human review.`,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit citizen report.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/15 p-3 text-violet-300">
            <ImagePlus size={25} />
          </div>
          <div>
            <p className="text-sm font-medium text-violet-300">
              Gemini Multimodal AI
            </p>
            <h2 className="text-2xl font-bold">Report a community issue</h2>
          </div>
        </div>

        <p className="mt-4 leading-7 text-slate-400">
          Upload an image of a visible community issue. AI will suggest a
          category and severity, but you must review the result before
          submitting it to the community dashboard.
        </p>

        <form onSubmit={handleAnalyze} className="mt-6 space-y-5">
          <label className="block rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-6 transition hover:border-violet-700">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="flex flex-col items-center text-center">
              <Upload className="text-violet-300" size={30} />
              <p className="mt-3 font-medium">
                Upload JPG, PNG, or WEBP image
              </p>
              <p className="mt-1 text-sm text-slate-500">Maximum file size: 8 MB</p>
            </div>
          </label>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Selected community issue"
              className="max-h-80 w-full rounded-2xl border border-slate-800 object-cover"
            />
          )}

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional: describe the issue and nearby landmark..."
            className="min-h-28 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-slate-100 outline-none placeholder:text-slate-600 focus:border-violet-700"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                Community zone
              </span>
              <select
                value={zone}
                onChange={(event) => setZone(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-200 outline-none focus:border-violet-700"
              >
                {zones.map((zoneName) => (
                  <option key={zoneName} value={zoneName}>
                    {zoneName}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <p className="text-sm font-medium text-slate-300">Location</p>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400">
                <MapPin size={17} className="text-violet-300" />
                Prototype location enabled
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAnalyzing ? (
              <>
                <LoaderCircle className="animate-spin" size={17} />
                Analyzing image...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Analyze with AI
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 flex gap-3 rounded-xl border border-emerald-900 bg-emerald-950/40 p-4 text-sm text-emerald-200">
            <CheckCircle2 className="shrink-0 text-emerald-400" size={20} />
            <p>{successMessage}</p>
          </div>
        )}

        {analysis && (
          <section className="mt-6 rounded-2xl border border-violet-900/70 bg-violet-950/20 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-violet-300">
                  AI-assisted report draft
                </p>
                <h3 className="mt-1 text-xl font-semibold">{analysis.category}</h3>
              </div>

              <div className="flex gap-2">
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-sm text-amber-300">
                  {analysis.severity}
                </span>
                <span className="rounded-full bg-violet-500/15 px-3 py-1 text-sm text-violet-200">
                  Confidence: {analysis.confidence}%
                </span>
              </div>
            </div>

            <p className="mt-5 leading-7 text-slate-300">{analysis.summary}</p>

            <div className="mt-5">
              <p className="text-sm font-medium text-slate-300">
                Detected visible signals
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.detected_signals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full bg-slate-900 px-3 py-1 text-sm text-slate-300"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-950 p-4">
              <p className="text-sm font-medium text-slate-300">
                Recommended follow-up
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {analysis.recommended_action}
              </p>
            </div>

            <div className="mt-5 flex gap-3 rounded-xl border border-amber-900/70 bg-amber-950/30 p-4 text-sm text-amber-100">
              <AlertTriangle className="shrink-0 text-amber-400" size={19} />
              <p>{analysis.disclaimer}</p>
            </div>

            <button
              type="button"
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" size={17} />
                  Submitting report...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Submit for human review
                </>
              )}
            </button>
          </section>
        )}
      </section>

      <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-2 text-violet-300">
          <ShieldCheck size={19} />
          <p className="font-medium">Responsible reporting</p>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-400">
          <p>Only upload images of public community issues.</p>
          <p>Do not upload sensitive personal, medical, or private images.</p>
          <p>AI suggestions are reviewed by a human before action.</p>
          <p>Prototype location uses a sample coordinate for demonstration.</p>
        </div>
      </aside>
    </div>
  );
}