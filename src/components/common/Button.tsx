import { type ReactNode, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

const VARIANTS: Record<Variant, React.CSSProperties> = {
  primary: {
    background: '#0D0F0E',
    color: 'white',
    border: '1.5px solid #0D0F0E',
  },
  secondary: {
    background: '#FFFFFF',
    color: '#0D0F0E',
    border: '1.5px solid #E2E0D8',
  },
  ghost: {
    background: 'transparent',
    color: '#4A4D48',
    border: '1.5px solid transparent',
  },
  danger: {
    background: 'rgba(196,28,56,0.08)',
    color: '#C41C38',
    border: '1.5px solid rgba(196,28,56,0.2)',
  },
  outline: {
    background: 'transparent',
    color: '#0D0F0E',
    border: '1.5px solid #E2E0D8',
  },
};

const SIZES: Record<Size, React.CSSProperties> = {
  sm: { padding: '5px 12px', fontSize: '11px', height: 30 },
  md: { padding: '8px 16px', fontSize: '13px', height: 36 },
  lg: { padding: '11px 24px', fontSize: '14px', height: 44 },
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}: Readonly<ButtonProps>) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: 8,
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : undefined,
        ...VARIANTS[variant],
        ...SIZES[size],
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : icon ? (
        <span style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </span>
      ) : null}
      {children}
      {iconRight && (
        <span style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {iconRight}
        </span>
      )}
    </button>
  );
}
