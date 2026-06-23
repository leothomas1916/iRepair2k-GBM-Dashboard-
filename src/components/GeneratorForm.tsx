/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, Loader2, Sparkles, Megaphone, Tag, CalendarDays, MapPin, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState, FormEvent, KeyboardEvent } from "react";
import { motion } from "motion/react";
import { GeneratorConfig, RepairService, PostType } from "../types";

interface Props {
  onGenerate: (config: GeneratorConfig) => void;
  isGenerating: boolean;
}

const ELITE_SEO_KEYWORDS = [
  "Mobile phone repair shop",
  "Screen repair service",
  "Computer repair service",
  "Electronics repair shop",
  "Glass repair service",
  "Electronic parts supplier",
  "Phone repair Halasuru",
  "MacBook repair Bengaluru",
  "Laptop repair shop"
];

export default function GeneratorForm({ onGenerate, isGenerating }: Props) {
  const [postType, setPostType] = useState<PostType>(PostType.UPDATE);
  const [selectedServices, setSelectedServices] = useState<RepairService[]>([]);
  const [tone, setTone] = useState("Professional & Urgent");
  
  // New Local SEO & GEO Location parameters
  const [targetGeoUrl, setTargetGeoUrl] = useState("https://maps.app.goo.gl/a3qKy48bJDekiDS88");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([
    "Mobile phone repair shop",
    "Screen repair service",
    "Computer repair service",
    "Electronics repair shop"
  ]);
  const [customKeyword, setCustomKeyword] = useState("");

  const toggleService = (service: RepairService) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const addCustomKeyword = () => {
    const trimmed = customKeyword.trim();
    if (trimmed && !selectedKeywords.includes(trimmed)) {
      setSelectedKeywords(prev => [...prev, trimmed]);
      setCustomKeyword("");
    }
  };

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomKeyword();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) return;
    onGenerate({ 
      postType, 
      services: selectedServices, 
      tone,
      seoKeywords: selectedKeywords,
      targetGeoUrl
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Post Type Selection */}
      <div className="space-y-4">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="text-zinc-600">01 /</span> Campaign Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: PostType.UPDATE, icon: Megaphone, label: "Update" },
            { id: PostType.OFFER, icon: Tag, label: "Offer" },
            { id: PostType.EVENT, icon: CalendarDays, label: "Event" },
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

      {/* SEO Keywords Selection */}
      <div className="space-y-4">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="text-zinc-600">03 /</span> SEO Target Keywords
        </label>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Select target categories & high-volume keywords to inject into the post schema naturally.
        </p>
        
        {/* Keywords Cloud */}
        <div className="flex flex-wrap gap-2">
          {ELITE_SEO_KEYWORDS.map((kw) => {
            const isSelected = selectedKeywords.includes(kw);
            return (
              <button
                key={kw}
                type="button"
                onClick={() => toggleKeyword(kw)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-orange-500/15 border-orange-500/40 text-orange-400 font-semibold"
                    : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                {kw}
              </button>
            );
          })}
        </div>

        {/* Custom Keyword Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom SEO keyword (press Enter)..."
            value={customKeyword}
            onChange={(e) => setCustomKeyword(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            className="tech-input focus:ring-orange-500/20 text-xs py-2 px-3 flex-1"
          />
          <button
            type="button"
            onClick={addCustomKeyword}
            className="px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {/* Selected Keywords Summary */}
        {selectedKeywords.length > 0 && (
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-3.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">
              Active Focus ({selectedKeywords.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedKeywords.map(kw => (
                <span key={kw} className="bg-zinc-800 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5">
                  {kw}
                  <button 
                    type="button" 
                    onClick={() => toggleKeyword(kw)}
                    className="text-zinc-500 hover:text-zinc-300 text-[11px]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GEO Tag Location */}
      <div className="space-y-4">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="text-zinc-600">04 /</span> GEO Tag Location
        </label>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Google Business Profile verified shortlink to establish accurate citation signals.
        </p>
        <div className="relative group">
          <input
            id="geo-url-input"
            type="text"
            value={targetGeoUrl}
            onChange={(e) => setTargetGeoUrl(e.target.value)}
            placeholder="Google Maps Location Shortlink"
            className="tech-input focus:ring-orange-500/20 text-xs pr-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <a
              href={targetGeoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-orange-400 transition-colors"
              title="Open Google Maps location link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        {/* Location Information Card */}
        <div className="p-3.5 bg-zinc-950/80 border border-zinc-900 rounded-xl flex gap-3">
          <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500 shrink-0 h-fit self-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h5 className="text-[11px] font-semibold text-zinc-200">iRepair2k Halasuru Store</h5>
            <p className="text-[10px] leading-relaxed text-zinc-500">
              Saraswathi Puram, Halasuru, Bengaluru, Karnataka 560008
            </p>
          </div>
        </div>
      </div>

      {/* Tone */}
      <div className="space-y-4">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="text-zinc-600">05 /</span> Content Tone
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
