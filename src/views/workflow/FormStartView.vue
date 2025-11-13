<template>
  <div class="workflow-start">
    <van-skeleton title :row="6" :loading="waiting">
      <div v-if="process" class="workflow-start__body">
        <div class="workflow-start__section">
          <WfForm
            v-if="option"
            ref="formRef"
            v-model="form"
            :option="option"
            @submit="handleSubmit"
          >
            <template #menu>
              <van-button type="primary" block :loading="submitLoading" native-type="submit">提交</van-button>
              <van-button type="default" block :loading="submitLoading" @click="openDraft">存为草稿</van-button>
            </template>
          </WfForm>
        </div>
        <workflow-exam-form
          v-if="showExamForm"
          ref="examFormRef"
          :process="process"
          v-model:comment="comment"
          @user-select="handleUserSelect"
        />
        <workflow-user-selector
          v-model="userSelectorVisible"
          :type="userSelector.type"
          :check-type="userSelector.checkType"
          :default-checked="userSelector.defaultChecked"
          @confirm="resolveUserSelection"
          @cancel="handleUserSelectorCancel"
        />
        <van-dialog
          v-model:show="saveDraftVisible"
          show-cancel-button
          message="保存至草稿箱并关闭？"
          @confirm="submitDraft"
        />
        <van-dialog
          v-model:show="recoverDraftVisible"
          show-cancel-button
          message="是否恢复之前保存的草稿？"
          @confirm="recoverDraft"
          @cancel="cancelRecoverDraft"
        />
      </div>
    </van-skeleton>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from 'vue';

import WfForm from '@/components/wf-ui/components/wf-form/wf-form.vue';

import WorkflowExamForm from './components/WorkflowExamForm.vue';
import WorkflowUserSelector from './components/WorkflowUserSelector.vue';
import { useWorkflowDraft } from './composables/useWorkflowDraft';
import { useWorkflowForm } from './composables/useWorkflowForm';

export default {
  name: 'WorkflowFormStartView',
  components: {
    WfForm,
    WorkflowExamForm,
    WorkflowUserSelector,
  },
  setup() {
    const form = reactive({});
    const option = ref(null);
    const submitLoading = ref(false);
    const formRef = ref(null);
    const examFormRef = ref(null);

    const workflow = useWorkflowForm();
    const draft = useWorkflowDraft();

    const {
      process,
      waiting,
      comment,
      userSelectorVisible,
      userSelector,
      loadStartForm,
      submitStartForm,
      openUserSelector,
      resolveUserSelection,
      registerExamineForm,
      navigateTo,
    } = workflow;

    const {
      saveDraftVisible,
      recoverDraftVisible,
      openSaveDraft,
      submitDraftRequest,
      confirmRecoverDraft,
      cancelRecoverDraft,
      initDraft,
    } = draft;

    const showExamForm = ref(true);

    async function loadForm(processDefId) {
      const data = await loadStartForm(processDefId);
      if (!data) return;
      const optionConfig = parseOption(data.form || data.appForm);
      const startForm = Array.isArray(data.startForm) ? data.startForm : [];
      const columnFilter = workflow.filterAvueColumn(optionConfig.column || [], startForm);
      const groups = [];
      (optionConfig.group || []).forEach((group) => {
        const groupFilter = workflow.filterAvueColumn(group.column || [], startForm);
        if (groupFilter.column.length > 0) {
          groups.push({ ...group, column: groupFilter.column });
        }
      });
      option.value = {
        ...optionConfig,
        column: columnFilter.column,
        group: groups,
        labelPosition: 'top',
        submitBtn: false,
        menuBtn: false,
      };
      showExamForm.value = !(process.value?.hideComment && process.value?.hideCopy && process.value?.hideExamine);
      await initDraft({ processDefId });
    }

    function parseOption(payload) {
      if (!payload) return {};
      if (typeof payload === 'string') {
        try {
          return JSON.parse(payload);
        } catch (error) {
          try {
            // eslint-disable-next-line no-eval
            return eval('(' + payload + ')');
          } catch (err) {
            console.warn('[workflow] parse option failed', err);
            return {};
          }
        }
      }
      return payload;
    }

    async function handleSubmit(submitForm) {
      if (!process.value) return;
      submitLoading.value = true;
      try {
        const extras = examFormRef.value?.examineForm;
        await submitStartForm({ ...submitForm, processId: process.value.id, wf_platform: 'app' }, extras);
        navigateTo({ name: 'workflow-mine', query: { current: '1' } }, '发起成功');
      } catch (error) {
        console.warn(error);
      } finally {
        submitLoading.value = false;
      }
    }

    function handleUserSelect(payload) {
      openUserSelector(payload);
    }

    function handleUserSelectorCancel() {
      userSelectorVisible.value = false;
    }

    function openDraft() {
      openSaveDraft({
        processDefId: process.value?.id,
        formKey: process.value?.formKey,
        variables: form,
      });
    }

    async function submitDraft() {
      await submitDraftRequest();
      navigateTo({ name: 'workflow-create' });
    }

    function recoverDraft() {
      const data = confirmRecoverDraft();
      if (data) {
        Object.assign(form, data);
      }
    }

    onMounted(() => {
      if (examFormRef.value) {
        registerExamineForm(examFormRef.value);
      }
      const payload = workflow.extractRoutePayload();
      if (payload?.processId) {
        loadForm(payload.processId);
      }
    });

    watch(examFormRef, (val) => {
      if (val) {
        registerExamineForm(val);
      }
    });

    return {
      form,
      option,
      submitLoading,
      formRef,
      examFormRef,
      process,
      waiting,
      comment,
      userSelectorVisible,
      userSelector,
      showExamForm,
      saveDraftVisible,
      recoverDraftVisible,
      resolveUserSelection,
      cancelRecoverDraft,
      handleSubmit,
      handleUserSelect,
      handleUserSelectorCancel,
      openDraft,
      submitDraft,
      recoverDraft,
    };
  },
};
</script>

<style scoped>
.workflow-start {
  min-height: 100vh;
  background-color: #f5f6f8;
}

.workflow-start__body {
  padding: 16px 16px 120px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.workflow-start__section {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
</style>
