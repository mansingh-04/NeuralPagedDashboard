const BASE_URL = 'http://localhost:7860';

export interface RequestData {
  request_id: string;
  tier: 'vip' | 'free';
  prompt_tokens: number;
  target_gen_tokens: number;
  generated_tokens: number;
  wait_ticks: number;
  blocks_allocated: number;
  location: string;
}

export interface DashboardState {
  state: {
    episode_id: string;
    task: string;
    tick: number;
    max_ticks: number;
    total_arrived: number;
    total_completed: number;
    total_rejected: number;
    total_crashed: boolean;
    current_score: number;
    cumulative_reward: number;
  };
  metrics: {
    gpu_util: number;
    cpu_util: number;
    gpu_used: number;
    gpu_capacity: number;
    cpu_used: number;
    cpu_capacity: number;
  };
  queues: {
    free: RequestData[];
    vip: RequestData[];
  };
  active_requests: {
    gpu: RequestData[];
    cpu: RequestData[];
  };
  last_action: {
    result: string;
    tick: number;
  };
  is_running: boolean;
}

export interface Config {
  gpu_capacity: number;
  cpu_capacity: number;
  arrival_rate: number;
  max_ticks: number;
}

export const api = {
  getDashboard: async (): Promise<DashboardState> => {
    const res = await fetch(`${BASE_URL}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  },

  getConfig: async (): Promise<Config> => {
    const res = await fetch(`${BASE_URL}/config`);
    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
  },

  updateConfig: async (config: Partial<Config>): Promise<{ status: string; config: Config }> => {
    const res = await fetch(`${BASE_URL}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Failed to update config');
    return res.json();
  },

  reset: async (task: string = 'easy'): Promise<any> => {
    const res = await fetch(`${BASE_URL}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    });
    if (!res.ok) throw new Error('Failed to reset');
    return res.json();
  },

  step: async (actionId: number): Promise<any> => {
    const res = await fetch(`${BASE_URL}/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionId }),
    });
    if (!res.ok) throw new Error('Failed to take step');
    return res.json();
  },

  start: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/start`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to start simulation');
    return res.json();
  },

  stop: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/stop`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to stop simulation');
    return res.json();
  }
};
