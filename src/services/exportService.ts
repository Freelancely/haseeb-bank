import { API_CONFIG } from '@/constants';
import { ApiError } from './apiClient';
import type { ApiResponse } from '@/types';

export interface ExportParams {
  format: 'csv' | 'json';
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export interface JournalExportEntry {
  journalRef: string;
  date: string;
  merchant: string;
  pos: string;
  entries: {
    account: string;
    accountType: string;
    debit: number;
    credit: number;
  }[];
}

export const exportService = {
  /**
   * Downloads journal entries as CSV or JSON.
   * Throws ApiError with status 422 if uncategorized transactions exist in the range.
   */
  async download(params: ExportParams): Promise<JournalExportEntry[] | void> {
    const query = new URLSearchParams({ format: params.format });
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);

    const url = `${API_CONFIG.BASE_URL}/export?${query.toString()}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: params.format === 'csv' ? 'text/csv' : 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = `Export failed: ${res.status}`;
      try {
        const parsed = JSON.parse(errorText);
        errorMessage = parsed.message ?? errorMessage;
      } catch {
        // ignore
      }
      throw new ApiError(res.status, errorMessage);
    }

    if (params.format === 'csv') {
      const blob = await res.blob();
      const filename = buildFilename('csv', params.startDate, params.endDate);
      triggerDownload(blob, filename);
      return;
    }

    // JSON — parse and trigger download as a .json file
    const body: ApiResponse<JournalExportEntry[]> = await res.json();
    const json = JSON.stringify(body.data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const filename = buildFilename('json', params.startDate, params.endDate);
    triggerDownload(blob, filename);
    return body.data;
  },
};

function buildFilename(ext: string, startDate?: string, endDate?: string): string {
  const from = startDate ? startDate.replace(/-/g, '') : 'all';
  const to = endDate ? endDate.replace(/-/g, '') : 'all';
  return `journal_${from}_${to}.${ext}`;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
