'use client';

import { CheckCircle2, XCircle, TrendingUp, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsProps {
  state: any;
}

export default function StatsGrid({ state }: StatsProps) {
  const stats = [
    { label: 'System Ticks', value: state.tick, total: state.max_ticks, icon: <Hash />, color: 'primary' },
    { label: 'Completed', value: state.total_completed, icon: <CheckCircle2 />, color: 'success' },
    { label: 'Rejected', value: state.total_rejected, icon: <XCircle />, color: 'accent' },
    { label: 'Reliability Score', value: `${(state.current_score * 100).toFixed(1)}%`, icon: <TrendingUp />, color: 'secondary' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-panel p-6 relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className={`p-2 rounded-lg bg-${stat.color}/10 border border-${stat.color}/20 text-${stat.color}`}>
              {stat.icon}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-white">
              {stat.value}
              {stat.total && <span className="text-xs text-text-muted font-normal ml-1">/ {stat.total}</span>}
            </p>
          </div>
          <div className={`absolute bottom-0 left-0 h-1 bg-${stat.color} w-0 group-hover:w-full transition-all duration-500`}></div>
        </motion.div>
      ))}
    </div>
  );
}
