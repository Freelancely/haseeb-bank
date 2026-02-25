/**
 * Accounts Service
 *
 * Loads the chart of accounts from the backend to use as categories.
 * In mock mode, returns DEFAULT_CATEGORIES from constants.
 * In real mode, fetches from GET /accounts and maps account names to Category shape.
 */

import { apiClient, mockDelay } from './apiClient';
import { DEFAULT_CATEGORIES } from '@/constants';
import type { Category } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

interface AccountRow {
  id: number;
  name: string;
  type: { id: number; name: string; normalBalance: string };
  isActive: boolean;
}

const mock = {
  async listAccounts(): Promise<Category[]> {
    await mockDelay(200);
    return [...DEFAULT_CATEGORIES];
  },
};

const real = {
  async listAccounts(): Promise<Category[]> {
    const accounts = await apiClient.get<AccountRow[]>('/accounts');
    return accounts
      .filter(a => a.isActive)
      .map(a => ({
        id: String(a.id),
        label: a.name,
        typeId: a.type.id,
        typeName: a.type.name,
      }));
  },
};

export const accountsService = USE_MOCK ? mock : real;
