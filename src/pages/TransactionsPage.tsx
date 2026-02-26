import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { TransactionRowSkeleton } from '@/components/common';
import {
  FiltersBar,
  BulkBanner,
  TransactionRow,
  RulePromptModal,
  ExportPanel,
  AddTransactionModal,
} from '@/components/transactions';
import { useTransactions, useRules } from '@/hooks';
import { useAppStore } from '@/store';
import { formatAbsAmount } from '@/utils';

export function TransactionsPage() {
  const navigate = useNavigate();
  const {
    transactions,
    filteredTransactions,
    summary,
    isLoading,
    filters,
    categories,
    load,
    bulkCategorize,
    createManual,
    setFilters,
  } = useTransactions();
  const { createRule, rulePrompt, setRulePrompt } = useRules();
  const { setSelectedTransactionId } = useAppStore();

  const [showExport, setShowExport] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  useEffect(() => {
    if (transactions.length === 0) {
      void load();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRowClick = (id: number) => {
    setSelectedTransactionId(id);
    navigate(`/transactions/${id}`);
  };

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Transactions"
        subtitle={`${summary.uncategorized} uncategorized · ${summary.total} total`}
        mono="Transaction Review"
        actions={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Debit / Credit summary */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                padding: '8px 16px',
                borderRadius: 8,
                background: 'var(--bg)',
                border: '1.5px solid var(--border)',
                fontSize: 12,
              }}
            >
              <span style={{ color: 'var(--red)' }}>
                –{formatAbsAmount(summary.totalDebit)}{' '}
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>KWD</span>
              </span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span style={{ color: 'var(--green)' }}>
                +{formatAbsAmount(summary.totalCredit)}{' '}
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>KWD</span>
              </span>
            </div>

            {/* Export button */}
            <button
              onClick={() => setShowExport(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                background: 'white',
                border: '1.5px solid var(--border)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-mid)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--text-mid)';
                e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-mid)';
              }}
            >
              <Download size={13} />
              Export
            </button>

            {/* Add Transaction button */}
            <button
              onClick={() => setShowAddTransaction(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                background: 'var(--bg-dark)',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                color: 'white',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <Plus size={13} />
              Add Transaction
            </button>
          </div>
        }
      />

      <FiltersBar filters={filters} onFilterChange={setFilters} summary={summary} />
      <BulkBanner onApply={bulkCategorize} />

      {/* Table header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '8px 1fr 150px 110px 110px 130px 20px',
          gap: 16,
          padding: '9px 28px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
          flexShrink: 0,
        }}
      >
        {['', 'Transaction', 'Category', 'Amount', 'Confidence', 'Status', ''].map((h, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              color: 'var(--text-muted)',
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'white' }}>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <TransactionRowSkeleton key={i} />)
        ) : filteredTransactions.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 60,
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No transactions match</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Try adjusting your filters</div>
          </div>
        ) : (
          filteredTransactions.map(tx => (
            <TransactionRow key={tx.id} transaction={tx} onClick={handleRowClick} />
          ))
        )}
      </div>

      {/* Footer bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 28px',
          borderTop: '1px solid var(--border)',
          background: 'white',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          Haseeb Bank Prototype v1 · Engine: Deterministic + Supervised Learning
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            color: 'var(--text-muted)',
          }}
        >
          {filteredTransactions.length} shown · {summary.total} total
        </span>
      </div>

      {/* Rule Prompt Modal */}
      {rulePrompt && (
        <RulePromptModal
          prompt={rulePrompt}
          onConfirm={mode => {
            void createRule({
              merchant: rulePrompt.merchant,
              category: rulePrompt.category,
              mode,
            });
          }}
          onDismiss={() => setRulePrompt(null)}
        />
      )}

      {/* Export Panel */}
      {showExport && <ExportPanel onClose={() => setShowExport(false)} />}

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <AddTransactionModal
          categories={categories}
          onSubmit={createManual}
          onClose={() => setShowAddTransaction(false)}
        />
      )}
    </div>
  );
}
