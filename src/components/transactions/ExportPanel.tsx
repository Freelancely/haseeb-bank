import { useState } from 'react';
import { Download, X, FileText, FileJson, AlertTriangle } from 'lucide-react';
import { exportService } from '@/services/exportService';
import { ApiError } from '@/services';

interface ExportPanelProps {
  onClose: () => void;
}

export function ExportPanel({ onClose }: ExportPanelProps) {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await exportService.download({
        format,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Download failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
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
          width: 420,
          padding: 28,
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
          animation: 'scaleIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--brand-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand)',
                flexShrink: 0,
              }}
            >
              <Download size={18} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Export Journal Entries</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Double-entry accounting format</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Format selector */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Format
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {([
            { id: 'csv' as const, label: 'CSV Spreadsheet', icon: <FileText size={16} />, desc: 'Excel / Google Sheets' },
            { id: 'json' as const, label: 'JSON File', icon: <FileJson size={16} />, desc: 'Structured data export' },
          ]).map(opt => (
            <button
              key={opt.id}
              onClick={() => setFormat(opt.id)}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: `1.5px solid ${format === opt.id ? 'var(--bg-dark)' : 'var(--border)'}`,
                background: format === opt.id ? 'var(--bg-dark)' : 'white',
                color: format === opt.id ? 'white' : 'var(--text)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                {opt.icon}
                <span style={{ fontSize: 13, fontWeight: 600 }}>{opt.label}</span>
              </div>
              <div style={{ fontSize: 10, opacity: format === opt.id ? 0.6 : undefined, color: format !== opt.id ? 'var(--text-muted)' : undefined }}>
                {opt.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Date range */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Date Range <span style={{ opacity: 0.5 }}>(optional)</span>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>From</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 10px',
                borderRadius: 8,
                border: '1.5px solid var(--border)',
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
                color: 'var(--text)',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>To</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              min={startDate || undefined}
              style={{
                width: '100%',
                padding: '9px 10px',
                borderRadius: 8,
                border: '1.5px solid var(--border)',
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
                color: 'var(--text)',
              }}
            />
          </div>
        </div>

        {/* Error / uncategorized warning */}
        {error && (
          <div
            style={{
              display: 'flex',
              gap: 10,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'var(--red-bg)',
              border: '1.5px solid rgba(196,28,56,0.25)',
              marginBottom: 18,
            }}
          >
            <AlertTriangle size={15} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: 'var(--red)', lineHeight: 1.5, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => void handleDownload()}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              background: isLoading ? 'rgba(0,0,0,0.1)' : 'var(--bg-dark)',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              color: isLoading ? 'var(--text-muted)' : 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Download size={14} />
            {isLoading ? 'Downloading…' : `Download ${format.toUpperCase()}`}
          </button>
          <button
            onClick={onClose}
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
