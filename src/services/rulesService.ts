/**
 * Rules Service
 *
 * Manages auto-categorization rules.
 * Mock-first with real API ready.
 */

import { mockDelay, apiClient } from './apiClient';
import { MOCK_RULES } from './mockData';
import type { Rule, CreateRulePayload } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

let mockStore: Rule[] = [...MOCK_RULES];

// ─── Mock ─────────────────────────────────────────────────────────────────────

const mock = {
  async listRules(): Promise<Rule[]> {
    await mockDelay();
    return [...mockStore];
  },

  async createRule(payload: CreateRulePayload): Promise<Rule> {
    await mockDelay(300);
    const rule: Rule = {
      id: `R-${String(mockStore.length + 1).padStart(3, '0')}`,
      merchant: payload.merchant,
      category: payload.category,
      mode: payload.mode,
      applied: 0,
      created: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
    mockStore.push(rule);
    return { ...rule };
  },

  async updateRule(id: string, payload: Partial<CreateRulePayload>): Promise<Rule> {
    await mockDelay(250);
    const idx = mockStore.findIndex(r => r.id === id);
    if (idx === -1) throw new Error(`Rule ${id} not found`);
    mockStore[idx] = { ...mockStore[idx], ...payload };
    return { ...mockStore[idx] };
  },

  async deleteRule(id: string): Promise<void> {
    await mockDelay(200);
    mockStore = mockStore.filter(r => r.id !== id);
  },

  reset(): void {
    mockStore = [...MOCK_RULES];
  },
};

// ─── Real ─────────────────────────────────────────────────────────────────────


const real = {
  async listRules(): Promise<Rule[]> {
    return apiClient.get<Rule[]>('/rules');
  },
  async createRule(payload: CreateRulePayload): Promise<Rule> {
    return apiClient.post<Rule>('/rules', payload);
  },
  async updateRule(id: string, payload: Partial<CreateRulePayload>): Promise<Rule> {
    return apiClient.patch<Rule>(`/rules/${id}`, payload);
  },
  async deleteRule(id: string): Promise<void> {
    return apiClient.delete<void>(`/rules/${id}`);
  },
};

export const rulesService = USE_MOCK ? mock : real;
