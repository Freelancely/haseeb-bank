import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { CategorySelector } from './CategorySelector';
import type { Category } from '@/types';
import type { CreateManualPayload } from '@/services/transactionService';

interface AddTransactionModalProps {
  categories: Category[];
  onSubmit: (payload: CreateManualPayload) => Promise<void>;
  onClose: () => void;
}

export function AddTransactionModal({ categories, onSubmit, onClose }: AddTransactionModalProps) {
  const today = new Date().toISOString().split('T')[0];

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [date, setDate] = useState(today);
  const [pos, setPos] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Derive the label for the currently selected category (needed by CategorySelector)
  const selectedCategoryLabel =
    selectedCategoryId != null
      ? (categories.find(c => c.id === selectedCategoryId)?.label ?? null)
      : null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!merchant.trim()) newErrors.merchant = 'Merchant name is required';
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) newErrors.amount = 'Enter a positive amount';
    if (!date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        merchant: merchant.trim(),
        amount: parseFloat(amount),
        type,
        date,
        pos: pos.trim() || undefined,
        categoryId: selectedCategoryId != null ? Number(selectedCategoryId) : undefined,
      });
      onClose();
    } catch {
      // error handled upstream via toast
    } finally {
      setIsSubmitting(false);
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '40px 20px',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 16,
          width: 520,
          padding: 28,
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
          animation: 'scaleIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--blue-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--blue)',
                flexShrink: 0,
              }}
            >
              <Plus size={18} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Add Transaction</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Record a manual entry</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Type toggle */}
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
          Type
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
          {([
            { id: 'debit' as const, label: 'Debit', desc: 'Money out / Expense' },
            { id: 'credit' as const, label: 'Credit', desc: 'Money in / Income' },
          ]).map(opt => (
            <button
              key={opt.id}
              onClick={() => setType(opt.id)}
              style={{
                padding: '11px 14px',
                borderRadius: 10,
                border: `1.5px solid ${type === opt.id
                  ? (opt.id === 'debit' ? 'var(--red)' : 'var(--green)')
                  : 'var(--border)'}`,
                background: type === opt.id
                  ? (opt.id === 'debit' ? 'var(--red-bg)' : 'var(--green-bg)')
                  : 'white',
                color: type === opt.id
                  ? (opt.id === 'debit' ? 'var(--red)' : 'var(--green)')
                  : 'var(--text-mid)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700 }}>{opt.label}</div>
              <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>{opt.desc}</div>
            </button>
          ))}
        </div>

        {/* Merchant + Amount row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>
              Merchant / Description
            </label>
            <input
              autoFocus
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              placeholder="e.g. MOH Supermarket"
              style={{
                width: '100%',
                padding: '9px 11px',
                borderRadius: 8,
                border: `1.5px solid ${errors.merchant ? 'var(--red)' : 'var(--border)'}`,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.merchant && (
              <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{errors.merchant}</p>
            )}
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>
              Amount (KWD)
            </label>
            <input
              type="number"
              min="0"
              step="0.001"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.000"
              style={{
                width: '100%',
                padding: '9px 11px',
                borderRadius: 8,
                border: `1.5px solid ${errors.amount ? 'var(--red)' : 'var(--border)'}`,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.amount && (
              <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{errors.amount}</p>
            )}
          </div>
        </div>

        {/* Date + POS row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 11px',
                borderRadius: 8,
                border: `1.5px solid ${errors.date ? 'var(--red)' : 'var(--border)'}`,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                color: 'var(--text)',
              }}
            />
            {errors.date && (
              <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{errors.date}</p>
            )}
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>
              Reference / POS <span style={{ opacity: 0.5 }}>(optional)</span>
            </label>
            <input
              value={pos}
              onChange={e => setPos(e.target.value)}
              placeholder="e.g. Terminal #1234"
              style={{
                width: '100%',
                padding: '9px 11px',
                borderRadius: 8,
                border: '1.5px solid var(--border)',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Category selector */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          Category <span style={{ opacity: 0.5 }}>(optional — categorize later if needed)</span>
        </p>

        {/* "No category" chip */}
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setSelectedCategoryId(null)}
            style={{
              padding: '9px 14px',
              borderRadius: 9,
              border: `1.5px solid ${selectedCategoryId === null ? 'var(--bg-dark)' : 'var(--border)'}`,
              background: selectedCategoryId === null ? 'var(--bg-dark)' : 'white',
              color: selectedCategoryId === null ? 'white' : 'var(--text-muted)',
              fontSize: 12,
              fontWeight: selectedCategoryId === null ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Categorize later
          </button>
        </div>

        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategoryLabel}
          onSelect={id => setSelectedCategoryId(id)}
          onNewCategory={() => {/* custom categories not supported in manual entry */}}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              background: isSubmitting ? 'rgba(0,0,0,0.1)' : 'var(--bg-dark)',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              color: isSubmitting ? 'var(--text-muted)' : 'white',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Plus size={14} />
            {isSubmitting ? 'Adding…' : 'Add Transaction'}
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
