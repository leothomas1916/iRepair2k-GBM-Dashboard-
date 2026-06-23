import { 
  BarChart2, 
  Map, 
  Target, 
  Grid, 
  Coins, 
  Layers, 
  Star, 
  ShieldCheck, 
  Globe, 
  Calendar, 
  UserCheck, 
  SmilePlus, 
  PhoneCall 
} from "lucide-react";

export default function PremiumFeatures() {
  const features = [
    { label: "Keywords Ranker", value: "30 Keywords", icon: BarChart2 },
    { label: "Google Map & Google Search", value: "Tracking", icon: Map },
    { label: "Competitors Tracker", value: "20 Competitors", icon: Target },
    { label: "Geo Grid Ranker", value: "100 Scans", icon: Grid },
    { label: "Magic Coins", value: "3000 Coins", icon: Coins },
    { label: "Bulk Listing Management", value: "Included", icon: Layers },
    { label: "AI Driven Reviews Management", value: "Included", icon: Star },
    { label: "Audit & Suspension Scores, Heat Maps", value: "Included", icon: ShieldCheck },
    { label: "Bing & 20+ Publishers Integration", value: "Included", icon: Globe },
    { label: "Social Media & Google Post Scheduling", value: "Included", icon: Calendar },
    { label: "Dedicated Business Coach", value: "Included", icon: UserCheck },
    { label: "Competitor Sentiment Analysis", value: "Included", icon: SmilePlus },
    { label: "Founder's Phone Number", value: "For Support", icon: PhoneCall },
  ];

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-medium text-white">Your Plan Features</h3>
        <span className="text-[10px] uppercase tracking-widest text-orange-500 font-mono bg-orange-500/10 px-2 py-1 rounded-full">Pro Tier</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50 hover:border-orange-500/30 transition-colors">
            <div className="p-2 bg-orange-500/10 rounded-lg shrink-0 mt-0.5">
              <feature.icon className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-200 leading-tight mb-0.5">{feature.label}</div>
              <div className="text-xs font-mono text-zinc-500">{feature.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
