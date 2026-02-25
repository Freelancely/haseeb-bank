import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout';
import { CardSkeleton } from '@/components/common';
import { dashboardService } from '@/services';
import { useAppStore } from '@/store';
import type { DashboardStats } from '@/types';
import { formatAbsAmount, formatTimestamp } from '@/utils';
import { TrendingUp, TrendingDown, CheckCircle, Clock, Zap, BookOpen } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color?: string;
  bg?: string;
}

function StatCard({ label, value, sub, icon, color = '#0D0F0E', bg = 'rgba(0,0,0,0.04)' }: StatCardProps) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        border: '1.5px solid var(--border)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </p>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          {icon}
        </div>
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: 'var(--text)',
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {sub && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { getSummary, transactions } = useAppStore();
  const summary = getSummary();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then(s => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  const categorizedCount = transactions.filter(t => t.cat !== null).length;
  const autoCount = transactions.filter(t => t.status === 'auto').length;

  const ACTIVITY_ICONS = {
    categorization: <CheckCircle size={12} />,
    rule_created: <BookOpen size={12} />,
    bulk_applied: <Zap size={12} />,
  };

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Dashboard"
        subtitle="Financial intelligence overview"
        mono="Kuwait International Bank · Haseeb Engine"
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        {/* Stat Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} height={120} />)
          ) : (
            <>
              <StatCard
                label="Total Transactions"
                value={summary.total}
                sub="This period"
                icon={<TrendingUp size={15} />}
              />
              <StatCard
                label="Categorized"
                value={categorizedCount}
                sub={`${summary.total - summary.uncategorized} of ${summary.total}`}
                icon={<CheckCircle size={15} />}
                color="#0A6B40"
                bg="rgba(10,107,64,0.08)"
              />
              <StatCard
                label="Pending Review"
                value={summary.byStatus.review ?? 0}
                sub="Require attention"
                icon={<Clock size={15} />}
                color="#C41C38"
                bg="rgba(196,28,56,0.08)"
              />
              <StatCard
                label="Auto-Categorized"
                value={autoCount}
                sub="Via rules engine"
                icon={<Zap size={15} />}
                color="#1A4FAD"
                bg="rgba(26,79,173,0.08)"
              />
              <StatCard
                label="Total Debit"
                value={`${formatAbsAmount(summary.totalDebit)} KWD`}
                sub="Outflows"
                icon={<TrendingDown size={15} />}
                color="#C41C38"
                bg="rgba(196,28,56,0.08)"
              />
              <StatCard
                label="Total Credit"
                value={`${formatAbsAmount(summary.totalCredit)} KWD`}
                sub="Inflows"
                icon={<TrendingUp size={15} />}
                color="#0A6B40"
                bg="rgba(10,107,64,0.08)"
              />
            </>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Breakdown */}
          <div
            style={{
              background: 'white',
              borderRadius: 14,
              border: '1.5px solid var(--border)',
              padding: '20px 22px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9.5,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Status Breakdown
            </p>
            {(
              [
                { key: 'review', label: 'Needs Review', color: '#C41C38', bg: '#C41C38' },
                { key: 'suggested', label: 'Suggested', color: '#A85C08', bg: '#A85C08' },
                { key: 'auto', label: 'Auto-Categorized', color: '#0A6B40', bg: '#0A6B40' },
                { key: 'manual', label: 'Manual', color: '#1A4FAD', bg: '#1A4FAD' },
              ] as const
            ).map(s => {
              const count = summary.byStatus[s.key] ?? 0;
              const pct = summary.total > 0 ? (count / summary.total) * 100 : 0;
              return (
                <div key={s.key} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 500, color: s.color }}>
                      {s.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-muted)',
                      }}
                    >
                      {count} · {Math.round(pct)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      borderRadius: 3,
                      background: 'var(--border)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: s.bg,
                        borderRadius: 3,
                        transition: 'width 0.6s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div
            style={{
              background: 'white',
              borderRadius: 14,
              border: '1.5px solid var(--border)',
              padding: '20px 22px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9.5,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Recent Activity
            </p>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 7 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 11, width: '70%', marginBottom: 5 }} />
                      <div className="skeleton" style={{ height: 9, width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : stats?.recentActivity.length ? (
              stats.recentActivity.map(act => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: 'var(--bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-mid)',
                      flexShrink: 0,
                    }}
                  >
                    {ACTIVITY_ICONS[act.type]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{act.description}</div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                        marginTop: 2,
                      }}
                    >
                      {formatTimestamp(act.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
                No activity yet
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 20,
            padding: 20,
            background: 'white',
            borderRadius: 14,
            border: '1.5px solid var(--border)',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
              {summary.uncategorized > 0
                ? `${summary.uncategorized} transactions need attention`
                : 'All transactions categorized ✓'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {summary.uncategorized > 0
                ? 'Review and categorize pending transactions to maintain accurate records'
                : 'Great work! Your transaction ledger is fully categorized'}
            </div>
          </div>
          {summary.uncategorized > 0 && (
            <button
              onClick={() => navigate('/transactions')}
              style={{
                padding: '10px 20px',
                borderRadius: 9,
                background: 'var(--bg-dark)',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                color: 'white',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Review Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
