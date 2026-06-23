import { TrendingUp, Users, MapPin, MousePointerClick, Phone } from "lucide-react";

export default function LocalInsights() {
  const stats = [
    { label: "Competitor Profile Crossovers", value: "842", trend: "+45.5%", icon: Users },
    { label: "MG Road/Halasuru Directions", value: "481", trend: "+12.2%", icon: MapPin },
    { label: "Apple Repair Clicks", value: "1,204", trend: "+28.4%", icon: MousePointerClick },
    { label: "Call Button Clicks", value: "284", trend: "+5.1%", icon: Phone },
  ];

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-medium text-white">Local Search Velocity</h3>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Last 30 Days</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 hover:border-zinc-700/80 transition-colors group">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-orange-500/10 rounded-md group-hover:bg-orange-500/20 transition-colors">
                <stat.icon className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <span className="text-xs text-zinc-400 font-medium">{stat.label}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-display text-zinc-100">{stat.value}</span>
              <span className="flex items-center text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
