import { mockDelay, apiClient } from './apiClient';
import { MOCK_DASHBOARD_STATS } from './mockData';
import type { DashboardStats } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const mock = {
  async getStats(): Promise<DashboardStats> {
    await mockDelay(400);
    return { ...MOCK_DASHBOARD_STATS };
  },
};

const real = {
  async getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  },
};

export const dashboardService = USE_MOCK ? mock : real;
