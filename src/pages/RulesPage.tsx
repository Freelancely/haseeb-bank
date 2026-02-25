import { useEffect } from 'react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/common';
import { useRules } from '@/hooks';
import { BookOpen, Trash2, Zap, MessageSquare } from 'lucide-react';
import type { Rule } from '@/types';

function RuleCard({ rule, onDelete }: { rule: Rule; onDelete: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        background: 'white',
        borderRadius: 12,
        border: '1.5px solid var(--border)',
        marginBottom: 10,
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Icon */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: 'var(--green-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--green)',
          flexShrink: 0,
        }}
      >
        <BookOpen size={18} />
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{rule.merchant}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            →
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 5,
              background: 'var(--blue-bg)',
              color: 'var(--blue)',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {rule.category}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 5,
              background: rule.mode === 'always' ? 'var(--green-bg)' : 'var(--amber-bg)',
              color: rule.mode === 'always' ? 'var(--green)' : 'var(--amber)',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {rule.mode === 'always' ? <Zap size={10} /> : <MessageSquare size={10} />}
            {rule.mode === 'always' ? 'Auto-apply' : 'Ask each time'}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
            }}
          >
            {rule.applied} applied · Created {rule.created}
          </span>
        </div>
      </div>

      {/* Rule ID */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          padding: '3px 8px',
          borderRadius: 6,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
        }}
      >
        {rule.id}
      </span>

      {/* Delete */}
      <Button variant="danger" size="sm" icon={<Trash2 size={11} />} onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}

export function RulesPage() {
  const { rules, isLoading, load, deleteRule } = useRules();

  useEffect(() => {
    if (rules.length === 0) {
      void load();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Rule Registry"
        subtitle="Auto-categorization rules applied to matching transactions"
        mono="Transaction Intelligence"
        actions={
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              padding: '6px 12px',
              borderRadius: 7,
              background: 'var(--bg)',
              border: '1.5px solid var(--border)',
            }}
          >
            {rules.length} active rule{rules.length !== 1 ? 's' : ''}
          </div>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ maxWidth: 760 }}>
          {/* Explainer */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 10,
              background: 'var(--blue-bg)',
              border: '1.5px solid rgba(26,79,173,0.15)',
              marginBottom: 24,
              fontSize: 13,
              color: 'var(--text-mid)',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: 'var(--blue)' }}>How rules work:</strong> When the engine
            detects 3+ transactions from the same merchant, it suggests creating a rule. Rules
            either auto-apply a category or prompt for confirmation on each transaction.
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: 74, borderRadius: 12 }}
                />
              ))}
            </div>
          ) : rules.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 60,
                background: 'white',
                borderRadius: 14,
                border: '1.5px dashed var(--border)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'var(--bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  marginBottom: 16,
                }}
              >
                <BookOpen size={22} />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                No rules yet
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 300 }}>
                Rules are created automatically when you categorize recurring merchant transactions.
                Start categorizing to unlock rule suggestions.
              </p>
            </div>
          ) : (
            rules.map(rule => (
              <RuleCard
                key={rule.id}
                rule={rule}
                onDelete={() => deleteRule(rule.id)}
              />
            ))
          )}

          {rules.length > 0 && (
            <div
              style={{
                marginTop: 20,
                padding: '14px 18px',
                borderRadius: 10,
                background: 'var(--bg)',
                border: '1.5px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {rules.filter(r => r.mode === 'always').length}
                  </div>
                  <div
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                  >
                    Auto-apply
                  </div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {rules.reduce((s, r) => s + r.applied, 0)}
                  </div>
                  <div
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                  >
                    Total Applied
                  </div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {rules.length}
                  </div>
                  <div
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                  >
                    Active Rules
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
