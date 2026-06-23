import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default function GoogleMapsChecklist() {
  const requirements = [
    { text: "Integrate essential geo-targets (Saraswathi Puram, 1st Main Road, 2nd Cross Road)", status: "complete" },
    { text: "Optimize Apple/iPhone & MacBook repair keywords for Halasuru", status: "complete" },
    { text: "Consistent NAP with Sai Cambridge Residency & 25 Feet Road geo-signals", status: "pending" },
    { text: "High-quality weekly keyword-optimized GBP posts", status: "pending" },
    { text: "Respond to customer reviews with local competitor crossover keywords", status: "pending" },
    { text: "Add new geo-tagged photos regularly at Shop No. 2, Saraswathi Puram, Bengaluru", status: "pending" },
  ];

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-medium text-white">Top Ranking Requirements</h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
            Audit Live
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        {requirements.map((req, i) => (
          <div key={i} className="flex gap-3.5 items-start group">
            <div className="mt-0.5 shrink-0">
              {req.status === "complete" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
              ) : req.status === "warning" ? (
                <AlertCircle className="w-5 h-5 text-orange-500" strokeWidth={2.5} />
              ) : (
                <Circle className="w-5 h-5 text-zinc-700 group-hover:text-zinc-600 transition-colors" strokeWidth={2.5} />
              )}
            </div>
            <div>
              <p className={`text-[13px] leading-relaxed ${req.status === "complete" ? "text-zinc-300 font-medium" : "text-zinc-500"}`}>
                {req.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
