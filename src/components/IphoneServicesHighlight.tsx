import { Smartphone, MapPin, Battery, PenTool } from "lucide-react";

export default function IphoneServicesHighlight() {
  return (
    <div className="bg-zinc-900/40 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm mt-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-display font-medium text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            Featured: iPhone Repairs
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            All Models Supported • High Demand Services
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          Priority SEO Target
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {[
          {
            title: "Screen Replacement",
            icon: Smartphone,
            geoTags: [
              "iPhone screen repair Bengaluru",
              "Best screen replacement Halasuru",
            ],
            desc: "OEM-spec OLED/LCD replacements with True Tone retention.",
          },
          {
            title: "Battery Replacement",
            icon: Battery,
            geoTags: [
              "iPhone battery replacement near me",
              "Fast battery service MG Road",
            ],
            desc: "High-capacity cells with battery health indicator restore.",
          },
          {
            title: "Back Glass Replacement",
            icon: PenTool,
            geoTags: [
              "Laser back glass repair Bengaluru",
              "iPhone back panel fix Halasuru",
            ],
            desc: "Precision laser removal for flawless factory finish.",
          },
        ].map((service, i) => {
          const Icon = service.icon;
          return (
            <div
              key={i}
              className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-medium text-zinc-200">
                  {service.title}
                </h4>
              </div>
              <p className="text-xs text-zinc-400 mb-4">{service.desc}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 uppercase">
                  <MapPin className="w-3 h-3" /> Geo-Targeted Keywords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {service.geoTags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-[10px] bg-zinc-900 text-zinc-300 px-2 py-1 rounded border border-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
