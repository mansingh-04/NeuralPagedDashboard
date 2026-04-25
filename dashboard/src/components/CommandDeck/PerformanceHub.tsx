'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Terminal, LineChart as ChartIcon, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface HubProps {
  logs: string[];
  history: any[];
}

export default function PerformanceHub({ logs, history }: HubProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Live Graph */}
      <div className="glass-panel p-6 lg:col-span-2 flex flex-col h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg border border-success/20">
              <ChartIcon className="w-5 h-5 text-success" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">System Optimization Trend</h3>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-success capitalize">
               <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Cumulative Reward
            </span>
          </div>
        </div>

        <div className="flex-1 w-full -ml-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorReward" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="tick" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--success)', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" dataKey="reward" stroke="var(--success)" fillOpacity={1} fill="url(#colorReward)" 
                strokeWidth={3} isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Terminal Logs */}
      <div className="glass-panel p-6 flex flex-col h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Event Log</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide font-mono text-[10px]">
          {logs.length === 0 && <p className="text-text-muted italic">Waiting for environment events...</p>}
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
              className={`p-2 border-l-2 flex items-start gap-2 ${
                log.includes('Reset') 
                  ? 'border-success bg-success/5 text-success' 
                  : 'border-primary/40 bg-white/5 text-text-dim'
              }`}
            >
              <span className="opacity-30 mt-1"><Info className="w-3 h-3" /></span>
              <span className="flex-1 leading-relaxed">{log}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
