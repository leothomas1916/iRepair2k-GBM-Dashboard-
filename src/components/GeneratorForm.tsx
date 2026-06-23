/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, Loader2, Sparkles, Megaphone, Tag, CalendarDays, PartyPopper } from "lucide-react";
import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GeneratorConfig, RepairService, PostType } from "../types";

interface Props {
  onGenerate: (config: GeneratorConfig) => void;
  isGenerating: boolean;
}

export default function GeneratorForm({ onGenerate, isGenerating }: Props) {
  const [postType, setPostType] = useState<PostType>(PostType.UPDATE);
  const [selectedServices, setSelectedServices] = useState<RepairService[]>([]);
  const [tone, setTone] = useState("Professional & Urgent");
  const [festivalName, setFestivalName] = useState("");

  const toggleService = (service: RepairService) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) return;
    onGenerate({ postType, services: selectedServices, tone, festivalName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Post Type Selection */}
      <div className="space-y-4">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="text-zinc-600">01 /</span> Campaign Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: PostType.UPDATE, icon: Megaphone, label: "Update" },
            { id: PostType.OFFER, icon: Tag, label: "Offer" },
            { id: PostType.EVENT, icon: CalendarDays, label: "Event" },
            { id: PostType.FESTIVAL, icon: PartyPopper, label: "Festival" },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setPostType(type.id)}
              className={`flex flex-col items-center justify-center gap-2.5 px-2 py-4 rounded-xl border text-[11px] font-semibold transition-all relative ${
                postType === type.id
                  ? "bg-zinc-800/80 border-orange-500/50 text-white shadow-sm"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/40"
              }`}
            >
              <type.icon className={`w-5 h-5 ${postType === type.id ? 'text-orange-500' : 'text-zinc-500'}`} />
              <span className="uppercase tracking-wider">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {postType === PostType.FESTIVAL && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               Festival Name
            </label>
            <input
              type="text"
              required
              value={festivalName}
              onChange={(e) => setFestivalName(e.target.value)}
              placeholder="e.g. Diwali, Christmas, Navratri"
              className="tech-input focus:ring-orange-500/20"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Selection */}
      <div className="space-y-4">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="text-zinc-600">02 /</span> Target Services
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(RepairService).map((service) => {
            const isSelected = selectedServices.includes(service);
            return (
              <button
                key={service}
                type="button"
                id={`service-${service.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => toggleService(service)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                  isSelected 
                    ? "bg-orange-500/5 border-orange-500/40 text-orange-400" 
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40"
                }`}
              >
                <span>{service}</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-orange-500 bg-orange-500 text-zinc-900' : 'border-zinc-700'}`}>
                  {isSelected && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone */}
      <div className="space-y-4">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="text-zinc-600">03 /</span> Content Tone
        </label>
        <input
          id="tone-input"
          type="text"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="e.g. Friendly, Technical, Direct"
          className="tech-input focus:ring-orange-500/20"
        />
      </div>

      <div className="pt-2">
        <button
          id="generate-button"
          type="submit"
          disabled={isGenerating || selectedServices.length === 0}
          className="tech-button tech-button-primary w-full py-4 text-[15px] flex items-center justify-center gap-2.5 group hover:shadow-[0_0_20px_rgba(234,88,12,0.4)]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-orange-200" />
              <span className="font-semibold text-orange-50">Synthesizing Content...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-orange-200 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-orange-50">Generate SEO Post</span>
            </>
          )}
        </button>
        
        {selectedServices.length === 0 && (
          <p className="mt-4 text-xs text-center text-zinc-500 font-mono tracking-wide">
            Select at least one service to begin
          </p>
        )}
      </div>
    </form>
  );
}
