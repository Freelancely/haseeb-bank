import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, History, RotateCcw, ExternalLink } from 'lucide-react';
import { StatusBadge, ConfidenceBadge } from '@/components/common';
import { PageHeader } from '@/components/layout';
import { CategorySelector } from '@/components/transactions';
import { useTransaction, useTransactions, useRules } from '@/hooks';
import { formatAmount, formatDate, formatTxId } from '@/utils';
import { RulePromptModal } from '@/components/transactions';

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const txId = id ? parseInt(id, 10) : null;
  const tx = useTransaction(txId);
  const { categorize, revert, categories, addCustomCategory } = useTransactions();
  const { rules, createRule, rulePrompt, setRulePrompt } = useRules();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!tx && txId) {
      navigate('/transactions');
    }
  }, [tx, txId, navigate]);

  if (!tx) return null;

  const ruleForTx = tx.ruleId ? rules.find(r => r.id === tx.ruleId) : null;

  // Resolve suggestedCat (a name string) to the account ID so we can pass the ID to categorize
  const suggestedCatEntry = tx.suggestedCat
    ? categories.find(c => c.label === tx.suggestedCat)
    : undefined;

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title={tx.merchant}
        mono={formatTxId(tx.id)}
        actions={
          <button
            onClick={() => navigate('/transactions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 8,
              border: '1.5px solid var(--border)',
              background: 'white',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-mid)',
            }}
          >
            <ArrowLeft size={13} />
            Back
          </button>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {/* Status Row */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}
          >
            <StatusBadge status={tx.status} />
            {ruleForTx && (
              <button
                onClick={() => navigate('/rules')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontFamily: 'var(--font-mono)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: 'var(--bg)',
                  border: '1.5px solid var(--border)',
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {tx.ruleId}
                <ExternalLink size={9} />
              </button>
            )}
          </div>

          {/* Transaction Card */}
          <div
            style={{
              background: 'var(--bg-dark)',
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                padding: '24px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9.5,
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  Kuwait International Bank
                </p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'white',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {tx.merchant}
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 32,
                    fontWeight: 500,
                    color: tx.amount < 0 ? '#FF6B6B' : '#63E2A0',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  {formatAmount(tx.amount)}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.3)',
                    marginTop: 6,
                    letterSpacing: '0.1em',
                  }}
                >
                  KWD {tx.amount < 0 ? 'DEBIT' : 'CREDIT'}
                </div>
              </div>
            </div>

            {/* Meta row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {[
                ['Date', formatDate(tx.date)],
                ['Terminal', tx.pos],
                ['Confidence', `${tx.confidence}%`],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  style={{
                    padding: '14px 20px',
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </p>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div
            style={{
              background: 'white',
              borderRadius: 14,
              border: '1.5px solid var(--border)',
              padding: '22px 24px',
              marginBottom: 16,
            }}
          >
            <CategorySelector
              categories={categories}
              selectedCategory={tx.cat}
              suggestedCat={tx.suggestedCat}
              confidence={tx.confidence}
              onSelect={id => categorize(tx.id, id, 'manual')}
              onConfirmSuggestion={
                suggestedCatEntry
                  ? () => categorize(tx.id, suggestedCatEntry.id, 'confirm')
                  : undefined
              }
              onNewCategory={label => {
                addCustomCategory(label);
                categorize(tx.id, label, 'manual');
              }}
            />
          </div>

          {/* Revert Button */}
          {tx.cat && tx.history.length > 1 && (
            <button
              onClick={() => revert(tx.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '10px 16px',
                borderRadius: 9,
                background: 'white',
                border: '1.5px solid var(--border)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--text-mid)',
                marginBottom: 16,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-mid)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <RotateCcw size={13} />
              Revert to Previous State
            </button>
          )}

          {/* History */}
          <div
            style={{
              background: 'white',
              borderRadius: 14,
              border: '1.5px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                borderBottom: showHistory ? '1px solid var(--border)' : 'none',
              }}
            >
              <History size={14} color="var(--text-muted)" />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9.5,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  flex: 1,
                }}
              >
                Categorization History ({tx.history.length})
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  transform: showHistory ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}
              >
                ▾
              </span>
            </button>

            {showHistory && (
              <div>
                {tx.history.map((entry, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '110px 1fr 120px',
                      gap: 12,
                      padding: '11px 20px',
                      borderBottom:
                        i < tx.history.length - 1 ? '1px solid var(--border-light)' : 'none',
                      fontSize: 12,
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                      }}
                    >
                      {entry.time}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{entry.action}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                        → {entry.cat}
                        {entry.confidence ? ` · ${entry.confidence}% confidence` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9.5,
                          color: 'var(--text-muted)',
                          padding: '2px 7px',
                          borderRadius: 4,
                          background: 'var(--bg)',
                        }}
                      >
                        {entry.source}
                        {entry.ruleId ? ` · ${entry.ruleId}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confidence detail */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 20px',
              marginTop: 16,
              background: 'white',
              borderRadius: 12,
              border: '1.5px solid var(--border)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                flex: 1,
              }}
            >
              Engine confidence score
            </p>
            <ConfidenceBadge value={tx.confidence} showBar />
          </div>
        </div>
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
    </div>
  );
}
