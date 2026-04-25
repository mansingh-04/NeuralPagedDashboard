'use client';

import { useState, useEffect } from 'react';
import { api, DashboardState, Config } from '@/lib/api';
import Header from './Header';
import StatsGrid from './StatsGrid';
import ControlCenter from './ControlCenter';
import ResourceVisualizer from './ResourceVisualizer';
import QueueTracker from './QueueTracker';
import PerformanceHub from './PerformanceHub';
import { motion, AnimatePresence } from 'framer-motion';

const ACTION_MAP: Record<number, string> = {
  0: "Evict Idle Free (Size)", 1: "Evict Idle VIP (Size)", 2: "Evict Idle Free (Age)", 3: "Evict Idle VIP (Age)",
  4: "Swap to CPU Free (Size)", 5: "Swap to CPU VIP (Size)", 6: "Swap from CPU Free", 7: "Swap from CPU VIP",
  8: "Admit Free", 9: "Admit VIP", 10: "Reject Free", 11: "Reject VIP",
  12: "Preempt Shred Free", 13: "Preempt Shred VIP", 14: "Preempt Swap Free", 15: "Preempt Swap VIP",
  16: "Garbage Collect", 17: "No-op"
};

export default function CommandDeck() {
  const [data, setData] = useState<DashboardState | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const state = await api.getDashboard();
      setData(state);
      setError(null);
      
      if (state.last_action && state.last_action.result !== 'reset') {
        const logEntry = `[${state.last_action.tick}] ACTION: ${state.last_action.result}`;
        setLogs(prev => {
          if (prev[0] === logEntry) return prev;
          return [logEntry, ...prev].slice(0, 30);
        });
      }

      setHistory(prev => {
        const last = prev[prev.length - 1];
        if (last && last.tick === state.state.tick) return prev;
        return [...prev, { tick: state.state.tick, reward: state.state.cumulative_reward }].slice(-50);
      });
    } catch (e) {
      setError("Lost connection to neural environment...");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await fetchData();
        const cfg = await api.getConfig();
        setConfig(cfg);
      } catch (e) {
        console.error("Initial data fetch failed", e);
      }
    };
    
    init();
    const interval = setInterval(fetchData, 800);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => { await api.start(); fetchData(); };
  const handleStop = async () => { await api.stop(); fetchData(); };
  const handleReset = async (task: string) => { 
    await api.reset(task); 
    setLogs([`SYSTEM_EVENT: Environment reset to ${task.toUpperCase()}`]);
    setHistory([]);
    fetchData(); 
  };
  const handleUpdateConfig = async (cfg: any) => {
    const updated = await api.updateConfig(cfg);
    setConfig(updated.config);
  };

  const handleManualAction = async (id: number) => {
    try {
      await api.step(id);
      fetchData();
    } catch (e) {
      console.error("Action error", e);
    }
  };

  if (!data) return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-bg">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-4"
      />
      <p className="text-primary font-mono tracking-widest uppercase animate-pulse">{error || 'Initializing Neural Link...'}</p>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-[1700px] mx-auto bg-grid pb-20">
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 p-4 glass-panel bg-accent/20 border-accent/40 text-accent font-black text-sm z-50 flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Header 
        episode_id={data.state.episode_id} 
        task={data.state.task} 
        isRunning={data.is_running}
        tick={data.state.tick}
        maxTicks={data.state.max_ticks}
      />

      <StatsGrid state={data.state} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <ResourceVisualizer metrics={data.metrics} />
          
          <div className="glass-panel p-6">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.25em] mb-6">Manual Override Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {Object.entries(ACTION_MAP).map(([id, name]) => (
                <button 
                  key={id}
                  onClick={() => handleManualAction(parseInt(id))}
                  disabled={!data.is_running}
                  className="p-3 text-[9px] font-black uppercase text-text-dim hover:text-white border border-white/5 hover:border-primary/50 hover:bg-primary/10 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed leading-tight text-center"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <QueueTracker queues={data.queues} />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <ControlCenter 
            isRunning={data.is_running}
            onStart={handleStart}
            onStop={handleStop}
            onReset={handleReset}
            config={config || { gpu_capacity: data.metrics.gpu_capacity, arrival_rate: 2, max_ticks: data.state.max_ticks }}
            onUpdateConfig={handleUpdateConfig}
          />
        </div>
      </div>

      <PerformanceHub logs={logs} history={history} />
    </div>
  );
}
