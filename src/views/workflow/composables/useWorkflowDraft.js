import { ref } from 'vue';
import { showToast } from 'vant';

import { getDetail as getDraftDetail, submit as submitDraft } from '@/api/workflow/draft';

export function useWorkflowDraft() {
  const saveDraftVisible = ref(false);
  const recoverDraftVisible = ref(false);
  const draftPayload = ref(null);
  const recoverPayload = ref(null);

  async function initDraft(params = {}) {
    const response = await getDraftDetail({ ...params, platform: 'app' });
    const data = response?.data ?? response;
    if (data?.variables && Object.keys(data.variables).length > 0) {
      recoverPayload.value = data.variables;
      recoverDraftVisible.value = true;
      return data.variables;
    }
    return null;
  }

  function openSaveDraft(params = {}) {
    const { variables = {}, ...rest } = params;
    draftPayload.value = {
      ...rest,
      variables: JSON.stringify(variables),
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
