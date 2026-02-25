import { CURRENCY } from '@/constants';

// ─── Currency Formatting ──────────────────────────────────────────────────────

export const formatAmount = (amount: number): string => {
  const sign = amount < 0 ? '–' : '+';
  const abs = Math.abs(amount)
    .toFixed(3)
    .replace(/\B(?=(\d{3})+\.)/g, ',');
  return `${sign}${abs}`;
};

export const formatAmountWithCurrency = (amount: number): string =>
  `${formatAmount(amount)} ${CURRENCY}`;

export const formatAbsAmount = (amount: number): string =>
  Math.abs(amount)
    .toFixed(3)
    .replace(/\B(?=(\d{3})+\.)/g, ',');

// ─── Date Formatting ──────────────────────────────────────────────────────────

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateShort = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
};

export const formatTimestamp = (isoStr: string): string => {
  const d = new Date(isoStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateShort(isoStr);
};

// ─── ID Formatting ────────────────────────────────────────────────────────────

export const formatTxId = (id: number): string => `TX-${String(id).padStart(4, '0')}`;

// ─── Confidence ───────────────────────────────────────────────────────────────

export const confidenceColor = (confidence: number): string => {
  if (confidence >= 80) return '#0A6B40';
  if (confidence >= 60) return '#A85C08';
  return '#C41C38';
};

export const confidenceLabel = (confidence: number): string => {
  if (confidence >= 90) return 'Very High';
  if (confidence >= 75) return 'High';
  if (confidence >= 60) return 'Medium';
  if (confidence >= 40) return 'Low';
  return 'Very Low';
};

// ─── String Utilities ─────────────────────────────────────────────────────────

export const truncate = (str: string, maxLen: number): string =>
  str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;

export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export const initials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase();

// ─── Class Names ──────────────────────────────────────────────────────────────

export const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ');
