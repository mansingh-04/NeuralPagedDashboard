'use client';

import { Users, UserCheck, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RequestData } from '@/lib/api';

interface QueueProps {
  queues: {
    free: RequestData[];
    vip: RequestData[];
  };
}

export default function QueueTracker({ queues }: QueueProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <QueueSection 
        title="High Priority (VIP)" 
        icon={<UserCheck className="w-5 h-5 text-secondary" />}
        requests={queues.vip}
        color="secondary"
      />
      <QueueSection 
        title="Standard Pool (Free)" 
        icon={<Users className="w-5 h-5 text-text-dim" />}
        requests={queues.free}
        color="text-dim"
      />
    </div>
  );
}

function QueueSection({ title, icon, requests, color }: any) {
  return (
    <div className="glass-panel p-6 flex flex-col h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-${color}/10 rounded-lg border border-${color}/20`}>
            {icon}
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white">{title}</h3>
        </div>
        <span className={`text-xs font-black px-3 py-1 rounded-full bg-${color}/10 text-${color} border border-${color}/20`}>
          {requests.length} Active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {requests.length === 0 && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-text-muted text-sm italic mt-10"
            >
              No pending requests in this tier
            </motion.p>
          )}
          {requests.map((r: RequestData) => (
            <motion.div 
              key={r.request_id}
              layout
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-all cursor-crosshair"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-black/40 rounded-lg font-mono text-[10px] text-primary">#{r.request_id}</div>
                <div>
                  <p className="text-xs font-black text-white">{r.prompt_tokens} <span className="text-text-muted font-normal">Prompt Tokens</span></p>
                  <p className="text-[10px] text-text-muted flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> Waiting for {r.wait_ticks} ticks
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
