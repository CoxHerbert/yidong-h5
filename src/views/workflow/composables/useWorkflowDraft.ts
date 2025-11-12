import { ref } from 'vue';
import { showToast } from 'vant';

import { getDetail as getDraftDetail, submit as submitDraft } from '@/api/workflow/draft';

interface DraftParams {
  processDefId?: string;
  taskId?: string;
}

export function useWorkflowDraft() {
  const saveDraftVisible = ref(false);
  const recoverDraftVisible = ref(false);
  const draftPayload = ref<Record<string, any> | null>(null);
  const recoverPayload = ref<Record<string, any> | null>(null);

  async function initDraft(params: DraftParams) {
    const response = await getDraftDetail({ ...params, platform: 'app' });
    const data = (response as any).data ?? response;
    if (data?.variables && Object.keys(data.variables).length > 0) {
      recoverPayload.value = data.variables;
      recoverDraftVisible.value = true;
      return data.variables as Record<string, any>;
    }
    return null;
  }

  function openSaveDraft(params: { processDefId?: string; taskId?: string; formKey?: string; variables: Record<string, any> }) {
    draftPayload.value = {
      ...params,
      variables: JSON.stringify(params.variables ?? {}),
      platform: 'app',
    };
    saveDraftVisible.value = true;
  }

  async function submitDraftRequest() {
    if (!draftPayload.value) return;
    await submitDraft(draftPayload.value);
    showToast('草稿已保存');
    saveDraftVisible.value = false;
  }

  function confirmRecoverDraft() {
    recoverDraftVisible.value = false;
    if (!recoverPayload.value) return null;
    return JSON.parse(JSON.stringify(recoverPayload.value));
  }

  function cancelRecoverDraft() {
    recoverDraftVisible.value = false;
  }

  return {
    saveDraftVisible,
    recoverDraftVisible,
    initDraft,
    openSaveDraft,
    submitDraftRequest,
    confirmRecoverDraft,
    cancelRecoverDraft,
    draftPayload,
    recoverPayload,
  };
}

export type UseWorkflowDraftReturn = ReturnType<typeof useWorkflowDraft>;
