import { useCallback, useEffect } from 'react';
import { useAppStore } from '@/store';
import { accountsService } from '@/services';

export function useAccounts() {
  const { categories, setCategories, addToast } = useAppStore();

  const load = useCallback(async () => {
    try {
      const data = await accountsService.listAccounts();
      setCategories(data);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load accounts', 'error');
    }
  }, [setCategories, addToast]);

  return { categories, load };
}

export function useAutoLoadAccounts() {
  const { load } = useAccounts();
  useEffect(() => {
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
