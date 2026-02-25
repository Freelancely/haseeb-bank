import type { Category, StatusConfig, StatusKey } from '@/types';

// ─── Design Tokens ────────────────────────────────────────────────────────────

export const COLORS = {
  bg: '#F5F4F0',
  bgAlt: '#FFFFFF',
  bgDark: '#0D0F0E',
  bgMid: '#1C1F1D',
  bgCard: '#FAFAF8',
  border: '#E2E0D8',
  borderLight: '#EDECE8',
  text: '#0D0F0E',
  textMid: '#4A4D48',
  textMuted: '#8C8F88',

  // Brand
  brand: '#1A3A2A',
  brandLight: '#2A5C42',
  brandBg: 'rgba(26,58,42,0.06)',

  // Semantic
  red: '#C41C38',
  redLight: '#E53E56',
  redBg: 'rgba(196,28,56,0.07)',
  redBorder: 'rgba(196,28,56,0.2)',

  green: '#0A6B40',
  greenLight: '#13A362',
  greenBg: 'rgba(10,107,64,0.07)',
  greenBorder: 'rgba(10,107,64,0.2)',

  amber: '#A85C08',
  amberLight: '#D97706',
  amberBg: 'rgba(168,92,8,0.07)',
  amberBorder: 'rgba(168,92,8,0.2)',

  blue: '#1A4FAD',
  blueLight: '#2F6FD4',
  blueBg: 'rgba(26,79,173,0.07)',
  blueBorder: 'rgba(26,79,173,0.2)',

  gold: '#C9A84C',
  goldLight: '#E2C46E',
  goldBg: 'rgba(201,168,76,0.08)',
} as const;

// ─── Status System ────────────────────────────────────────────────────────────

export const STATUS: Record<StatusKey, StatusConfig> = {
  suggested: {
    label: 'Suggested',
    color: COLORS.amber,
    bg: COLORS.amberBg,
    dot: '●',
    badge: 'amber',
  },
  auto: {
    label: 'Auto-Categorized',
    color: COLORS.green,
    bg: COLORS.greenBg,
    dot: '●',
    badge: 'green',
  },
  review: {
    label: 'Needs Review',
    color: COLORS.red,
    bg: COLORS.redBg,
    dot: '●',
    badge: 'red',
  },
  manual: {
    label: 'Manual',
    color: COLORS.blue,
    bg: COLORS.blueBg,
    dot: '●',
    badge: 'blue',
  },
};

// ─── Default Categories ───────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'opex', label: 'Operating Expense' },
  { id: 'cogs', label: 'Cost of Goods Sold' },
  { id: 'inventory', label: 'Inventory Purchase' },
  { id: 'drawing', label: 'Owner Drawing' },
  { id: 'rent', label: 'Rent & Utilities' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'travel', label: 'Travel & Transport' },
  { id: 'supplies', label: 'Office Supplies' },
  { id: 'professional', label: 'Professional Fees' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'other-income', label: 'Other Income' },
];

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/' },
  { id: 'transactions', label: 'Transactions', path: '/transactions' },
  { id: 'rules', label: 'Rules', path: '/rules' },
] as const;

// ─── API Config ───────────────────────────────────────────────────────────────

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  TIMEOUT: 10_000,
  MOCK_DELAY: 400,
} as const;

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const BULK_THRESHOLD = 2; // min transactions to trigger bulk prompt
export const RULE_SUGGESTION_THRESHOLD = 3; // min transactions to suggest a rule
export const TOAST_DURATION = 5000;
export const CURRENCY = 'KWD';
