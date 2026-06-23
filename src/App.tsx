/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Header from "./components/Header";
import GeneratorForm from "./components/GeneratorForm";
import PostDisplay from "./components/PostDisplay";
import GoogleMapsChecklist from "./components/GoogleMapsChecklist";
import LocalInsights from "./components/LocalInsights";
import IphoneServicesHighlight from "./components/IphoneServicesHighlight";
import PremiumFeatures from "./components/PremiumFeatures";
import { GBPPost, GeneratorConfig } from "./types";
import { generateGBPPost } from "./services/postService";
import { motion } from "motion/react";
import { Info, MapPin, Search } from "lucide-react";

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GBPPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (config: GeneratorConfig) => {
    setIsGenerating(true);
    setError(null);
    try {
      const post = await generateGBPPost(config);
      setGeneratedPost(post);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate post. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-zinc-950 relative selection:bg-orange-500/30">
      {/* Background ambient glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
      
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h2 className="text-3xl font-display font-medium tracking-tight text-white">
                Campaign Settings
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Configure your local SEO parameters to generate highly targeted, intent-driven content that ranks on Google Maps.
              </p>
            </motion.div>

            <div className="p-[1px] rounded-[1.5rem] bg-gradient-to-br from-zinc-700/50 via-zinc-800/10 to-zinc-900/50 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-2xl z-0" />
              <div className="relative z-10 p-6 sm:p-8">
                <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex gap-4 backdrop-blur-sm"
            >
              <div className="bg-orange-500/10 p-2 rounded-lg shrink-0 h-fit">
                <Info className="w-5 h-5 text-orange-400" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold text-zinc-200">Algorithm Insight</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Our generation engine optimizes for "Local Intent" keywords, mapping technical capabilities to high-volume user queries naturally to trigger local pack features.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            <div className="lg:sticky top-32 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-zinc-900/60 rounded-full border border-zinc-800/80 text-[10px] font-mono text-zinc-400 uppercase tracking-widest backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live Generation Node
                </div>
                {error && (
                  <span className="text-xs font-mono text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-1.5 rounded-full">
                    Error Detected //
                  </span>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="min-h-[600px]">
                <PostDisplay post={generatedPost} />
              </div>
              
              {!generatedPost && !isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <LocalInsights />
                  <IphoneServicesHighlight />
                  <GoogleMapsChecklist />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl flex items-center gap-4 group hover:bg-zinc-800/40 transition-colors">
                      <div className="bg-zinc-800/80 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="w-5 h-5 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Competitor Lock</div>
                        <div className="text-sm font-semibold text-zinc-200">Apple Service Intercept</div>
                      </div>
                    </div>
                    <div className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl flex items-center gap-4 group hover:bg-zinc-800/40 transition-colors">
                      <div className="bg-zinc-800/80 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Search className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">GEO Signals</div>
                        <div className="text-sm font-semibold text-zinc-200">MG Road / Pillar 125</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

        </div>
        
        <PremiumFeatures />
      </main>

      <footer className="py-8 px-6 border-t border-zinc-900 bg-zinc-950 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-xs font-mono">
            © 2026 iRepair2k Local SEO Infrastructure.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors">Documentation</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors">API Status</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
