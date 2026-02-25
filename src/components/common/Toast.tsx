import type { ToastItem } from '@/types';
import { useAppStore } from '@/store';
import { CheckCircle, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={15} />,
  error: <AlertCircle size={15} />,
  info: <Info size={15} />,
  warning: <AlertCircle size={15} />,
};

const COLORS = {
  success: '#13A362',
  error: '#C41C38',
  info: '#2F6FD4',
  warning: '#D97706',
};

interface ToastItemComponentProps {
  toast: ToastItem;
  onUndo: (t: ToastItem) => void;
}

function ToastItemComponent({ toast: t, onUndo }: Readonly<ToastItemComponentProps>) {
  const { removeToast } = useAppStore();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderRadius: 10,
        background: '#1C1F1D',
        color: 'white',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        animation: 'slideUp 0.25s ease',
        fontSize: 13,
        fontFamily: 'var(--font-sans)',
        minWidth: 280,
        maxWidth: 420,
      }}
    >
      <span style={{ color: COLORS[t.type], flexShrink: 0 }}>{ICONS[t.type]}</span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{t.msg}</span>
      {t.undoable && (
        <button
          onClick={() => onUndo(t)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'rgba(255,255,255,0.7)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            padding: '2px 6px',
            borderRadius: 4,
            transition: 'color 0.1s',
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'white')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        >
          <RotateCcw size={11} />
          Undo
        </button>
      )}
      <button
        onClick={() => removeToast(t.id)}
        style={{
          color: 'rgba(255,255,255,0.4)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function Toasts() {
  const { toasts, addToast } = useAppStore();

  const handleUndo = (t: ToastItem) => {
    if (t.undoData) {
      // Dispatch undo via the transaction update
      // The actual revert logic lives in useTransactions
      // We emit a custom event so the hook can handle it
      globalThis.dispatchEvent(
        new CustomEvent('haseeb:undo', { detail: t.undoData }),
      );
      addToast('Reverted successfully', 'info');
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
      }}
    >
      {toasts.map(t => (
        <ToastItemComponent key={t.id} toast={t} onUndo={handleUndo} />
      ))}
    </div>
  );
}
