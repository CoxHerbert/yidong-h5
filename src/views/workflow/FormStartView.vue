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

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';

import WfForm from '@/components/wf-ui/components/wf-form/wf-form.vue';

import WorkflowExamForm from './components/WorkflowExamForm.vue';
import WorkflowUserSelector from './components/WorkflowUserSelector.vue';
import { useWorkflowDraft } from './composables/useWorkflowDraft';
import { useWorkflowForm } from './composables/useWorkflowForm';

interface FormOption {
  column?: any[];
  group?: any[];
  submitBtn?: boolean;
  menuBtn?: boolean;
  labelPosition?: string;
}

const form = reactive<Record<string, any>>({});
const option = ref<FormOption | null>(null);
const submitLoading = ref(false);
const formRef = ref<InstanceType<typeof WfForm> | null>(null);
const examFormRef = ref<InstanceType<typeof WorkflowExamForm> | null>(null);

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

const { saveDraftVisible, recoverDraftVisible, openSaveDraft, submitDraftRequest, confirmRecoverDraft, cancelRecoverDraft, initDraft } =
  draft;

const showExamForm = ref(true);

onMounted(() => {
  if (examFormRef.value) {
    registerExamineForm(examFormRef.value as any);
  }
  const payload = workflow.extractRoutePayload<{ processId: string }>();
  if (payload?.processId) {
    loadForm(payload.processId);
  }
});

watch(examFormRef, (val) => {
  if (val) {
    registerExamineForm(val as any);
  }
});

async function loadForm(processDefId: string) {
  const data = await loadStartForm(processDefId);
  if (!data) return;
  const optionConfig = parseOption(data.form || data.appForm);
  const startForm = Array.isArray(data.startForm) ? data.startForm : [];
  const columnFilter = workflow.filterAvueColumn(optionConfig.column || [], startForm);
  const groups: any[] = [];
  (optionConfig.group || []).forEach((group: any) => {
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

function parseOption(payload: unknown) {
  if (!payload) return {} as FormOption;
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload);
    } catch (error) {
      try {
        // eslint-disable-next-line no-eval
        return eval('(' + payload + ')');
      } catch (err) {
        console.warn('[workflow] parse option failed', err);
        return {} as FormOption;
      }
    }
  }
  return payload as FormOption;
}

async function handleSubmit(submitForm: Record<string, any>) {
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

function handleUserSelect(payload: { type: string; checkType: 'radio' | 'checkbox' }) {
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
