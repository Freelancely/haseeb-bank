import { useState, type KeyboardEvent } from 'react';
import type { Category } from '@/types';
import { Plus, Check } from 'lucide-react';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null; // tx.cat — always an account name from the backend
  suggestedCat?: string;
  confidence?: number;
  onSelect: (id: string) => void;  // passes account ID (numeric string in real, label in mock)
  onConfirmSuggestion?: () => void;
  onNewCategory: (label: string) => void;
}

// Canonical ordering for account type groups
const TYPE_ORDER = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

export function CategorySelector({
  categories,
  selectedCategory,
  suggestedCat,
  confidence,
  onSelect,
  onConfirmSuggestion,
  onNewCategory,
}: CategorySelectorProps) {
  const [newMode, setNewMode] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      onNewCategory(trimmed);
      onSelect(trimmed); // custom categories pass label as ID
      setNewName('');
      setNewMode(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setNewMode(false);
      setNewName('');
    }
  };

  // Group categories by typeName, preserving canonical order
  const grouped = categories.reduce<Record<string, Category[]>>((acc, cat) => {
    const group = cat.typeName ?? 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(cat);
    return acc;
  }, {});

  const groupNames = [
    ...TYPE_ORDER.filter(t => grouped[t]),
    ...Object.keys(grouped).filter(k => !TYPE_ORDER.includes(k)),
  ];

  return (
    <div>
      {/* Suggestion Banner */}
      {suggestedCat && !selectedCategory && onConfirmSuggestion && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 10,
            background: 'rgba(168,92,8,0.07)',
            border: '1.5px solid rgba(168,92,8,0.15)',
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 14 }}>✦</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              Engine suggests: <span style={{ color: 'var(--amber)' }}>{suggestedCat}</span>
            </div>
            {confidence !== undefined && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {confidence}% confidence
              </div>
            )}
          </div>
          <button
            onClick={onConfirmSuggestion}
            style={{
              padding: '6px 14px',
              borderRadius: 7,
              background: 'var(--bg-dark)',
              border: 'none',
              fontSize: 11,
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Confirm
          </button>
        </div>
      )}

      {/* Label */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 14,
        }}
      >
        {selectedCategory ? 'Change Category' : 'Select Category'}
      </p>

      {/* Grouped category lists */}
      {groupNames.map(groupName => (
        <div key={groupName} style={{ marginBottom: 16 }}>
          {/* Group header */}
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 6,
              paddingLeft: 2,
            }}
          >
            {groupName}
          </p>

          {/* 3-column grid for this group */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
            }}
          >
            {grouped[groupName].map(cat => {
              // Compare by label — tx.cat is always the account name string from backend
              const isSelected = selectedCategory === cat.label;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelect(cat.id)}
                  style={{
                    padding: '11px 10px',
                    borderRadius: 10,
                    background: isSelected ? 'var(--bg-dark)' : 'white',
                    color: isSelected ? 'white' : 'var(--text)',
                    border: `1.5px solid ${isSelected ? 'var(--bg-dark)' : 'var(--border)'}`,
                    fontSize: 12,
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                    lineHeight: 1.3,
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--text-mid)';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {isSelected && <Check size={12} />}
                  {cat.label}
                  {cat.isCustom && (
                    <span
                      style={{
                        fontSize: 9,
                        color: isSelected ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      custom
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Add New Category */}
      <div style={{ marginTop: 4 }}>
        {!newMode ? (
          <button
            onClick={() => setNewMode(true)}
            style={{
              padding: '11px 16px',
              borderRadius: 10,
              background: 'white',
              border: '2px dashed var(--border)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Plus size={13} />
            New
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 4 }}>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Category name…"
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 9,
                border: '1.5px solid var(--brand)',
                fontSize: 12,
                outline: 'none',
              }}
            />
            <button
              onClick={handleAdd}
              style={{
                padding: '0 14px',
                borderRadius: 9,
                background: 'var(--bg-dark)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Check size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
