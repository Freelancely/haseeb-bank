import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { Toasts } from '@/components/common';
import {
  SplashPage,
  DashboardPage,
  TransactionsPage,
  TransactionDetailPage,
  RulesPage,
} from '@/pages';
import { useAutoLoadTransactions, useAutoLoadRules, useAutoLoadAccounts } from '@/hooks';

function AppInner() {
  useAutoLoadTransactions();
  useAutoLoadRules();
  useAutoLoadAccounts();

  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/:id" element={<TransactionDetailPage />} />
          <Route path="/rules" element={<RulesPage />} />
        </Routes>
      </AppLayout>
      <Toasts />
    </>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/splash" element={<SplashPage />} />
      <Route path="/*" element={<AppInner />} />
    </Routes>
  );
}
