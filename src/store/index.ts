import { create } from 'zustand';
import type {
  Transaction,
  Rule,
  ToastItem,
  UndoData,
  ToastType,
  TransactionFilters,
  FilterStatus,
  RulePromptData,
  BulkOpportunity,
  Category,
} from '@/types';
import { DEFAULT_CATEGORIES, BULK_THRESHOLD } from '@/constants';

// ─── Store Shape ──────────────────────────────────────────────────────────────

interface AppState {
  // Transactions
  transactions: Transaction[];
  transactionFilters: TransactionFilters;
  isLoadingTransactions: boolean;

  // Rules
  rules: Rule[];
  isLoadingRules: boolean;

  // Categories
  categories: Category[];

  // UI
  toasts: ToastItem[];
  rulePrompt: RulePromptData | null;
  selectedTransactionId: number | null;

  // Actions - Transactions
  setTransactions: (txs: Transaction[]) => void;
  updateTransaction: (tx: Transaction) => void;
  setTransactionFilters: (filters: Partial<TransactionFilters>) => void;
  setLoadingTransactions: (v: boolean) => void;

  // Actions - Rules
  setRules: (rules: Rule[]) => void;
  addRule: (rule: Rule) => void;
  removeRule: (id: string) => void;
  setLoadingRules: (v: boolean) => void;

  // Actions - Categories
  setCategories: (cats: Category[]) => void;
  addCustomCategory: (label: string) => void;

  // Actions - UI
  addToast: (msg: string, type?: ToastType, undoable?: boolean, undoData?: UndoData | null) => void;
  removeToast: (id: number) => void;
  setRulePrompt: (prompt: RulePromptData | null) => void;
  setSelectedTransactionId: (id: number | null) => void;

  // Computed
  getFilteredTransactions: () => Transaction[];
  getBulkOpportunities: () => BulkOpportunity[];
  getSummary: () => {
    total: number;
    uncategorized: number;
    byStatus: Record<string, number>;
    totalDebit: number;
    totalCredit: number;
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  transactions: [],
  transactionFilters: {
    status: 'all' as FilterStatus,
    search: '',
    sortField: 'date',
    sortDirection: 'desc',
  },
  isLoadingTransactions: false,
  rules: [],
  isLoadingRules: false,
  categories: [...DEFAULT_CATEGORIES],
  toasts: [],
  rulePrompt: null,
  selectedTransactionId: null,

  // Transaction actions
  setTransactions: txs => set({ transactions: txs }),
  updateTransaction: tx =>
    set(state => ({
      transactions: state.transactions.map(t => (t.id === tx.id ? tx : t)),
    })),
  setTransactionFilters: filters =>
    set(state => ({
      transactionFilters: { ...state.transactionFilters, ...filters },
    })),
  setLoadingTransactions: v => set({ isLoadingTransactions: v }),

  // Rule actions
  setRules: rules => set({ rules }),
  addRule: rule => set(state => ({ rules: [...state.rules, rule] })),
  removeRule: id => set(state => ({ rules: state.rules.filter(r => r.id !== id) })),
  setLoadingRules: v => set({ isLoadingRules: v }),

  // Category actions
  setCategories: cats => set({ categories: cats }),
  addCustomCategory: label => {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    set(state => {
      if (state.categories.find(c => c.id === id)) return state;
      return {
        categories: [...state.categories, { id, label, isCustom: true }],
      };
    });
  },

  // Toast actions
  addToast: (msg, type = 'success', undoable = false, undoData = null) => {
    const id = Date.now();
    set(state => ({
      toasts: [...state.toasts, { id, msg, type, undoable, undoData }],
    }));
    setTimeout(() => get().removeToast(id), 5000);
  },
  removeToast: id =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  // UI actions
  setRulePrompt: prompt => set({ rulePrompt: prompt }),
  setSelectedTransactionId: id => set({ selectedTransactionId: id }),

  // Computed
  getFilteredTransactions: () => {
    const { transactions, transactionFilters: f } = get();
    let result = [...transactions];

    if (f.status !== 'all') {
      result = result.filter(t => t.status === f.status);
    }

    if (f.search.trim()) {
      const q = f.search.toLowerCase();
      result = result.filter(
        t =>
          t.merchant.toLowerCase().includes(q) ||
          t.pos.toLowerCase().includes(q) ||
          (t.cat ?? '').toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (f.sortField) {
        case 'amount':
          cmp = a.amount - b.amount;
          break;
        case 'merchant':
          cmp = a.merchant.localeCompare(b.merchant);
          break;
        case 'confidence':
          cmp = a.confidence - b.confidence;
          break;
        default:
          cmp = a.date.localeCompare(b.date);
      }
      return f.sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  },

  getBulkOpportunities: () => {
    const { transactions } = get();
    const groups: Record<string, Transaction[]> = {};
    transactions
      .filter(t => !t.cat)
      .forEach(t => {
        if (!groups[t.merchant]) groups[t.merchant] = [];
        groups[t.merchant].push(t);
      });

    return Object.entries(groups)
      .filter(([, arr]) => arr.length >= BULK_THRESHOLD)
      .map(([merchant, arr]) => ({
        merchant,
        count: arr.length,
        txIds: arr.map(t => t.id),
        suggestedCat: arr[0].suggestedCat,
        confidence: arr[0].confidence,
      }));
  },

  getSummary: () => {
    const { transactions } = get();
    return {
      total: transactions.length,
      uncategorized: transactions.filter(t => !t.cat).length,
      byStatus: {
        suggested: transactions.filter(t => t.status === 'suggested').length,
        auto: transactions.filter(t => t.status === 'auto').length,
        review: transactions.filter(t => t.status === 'review').length,
        manual: transactions.filter(t => t.status === 'manual').length,
      },
      totalDebit: transactions
        .filter(t => t.amount < 0)
        .reduce((s, t) => s + Math.abs(t.amount), 0),
      totalCredit: transactions
        .filter(t => t.amount > 0)
        .reduce((s, t) => s + t.amount, 0),
    };
  },
}));
