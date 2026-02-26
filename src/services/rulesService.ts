import { apiClient } from './apiClient';
import type { Rule, CreateRulePayload } from '@/types';

export const rulesService = {
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
