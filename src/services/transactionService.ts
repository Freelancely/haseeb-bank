import { apiClient } from './apiClient';
import type {
  Transaction,
  TransactionListResponse,
  TransactionFilters,
  HistoryEntry,
} from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CategorizePayload {
  categoryId: string; // numeric account ID string
  source: HistoryEntry['source'];
}

export interface BulkCategorizePayload {
  txIds: number[];
  categoryId: string;
}

export interface CreateManualPayload {
  merchant: string;
  amount: number;
  type: 'debit' | 'credit';
  date: string; // YYYY-MM-DD
  pos?: string;
  categoryId?: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const transactionService = {
  async listTransactions(filters: Partial<TransactionFilters>): Promise<TransactionListResponse> {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    if (filters.sortField) params.set('sortField', filters.sortField);
    if (filters.sortDirection) params.set('sortDirection', filters.sortDirection);
    return apiClient.get<TransactionListResponse>(`/transactions?${params.toString()}`);
  },

  async getTransaction(id: number): Promise<Transaction> {
    return apiClient.get<Transaction>(`/transactions/${id}`);
  },

  async categorize(id: number, payload: CategorizePayload): Promise<Transaction> {
    return apiClient.patch<Transaction>(`/transactions/${id}/categorize`, {
      categoryId: Number(payload.categoryId),
      source: payload.source,
    });
  },

  async bulkCategorize(payload: BulkCategorizePayload): Promise<Transaction[]> {
    return apiClient.post<Transaction[]>('/transactions/bulk-categorize', {
      txIds: payload.txIds,
      categoryId: Number(payload.categoryId),
    });
  },

  async revertTransaction(id: number): Promise<Transaction> {
    return apiClient.post<Transaction>(`/transactions/${id}/revert`, {});
  },

  async createManual(payload: CreateManualPayload): Promise<Transaction> {
    return apiClient.post<Transaction>('/transactions/manual', payload);
  },
};
