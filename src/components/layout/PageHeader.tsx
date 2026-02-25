import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  mono?: string;
}

export function PageHeader({ title, subtitle, actions, mono: monoText }: Readonly<PageHeaderProps>) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '24px 32px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'white',
        flexShrink: 0,
      }}
    >
      <div>
        {monoText && (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {monoText}
          </p>
        )}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              marginTop: 4,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>
      )}
    </div>
  );
}
