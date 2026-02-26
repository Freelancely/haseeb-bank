import { apiClient } from './apiClient';
import type { Category } from '@/types';

interface AccountRow {
  id: number;
  name: string;
  type: { id: number; name: string; normalBalance: string };
  isActive: boolean;
}

export const accountsService = {
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
