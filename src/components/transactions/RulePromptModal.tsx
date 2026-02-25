import { useState } from 'react';
import type { RulePromptData, RuleMode } from '@/types';
import { RefreshCw, X } from 'lucide-react';

interface RulePromptModalProps {
  prompt: RulePromptData;
  onConfirm: (mode: RuleMode) => void;
  onDismiss: () => void;
}

export function RulePromptModal({ prompt, onConfirm, onDismiss }: RulePromptModalProps) {
  const [selected, setSelected] = useState<'always' | 'ask' | 'ignore'>('always');

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 16,
          width: 440,
          padding: 28,
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
          animation: 'scaleIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--amber-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--amber)',
                flexShrink: 0,
              }}
            >
              <RefreshCw size={18} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Recurring Pattern</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {prompt.count} transactions from this merchant
              </div>
            </div>
          </div>
          <button
            onClick={onDismiss}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 20 }}>
          Create a rule for future transactions from{' '}
          <strong style={{ color: 'var(--text)' }}>{prompt.merchant}</strong>?
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {([
            {
              id: 'always' as const,
              label: `Always auto-categorize as ${prompt.category}`,
              description: 'Future transactions will be automatically categorized',
            },
            {
              id: 'ask' as const,
              label: 'Ask me each time',
              description: 'Suggest the category but require confirmation',
            },
            {
              id: 'ignore' as const,
              label: "Don't create a rule",
              description: 'Handle these manually every time',
            },
          ]).map(opt => (
            <label
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 10,
                border: `1.5px solid ${selected === opt.id ? 'var(--bg-dark)' : 'var(--border)'}`,
                cursor: 'pointer',
                background: selected === opt.id ? 'rgba(0,0,0,0.02)' : 'white',
                transition: 'all 0.15s',
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: `2px solid ${selected === opt.id ? 'var(--bg-dark)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {selected === opt.id && (
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: 'var(--bg-dark)',
                    }}
                  />
                )}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {opt.description}
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              if (selected !== 'ignore') {
                onConfirm(selected as RuleMode);
              } else {
                onDismiss();
              }
            }}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              background: 'var(--bg-dark)',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {selected === 'ignore' ? 'Dismiss' : 'Create Rule'}
          </button>
          <button
            onClick={onDismiss}
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              background: 'white',
              border: '1.5px solid var(--border)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text-mid)',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
