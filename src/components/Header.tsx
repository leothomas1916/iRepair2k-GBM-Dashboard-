/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cpu, Zap } from "lucide-react";
import { motion } from "motion/react";

export default function Header() {
  return (
    <header className="py-6 px-6 sticky top-0 z-50">
      <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-2xl border-b border-zinc-800/60 shadow-sm" />
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="bg-gradient-to-b from-orange-500 to-orange-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(234,88,12,0.3)] border border-orange-400/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 id="app-title" className="text-xl font-bold tracking-tight text-white leading-tight">
              iRepair<span className="text-orange-500 font-display">2k</span>
            </h1>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em] leading-none mt-1">
              SEO Engine
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-4 text-xs font-medium text-zinc-400"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-zinc-800/80 shadow-inner">
            <Zap className="w-3.5 h-3.5 text-orange-500" />
            <span className="tracking-wide">AI Generation</span>
          </div>
          <span className="w-px h-4 bg-zinc-800" />
          <span className="font-mono">v1.1.0</span>
        </motion.div>
      </div>
    </header>
  );
}
