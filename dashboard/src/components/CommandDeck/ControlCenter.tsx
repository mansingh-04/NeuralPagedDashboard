'use client';

import { Play, Square, RotateCcw, Settings, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlCenterProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: (task: string) => void;
  config: { gpu_capacity: number; arrival_rate: number; max_ticks: number };
  onUpdateConfig: (cfg: any) => void;
}

export default function ControlCenter({ isRunning, onStart, onStop, onReset, config, onUpdateConfig }: ControlCenterProps) {
  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <div className="glass-panel p-6 bg-grid">
        <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
          <Settings className="w-4 h-4" /> System Controller
        </h3>
        
        <div className="flex flex-col gap-4 mb-8">
          <button 
            onClick={isRunning ? onStop : onStart}
            className={`flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black uppercase text-sm tracking-widest ${
              isRunning 
                ? 'bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20' 
                : 'bg-success/10 border border-success/30 text-success hover:bg-success/20'
            }`}
          >
            {isRunning ? (
              <><Square className="w-5 h-5 fill-accent" /> Stop Simulation</>
            ) : (
              <><Play className="w-5 h-5 fill-success" /> Start Simulation</>
            )}
          </button>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'easy', label: 'Easy', color: 'success' },
              { id: 'medium', label: 'Med', color: 'warning' },
              { id: 'hard', label: 'Hard', color: 'accent' }
            ].map(task => (
              <button 
                key={task.id}
                onClick={() => onReset(task.id)}
                className={`py-3 px-1 rounded-xl border font-black uppercase text-[10px] tracking-widest transition-all hover:scale-105 active:scale-95 ${
                  task.color === 'success' ? 'bg-success/5 border-success/20 text-success hover:bg-success/10' :
                  task.color === 'warning' ? 'bg-warning/5 border-warning/20 text-warning hover:bg-warning/10' :
                  'bg-accent/5 border-accent/20 text-accent hover:bg-accent/10'
                }`}
              >
                {task.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          <ConfigSlider 
            label="GPU Capacity" 
            min={50} max={500} 
            value={config.gpu_capacity} 
            onChange={(v) => onUpdateConfig({ gpu_capacity: v })} 
            unit="Blocks"
          />
          <ConfigSlider 
            label="Arrival Rate" 
            min={1} max={10} 
            value={config.arrival_rate} 
            onChange={(v) => onUpdateConfig({ arrival_rate: v })} 
            unit="Req/Tick"
          />
          <ConfigSlider 
            label="Env Resolution" 
            min={100} max={1000} 
            value={config.max_ticks} 
            onChange={(v) => onUpdateConfig({ max_ticks: v })} 
            unit="Ticks"
          />
        </div>
      </div>

      <div className="glass-panel p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Global Toggles
          </h3>
        </div>
        <div className="space-y-3">
          <ToggleItem label="Auto-Garbage Collect" enabled={true} />
          <ToggleItem label="VIP Priority Admissions" enabled={true} />
          <ToggleItem label="Dynamic Block Growth" enabled={false} />
        </div>
      </div>
    </div>
  );
}

function ConfigSlider({ label, min, max, value, onChange, unit }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-dim">
        <span>{label}</span>
        <span className="text-primary">{value} <span className="opacity-50">{unit}</span></span>
      </div>
      <input 
        type="range" min={min} max={max} value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function ToggleItem({ label, enabled }: any) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
      <span className="text-xs font-bold text-text-dim">{label}</span>
      <div className={`w-10 h-5 rounded-full p-1 flex transition-all ${enabled ? 'bg-primary justify-end' : 'bg-surface justify-start'}`}>
        <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
      </div>
    </div>
  );
}
