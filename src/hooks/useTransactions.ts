import { useCallback, useEffect } from 'react';
import { useAppStore } from '@/store';
import { transactionService } from '@/services';
import type { TransactionFilters } from '@/types';
import type { CreateManualPayload } from '@/services/transactionService';
import { RULE_SUGGESTION_THRESHOLD } from '@/constants';

// ─── useTransactions ──────────────────────────────────────────────────────────

export function useTransactions() {
  const {
    transactions,
    isLoadingTransactions,
    transactionFilters,
    rules,
    setTransactions,
    updateTransaction,
    setTransactionFilters,
    setLoadingTransactions,
    addToast,
    setRulePrompt,
    getFilteredTransactions,
    getBulkOpportunities,
    getSummary,
    categories,
    addCustomCategory,
  } = useAppStore();

  const load = useCallback(
    async (filters?: Partial<TransactionFilters>) => {
      setLoadingTransactions(true);
      try {
        const res = await transactionService.listTransactions(filters ?? transactionFilters);
        setTransactions(res.transactions);
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Failed to load transactions', 'error');
      } finally {
        setLoadingTransactions(false);
      }
    },
    [transactionFilters, setTransactions, setLoadingTransactions, addToast],
  );

  const categorize = useCallback(
    async (
      txId: number,
      categoryId: string,
      source: 'manual' | 'bulk' | 'confirm' = 'manual',
    ) => {
      const tx = transactions.find(t => t.id === txId);
      if (!tx) return;

      const oldCat = tx.cat;
      const oldStatus = tx.status;

      // Resolve human-readable label for toasts and rule prompts
      const categoryLabel = categories.find(c => c.id === categoryId)?.label ?? categoryId;

      try {
        const updated = await transactionService.categorize(txId, { categoryId, source });
        updateTransaction(updated);
        // Refresh the full list so summary counts and filters are up to date
        void load();
        addToast(`Categorized as ${categoryLabel}`, 'success', true, {
          txId,
          oldCat,
          oldStatus,
        });

        // Check if rule suggestion is needed
        const sameMerchant = transactions.filter(t => t.merchant === tx.merchant);
        const hasRule = rules.some(r => r.merchant === tx.merchant);
        if (sameMerchant.length >= RULE_SUGGESTION_THRESHOLD && !hasRule) {
          setTimeout(() => {
            setRulePrompt({ merchant: tx.merchant, category: categoryLabel, count: sameMerchant.length });
          }, 800);
        }
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Failed to categorize', 'error');
      }
    },
    [transactions, rules, categories, load, updateTransaction, addToast, setRulePrompt],
  );

  const bulkCategorize = useCallback(
    async (txIds: number[], categoryId: string) => {
      const categoryLabel = categories.find(c => c.id === categoryId)?.label ?? categoryId;
      try {
        const updated = await transactionService.bulkCategorize({ txIds, categoryId });
        updated.forEach(updateTransaction);
        // Refresh the full list so summary counts and filters are up to date
        void load();
        addToast(`${txIds.length} transactions categorized as ${categoryLabel}`, 'success');
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Bulk categorize failed', 'error');
      }
    },
    [categories, load, updateTransaction, addToast],
  );

  const revert = useCallback(
    async (txId: number) => {
      try {
        const updated = await transactionService.revertTransaction(txId);
        updateTransaction(updated);
        // Refresh the full list so summary counts and filters are up to date
        void load();
        addToast('Reverted to previous state', 'info');
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Revert failed', 'error');
      }
    },
    [load, updateTransaction, addToast],
  );

  const undoCategorization = useCallback(
    async (txId: number) => {
      await revert(txId);
    },
    [revert],
  );

  const createManual = useCallback(
    async (payload: CreateManualPayload) => {
      const tx = await transactionService.createManual(payload);
      // Append to the store and refresh summary via a full reload
      updateTransaction(tx);
      addToast(`Transaction "${payload.merchant}" added`, 'success');
      // Reload to get updated summary counts
      void load();
    },
    [updateTransaction, addToast, load],
  );

  return {
    transactions,
    filteredTransactions: getFilteredTransactions(),
    bulkOpportunities: getBulkOpportunities(),
    summary: getSummary(),
    isLoading: isLoadingTransactions,
    filters: transactionFilters,
    categories,
    load,
    categorize,
    bulkCategorize,
    revert,
    undoCategorization,
    createManual,
    setFilters: setTransactionFilters,
    addCustomCategory,
  };
}

// ─── useTransaction (single) ──────────────────────────────────────────────────

export function useTransaction(id: number | null) {
  const { transactions } = useAppStore();
  return id ? (transactions.find(t => t.id === id) ?? null) : null;
}

// ─── useAutoLoad ──────────────────────────────────────────────────────────────

export function useAutoLoadTransactions() {
  const { load } = useTransactions();
  useEffect(() => {
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
