import type { StatusKey } from '@/types';
import { STATUS } from '@/constants';

interface BadgeProps {
  status: StatusKey;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

const DOT_COLOR: Record<StatusKey, string> = {
  review: '#C41C38',
  suggested: '#A85C08',
  auto: '#0A6B40',
  manual: '#1A4FAD',
};

export function StatusBadge({ status, size = 'md', showDot = true }: Readonly<BadgeProps>) {
  const st = STATUS[status];
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 7px' : '3px 10px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding,
        borderRadius: 6,
        background: st.bg,
        color: st.color,
        fontSize,
        fontWeight: 600,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {showDot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: DOT_COLOR[status],
            flexShrink: 0,
          }}
        />
      )}
      {st.label}
    </span>
  );
}

interface ConfidenceBadgeProps {
  value: number;
  showBar?: boolean;
}

export function ConfidenceBadge({ value, showBar = true }: Readonly<ConfidenceBadgeProps>) {
  const color = value >= 80 ? '#0A6B40' : value >= 60 ? '#A85C08' : '#C41C38';
  const bg = value >= 80 ? 'rgba(10,107,64,0.07)' : value >= 60 ? 'rgba(168,92,8,0.07)' : 'rgba(196,28,56,0.07)';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        borderRadius: 6,
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {showBar && (
        <span
          style={{
            display: 'inline-block',
            width: 32,
            height: 3,
            borderRadius: 2,
            background: 'rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              display: 'block',
              width: `${value}%`,
              height: '100%',
              background: color,
              borderRadius: 2,
            }}
          />
        </span>
      )}
      {value}%
    </span>
  );
}
