/**
 * Transaction Service
 *
 * Currently uses mock data. When the backend is ready:
 * 1. Set VITE_USE_MOCK=false in .env
 * 2. The service will automatically switch to real API calls
 */

import { mockDelay } from './apiClient';
import { MOCK_TRANSACTIONS } from './mockData';
import type {
  Transaction,
  HistoryEntry,
  TransactionListResponse,
  TransactionFilters,
} from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// In-memory store for mock (simulates server state)
let mockStore: Transaction[] = [...MOCK_TRANSACTIONS];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CategorizePayload {
  categoryId: string; // account ID (numeric string from real API, label string in mock)
  source: HistoryEntry['source'];
}

export interface BulkCategorizePayload {
  txIds: number[];
  categoryId: string;
}

// ─── Mock Implementations ─────────────────────────────────────────────────────

const mock = {
  async listTransactions(filters: Partial<TransactionFilters>): Promise<TransactionListResponse> {
    await mockDelay();
    let result = [...mockStore];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        t =>
          t.merchant.toLowerCase().includes(q) ||
          t.pos.toLowerCase().includes(q) ||
          t.cat?.toLowerCase().includes(q),
      );
    }

    if (filters.sortField) {
      result.sort((a, b) => {
        let valA: string | number;
        let valB: string | number;
        switch (filters.sortField) {
          case 'amount':
            valA = a.amount;
            valB = b.amount;
            break;
          case 'merchant':
            valA = a.merchant;
            valB = b.merchant;
            break;
          case 'confidence':
            valA = a.confidence;
            valB = b.confidence;
            break;
          default:
            valA = a.date;
            valB = b.date;
        }
        const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
        return filters.sortDirection === 'asc' ? cmp : -cmp;
      });
    }

    const categorized = mockStore.filter(t => t.cat !== null).length;
    const summary = {
      total: mockStore.length,
      uncategorized: mockStore.filter(t => !t.cat).length,
      byStatus: {
        suggested: mockStore.filter(t => t.status === 'suggested').length,
        auto: mockStore.filter(t => t.status === 'auto').length,
        review: mockStore.filter(t => t.status === 'review').length,
        manual: mockStore.filter(t => t.status === 'manual').length,
      },
      totalDebit: mockStore.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
      totalCredit: mockStore.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0),
    };

    void categorized;

    return { transactions: result, summary };
  },

  async getTransaction(id: number): Promise<Transaction> {
    await mockDelay(200);
    const tx = mockStore.find(t => t.id === id);
    if (!tx) throw new Error(`Transaction ${id} not found`);
    return { ...tx };
  },

  async categorize(id: number, payload: CategorizePayload): Promise<Transaction> {
    await mockDelay(300);
    const idx = mockStore.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Transaction ${id} not found`);

    const tx = mockStore[idx];
    const histEntry: HistoryEntry = {
      action:
        payload.source === 'manual'
          ? 'Manual Selection'
          : payload.source === 'bulk'
            ? 'Bulk Applied'
            : payload.source === 'confirm'
              ? 'Confirmed Suggestion'
              : 'System Action',
      cat: payload.categoryId,
      confidence: null,
      time: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      source: payload.source,
    };

    const updated: Transaction = {
      ...tx,
      cat: payload.categoryId,
      status: payload.source === 'bulk' ? 'auto' : 'manual',
      history: [...tx.history, histEntry],
    };

    mockStore[idx] = updated;
    return { ...updated };
  },

  async bulkCategorize(payload: BulkCategorizePayload): Promise<Transaction[]> {
    await mockDelay(500);
    return Promise.all(
      payload.txIds.map(id =>
        mock.categorize(id, { categoryId: payload.categoryId, source: 'bulk' }),
      ),
    );
  },

  async revertTransaction(id: number): Promise<Transaction> {
    await mockDelay(250);
    const idx = mockStore.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Transaction ${id} not found`);

    const tx = mockStore[idx];
    if (tx.history.length <= 1) return { ...tx };

    const newHistory = tx.history.slice(0, -1);
    const prev = newHistory[newHistory.length - 1];

    const updated: Transaction = {
      ...tx,
      cat: prev.source === 'engine' ? null : prev.cat,
      status:
        prev.source === 'engine'
          ? tx.confidence >= 60
            ? 'suggested'
            : 'review'
          : prev.source === 'rule'
            ? 'auto'
            : 'manual',
      history: newHistory,
    };

    mockStore[idx] = updated;
    return { ...updated };
  },

  // Reset mock store (useful for testing)
  reset(): void {
    mockStore = [...MOCK_TRANSACTIONS];
  },
};

// ─── Real API Implementations ─────────────────────────────────────────────────
// These will be used when VITE_USE_MOCK=false

import { apiClient } from './apiClient';

const real = {
  async listTransactions(
    filters: Partial<TransactionFilters>,
  ): Promise<TransactionListResponse> {
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
};

// ─── Exported Service ─────────────────────────────────────────────────────────

export const transactionService = USE_MOCK ? mock : real;
