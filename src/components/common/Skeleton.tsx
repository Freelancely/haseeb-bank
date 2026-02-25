interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, style }: Readonly<SkeletonProps>) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

export function TransactionRowSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '20px 1fr 130px 100px 100px 90px',
        gap: 16,
        padding: '14px 28px',
        borderBottom: '1px solid var(--border-light)',
        alignItems: 'center',
      }}
    >
      <Skeleton width={8} height={8} borderRadius="50%" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton width="60%" height={13} />
        <Skeleton width="40%" height={10} />
      </div>
      <Skeleton width="80%" height={22} borderRadius={6} />
      <Skeleton width="70%" height={13} />
      <Skeleton width="80%" height={18} borderRadius={6} />
      <Skeleton width="65%" height={13} />
    </div>
  );
}

export function CardSkeleton({ height = 100 }: Readonly<{ height?: number }>) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        border: '1.5px solid var(--border)',
        padding: 20,
        height,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton width="40%" height={12} />
        <Skeleton width="60%" height={20} />
        <Skeleton width="80%" height={10} />
      </div>
    </div>
  );
}
