'use client';

import { Activity, Shield, Cpu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  episode_id: string;
  task: string;
  isRunning: boolean;
  tick: number;
  maxTicks: number;
}

export default function Header({ episode_id, task, isRunning, tick, maxTicks }: HeaderProps) {
  return (
    <header className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-l-4 border-l-primary">
      <div className="flex items-center gap-5">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
          <Activity className="w-8 h-8 text-primary glow-text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            NEURAL PAGEDATTENTION <span className="text-xs font-mono bg-primary/20 text-primary px-2 py-0.5 rounded uppercase tracking-widest">v2.0</span>
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-sm text-text-muted font-mono flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> {episode_id}
            </p>
            <span className="w-1 h-1 rounded-full bg-text-muted opacity-30"></span>
            <p className="text-sm text-primary font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> {task}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold mb-1">System Status</p>
          <div className="flex items-center gap-2 justify-end">
            <motion.div 
              animate={{ opacity: isRunning ? [0.4, 1, 0.4] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-success shadow-[0_0_10px_#10b981]' : 'bg-accent shadow-[0_0_10px_#f43f5e]'}`} 
            />
            <span className={`text-sm font-black uppercase tracking-tighter ${isRunning ? 'text-success' : 'text-accent'}`}>
              {isRunning ? 'Operational' : 'Paused'}
            </span>
          </div>
        </div>
        
        <div className="h-10 w-px bg-glass-border hidden md:block"></div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold mb-1">Timeline</p>
          <p className="text-xl font-black font-mono text-white tracking-widest">
            {tick.toString().padStart(3, '0')}<span className="text-text-muted mx-1">/</span>{maxTicks}
          </p>
        </div>
      </div>
    </header>
  );
}
