import { useCallback, useEffect } from 'react';
import { useAppStore } from '@/store';
import { rulesService } from '@/services';
import type { CreateRulePayload } from '@/types';

export function useRules() {
  const {
    rules,
    isLoadingRules,
    setRules,
    addRule,
    removeRule,
    setLoadingRules,
    addToast,
    rulePrompt,
    setRulePrompt,
  } = useAppStore();

  const load = useCallback(async () => {
    setLoadingRules(true);
    try {
      const data = await rulesService.listRules();
      setRules(data);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load rules', 'error');
    } finally {
      setLoadingRules(false);
    }
  }, [setRules, setLoadingRules, addToast]);

  const createRule = useCallback(
    async (payload: CreateRulePayload) => {
      try {
        const rule = await rulesService.createRule(payload);
        addRule(rule);
        addToast(`Rule created for ${payload.merchant}`, 'success');
        setRulePrompt(null);
        return rule;
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Failed to create rule', 'error');
        return null;
      }
    },
    [addRule, addToast, setRulePrompt],
  );

  const deleteRule = useCallback(
    async (id: string) => {
      try {
        await rulesService.deleteRule(id);
        removeRule(id);
        addToast('Rule deleted', 'info');
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Failed to delete rule', 'error');
      }
    },
    [removeRule, addToast],
  );

  return {
    rules,
    isLoading: isLoadingRules,
    rulePrompt,
    load,
    createRule,
    deleteRule,
    setRulePrompt,
  };
}

export function useAutoLoadRules() {
  const { load } = useRules();
  useEffect(() => {
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
