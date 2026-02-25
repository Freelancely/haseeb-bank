import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function SplashPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-dark)',
        fontFamily: 'var(--font-sans)',
        textAlign: 'center',
        padding: 40,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Logo mark */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          background: '#C41C38',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 0 60px rgba(196,28,56,0.3)',
          position: 'relative',
          animation: 'fadeIn 0.4s ease',
        }}
      >
        <Shield size={32} color="white" />
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          fontWeight: 800,
          color: 'white',
          letterSpacing: '-0.04em',
          marginBottom: 10,
          animation: 'slideUp 0.4s ease 0.1s both',
        }}
      >
        Financial Intelligence
      </h1>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '-0.02em',
          marginBottom: 12,
          animation: 'slideUp 0.4s ease 0.15s both',
        }}
      >
        Powered by Haseeb
      </h2>

      <p
        style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.35)',
          marginBottom: 8,
          animation: 'slideUp 0.4s ease 0.2s both',
        }}
      >
        Embedded securely within
      </p>
      <p
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.7)',
          marginBottom: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          justifyContent: 'center',
          animation: 'slideUp 0.4s ease 0.25s both',
        }}
      >
        🏦 Kuwait International Bank
      </p>

      <button
        onClick={() => navigate('/')}
        style={{
          padding: '14px 44px',
          borderRadius: 12,
          background: '#C41C38',
          border: 'none',
          fontFamily: 'var(--font-sans)',
          fontSize: 15,
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          boxShadow: '0 4px 24px rgba(196,28,56,0.35)',
          transition: 'all 0.15s',
          animation: 'slideUp 0.4s ease 0.3s both',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#E53E56';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#C41C38';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Enter Transaction Review
      </button>

      {/* Feature pills */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginTop: 40,
          flexWrap: 'wrap',
          justifyContent: 'center',
          animation: 'slideUp 0.4s ease 0.35s both',
        }}
      >
        {[
          'Deterministic Engine',
          'Supervised Learning',
          'Auto-Categorization',
          'Rule Registry',
          'Audit Trail',
        ].map(f => (
          <span
            key={f}
            style={{
              padding: '5px 12px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.03em',
            }}
          >
            {f}
          </span>
        ))}
      </div>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          color: 'rgba(255,255,255,0.15)',
          marginTop: 60,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          animation: 'fadeIn 0.6s ease 0.5s both',
        }}
      >
        Haseeb Bank Prototype V1 · Pilot Release
      </p>
    </div>
  );
}
