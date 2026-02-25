import { Search, SlidersHorizontal } from 'lucide-react';
import type { FilterStatus, TransactionFilters } from '@/types';
import { useAppStore } from '@/store';

interface FiltersBarProps {
  filters: TransactionFilters;
  onFilterChange: (f: Partial<TransactionFilters>) => void;
  summary: {
    total: number;
    byStatus: Record<string, number>;
    uncategorized: number;
  };
}

const STATUS_TABS: { id: FilterStatus; label: string; dot: string }[] = [
  { id: 'all', label: 'All', dot: '' },
  { id: 'review', label: 'Needs Review', dot: '🔴' },
  { id: 'suggested', label: 'Suggested', dot: '🟡' },
  { id: 'auto', label: 'Auto', dot: '🟢' },
  { id: 'manual', label: 'Manual', dot: '🔵' },
];

export function FiltersBar({ filters, onFilterChange, summary }: FiltersBarProps) {
  const countFor = (id: FilterStatus): number => {
    if (id === 'all') return summary.total;
    return summary.byStatus[id] ?? 0;
  };

  return (
    <div
      style={{
        background: 'white',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      {/* Search row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 28px',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1.5px solid var(--border)',
            background: 'var(--bg)',
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search merchant, terminal, category…"
            value={filters.search}
            onChange={e => onFilterChange({ search: e.target.value })}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              outline: 'none',
              fontSize: 13,
              color: 'var(--text)',
            }}
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: 14,
                lineHeight: 1,
                padding: 2,
              }}
            >
              ×
            </button>
          )}
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1.5px solid var(--border)',
            background: 'var(--bg)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-mid)',
          }}
        >
          <SlidersHorizontal size={13} />
          Sort
        </button>
      </div>

      {/* Status tabs */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '10px 28px',
          overflowX: 'auto',
        }}
      >
        {STATUS_TABS.map(tab => {
          const isActive = filters.status === tab.id;
          const count = countFor(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange({ status: tab.id })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 7,
                border: `1.5px solid ${isActive ? 'var(--bg-dark)' : 'var(--border)'}`,
                background: isActive ? 'var(--bg-dark)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-mid)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {tab.dot && <span>{tab.dot}</span>}
              {tab.label}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  opacity: 0.7,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Bulk Opportunity Banner ──────────────────────────────────────────────────

interface BulkBannerProps {
  onApply: (txIds: number[], category: string) => void;
}

export function BulkBanner({ onApply }: BulkBannerProps) {
  const { getBulkOpportunities } = useAppStore();
  const opportunities = getBulkOpportunities();

  if (opportunities.length === 0) return null;

  return (
    <div
      style={{
        padding: '10px 28px',
        background: 'rgba(168,92,8,0.05)',
        borderBottom: '1px solid rgba(168,92,8,0.15)',
        flexShrink: 0,
      }}
    >
      {opportunities.map(b => (
        <div
          key={b.merchant}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '10px 16px',
            background: 'white',
            borderRadius: 10,
            border: '1.5px solid rgba(168,92,8,0.15)',
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(168,92,8,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            ⚡
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {b.count} similar transactions — {b.merchant}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
              Suggested: {b.suggestedCat} · {b.confidence}% confidence
            </div>
          </div>
          <button
            onClick={() => onApply(b.txIds, b.suggestedCat)}
            style={{
              padding: '6px 14px',
              borderRadius: 7,
              background: 'var(--bg-dark)',
              border: 'none',
              fontSize: 11,
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Apply All
          </button>
          <button
            style={{
              padding: '6px 14px',
              borderRadius: 7,
              background: 'white',
              border: '1.5px solid var(--border)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text-mid)',
              whiteSpace: 'nowrap',
            }}
          >
            Review
          </button>
        </div>
      ))}
    </div>
  );
}
