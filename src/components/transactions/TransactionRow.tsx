import type { Transaction } from '@/types';
import { StatusBadge, ConfidenceBadge } from '@/components/common';
import { formatAmount, formatDate } from '@/utils';
import { ChevronRight } from 'lucide-react';

interface TransactionRowProps {
  transaction: Transaction;
  onClick: (id: number) => void;
}

export function TransactionRow({ transaction: tx, onClick }: TransactionRowProps) {
  const isDebit = tx.amount < 0;

  return (
    <div
      onClick={() => onClick(tx.id)}
      style={{
        display: 'grid',
        gridTemplateColumns: '8px 1fr 150px 110px 110px 130px 20px',
        gap: 16,
        padding: '13px 28px',
        borderBottom: '1px solid var(--border-light)',
        cursor: 'pointer',
        background: 'white',
        transition: 'background 0.1s',
        alignItems: 'center',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF8')}
      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
    >
      {/* Status dot */}
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background:
            tx.status === 'review'
              ? '#C41C38'
              : tx.status === 'suggested'
                ? '#A85C08'
                : tx.status === 'auto'
                  ? '#0A6B40'
                  : '#1A4FAD',
          flexShrink: 0,
        }}
      />

      {/* Merchant / Date */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
          {tx.merchant}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            display: 'flex',
            gap: 6,
          }}
        >
          <span>{tx.pos}</span>
          <span>·</span>
          <span>{formatDate(tx.date)}</span>
        </div>
      </div>

      {/* Category */}
      <div>
        {tx.cat ? (
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              background:
                tx.status === 'auto'
                  ? 'var(--green-bg)'
                  : tx.status === 'manual'
                    ? 'var(--blue-bg)'
                    : 'var(--amber-bg)',
              color:
                tx.status === 'auto'
                  ? 'var(--green)'
                  : tx.status === 'manual'
                    ? 'var(--blue)'
                    : 'var(--amber)',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {tx.cat}
          </span>
        ) : tx.suggestedCat ? (
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              background: 'rgba(168,92,8,0.06)',
              color: 'var(--amber)',
              fontSize: 11,
              fontWeight: 600,
              fontStyle: 'italic',
            }}
          >
            {tx.suggestedCat}?
          </span>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Uncategorized</span>
        )}
      </div>

      {/* Amount */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 600,
          color: isDebit ? 'var(--red)' : 'var(--green)',
          textAlign: 'right',
        }}
      >
        {formatAmount(tx.amount)}
        <div style={{ fontSize: 9, fontWeight: 400, color: 'var(--text-muted)', marginTop: 1 }}>
          KWD
        </div>
      </div>

      {/* Confidence */}
      <div>
        <ConfidenceBadge value={tx.confidence} />
      </div>

      {/* Status badge */}
      <div>
        <StatusBadge status={tx.status} size="sm" />
      </div>

      {/* Arrow */}
      <ChevronRight size={14} color="var(--text-muted)" />
    </div>
  );
}
