'use client';

import { Cpu, Database, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResourceProps {
  metrics: {
    gpu_util: number;
    cpu_util: number;
    gpu_used: number;
    gpu_capacity: number;
    cpu_used: number;
    cpu_capacity: number;
  };
}

export default function ResourceVisualizer({ metrics }: ResourceProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* GPU Block Map */}
      <div className="glass-panel p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">GPU Virtual Memory</h3>
          </div>
          <span className="text-xl font-mono font-black text-primary glow-text-primary">{(metrics.gpu_util * 100).toFixed(1)}%</span>
        </div>

        {/* The Grid Map */}
        <div className="flex-1 bg-black/40 rounded-xl p-4 border border-white/5 relative overflow-hidden">
          <div className="grid grid-cols-20 gap-1 h-32 md:h-48 group/map">
            {Array.from({ length: 100 }).map((_, i) => {
              const isActive = (i / 100) < metrics.gpu_util;
              const isVIP = isActive && i % 3 === 0; // Simulate VIP blocks for visual variety
              return (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.5, zIndex: 10, borderRadius: '4px' }}
                  animate={{ 
                    backgroundColor: isActive 
                      ? (isVIP ? 'var(--secondary)' : 'var(--primary)') 
                      : 'rgba(255,255,255,0.03)',
                    boxShadow: isActive 
                      ? `0 0 8px ${isVIP ? 'var(--secondary-glow)' : 'var(--primary-glow)'}` 
                      : 'none'
                  }}
                  transition={{ duration: 0.3 }}
                  title={isActive ? `Block ${i}: ${isVIP ? 'VIP' : 'Free'}` : `Block ${i}: Empty`}
                  className="rounded-[2px] w-full h-full cursor-help"
                />
              );
            })}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <DetailStat icon={<Database className="w-3 h-3"/>} label="Blocks Used" value={metrics.gpu_used} total={metrics.gpu_capacity} color="primary" />
          <DetailStat icon={<HardDrive className="w-3 h-3"/>} label="Available" value={metrics.gpu_capacity - metrics.gpu_used} total={metrics.gpu_capacity} color="text-dim" />
        </div>
      </div>

      {/* CPU / Swap Pool */}
      <div className="glass-panel p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg border border-secondary/20">
              <Cpu className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Off-Device Pool (CPU)</h3>
          </div>
          <span className="text-xl font-mono font-black text-secondary">{(metrics.cpu_util * 100).toFixed(1)}%</span>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle 
                cx="50" cy="50" r="45" fill="none" stroke="var(--secondary)" strokeWidth="8"
                strokeDasharray="283"
                animate={{ strokeDashoffset: 283 - (283 * metrics.cpu_util) }}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <span className="text-2xl font-black text-white">{metrics.cpu_used}</span>
              <span className="text-[10px] font-bold text-text-muted uppercase">Allocated</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 mt-6">
          <div className="flex justify-between text-[10px] font-bold text-text-dim uppercase mb-1">
            <span>Swap Pressure</span>
            <span>{metrics.cpu_used} / {metrics.cpu_capacity}</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${metrics.cpu_util * 100}%` }}
              className="h-full bg-secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailStat({ icon, label, value, total, color }: any) {
  return (
    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-${color}`}>{icon}</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{label}</span>
      </div>
      <p className="text-lg font-black text-white">{value}</p>
    </div>
  );
}
