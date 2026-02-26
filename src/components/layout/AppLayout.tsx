import { type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, BookOpen, Shield, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store';

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: Readonly<AppLayoutProps>) {
  const location = useLocation();
  const { getSummary, rules } = useAppStore();
  const summary = getSummary();

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard size={16} />,
    },
    {
      path: '/transactions',
      label: 'Transactions',
      icon: <CreditCard size={16} />,
      badge: summary.uncategorized > 0 ? summary.uncategorized : undefined,
    },
    {
      path: '/rules',
      label: 'Rules',
      icon: <BookOpen size={16} />,
      badge: rules.length > 0 ? rules.length : undefined,
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: 'var(--bg-dark)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#C41C38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={16} color="white" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.02em',
                }}
              >
                Haseeb
              </div>
            </div>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginLeft: 42,
            }}
          >
            Bank Intelligence
          </p>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 10px', flex: 1 }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '8px 10px 4px',
            }}
          >
            Navigation
          </p>
          {navItems.map(item => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{ display: 'block', textDecoration: 'none', marginBottom: 2 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 10px',
                    borderRadius: 8,
                    background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                    if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      style={{
                        background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(196,28,56,0.7)',
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 10,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={12} style={{ opacity: 0.4 }} />}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              KIB
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                Kuwait Int'l Bank
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.25)',
                }}
              >
                Pilot v1
              </div>
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.05em',
            }}
          >
            LIVE
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
}
