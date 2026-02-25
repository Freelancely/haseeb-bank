// ─── Status Types ───────────────────────────────────────────────────────────

export type StatusKey = 'suggested' | 'auto' | 'review' | 'manual';

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  dot: string;
  badge: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;       // numeric account ID (real API) or label string (mock/custom)
  label: string;    // display name — always matches tx.cat returned by the backend
  typeId?: number;
  typeName?: string;
  isCustom?: boolean;
}

// ─── Transaction ─────────────────────────────────────────────────────────────

export interface HistoryEntry {
  action: string;
  cat: string;
  confidence: number | null;
  time: string;
  source: 'engine' | 'rule' | 'manual' | 'bulk' | 'confirm';
  ruleId?: string;
}

export interface Transaction {
  id: number;
  merchant: string;
  amount: number;
  date: string;
  pos: string;
  status: StatusKey;
  cat: string | null;
  confidence: number;
  suggestedCat: string;
  ruleId?: string;
  history: HistoryEntry[];
}

// ─── Rules ───────────────────────────────────────────────────────────────────

export type RuleMode = 'always' | 'ask';

export interface Rule {
  id: string;
  merchant: string;
  category: string;
  mode: RuleMode;
  applied: number;
  created: string;
}

export interface CreateRulePayload {
  merchant: string;
  category: string;
  mode: RuleMode;
}

// ─── Bulk Operations ─────────────────────────────────────────────────────────

export interface BulkOpportunity {
  merchant: string;
  count: number;
  txIds: number[];
  suggestedCat: string;
  confidence: number;
}

// ─── API Response Shapes ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  summary: TransactionSummary;
}

export interface TransactionSummary {
  total: number;
  uncategorized: number;
  byStatus: Record<StatusKey, number>;
  totalDebit: number;
  totalCredit: number;
}

// ─── Filter / Sort ────────────────────────────────────────────────────────────

export type FilterStatus = 'all' | StatusKey;
export type SortField = 'date' | 'amount' | 'merchant' | 'confidence';
export type SortDirection = 'asc' | 'desc';

export interface TransactionFilters {
  status: FilterStatus;
  search: string;
  sortField: SortField;
  sortDirection: SortDirection;
  dateFrom?: string;
  dateTo?: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: number;
  msg: string;
  type: ToastType;
  undoable: boolean;
  undoData: UndoData | null;
}

export interface UndoData {
  txId: number;
  oldCat: string | null;
  oldStatus: StatusKey;
}

// ─── Rule Prompt ──────────────────────────────────────────────────────────────

export interface RulePromptData {
  merchant: string;
  category: string;
  count: number;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalTransactions: number;
  categorized: number;
  pendingReview: number;
  autoApplied: number;
  accuracyRate: number;
  rulesActive: number;
  timeSavedMinutes: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: number;
  type: 'categorization' | 'rule_created' | 'bulk_applied';
  description: string;
  timestamp: string;
}
