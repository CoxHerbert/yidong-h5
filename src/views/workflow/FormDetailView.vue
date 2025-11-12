<template>
  <div class="workflow-detail">
    <van-skeleton title :row="6" :loading="waiting">
      <div v-if="process" class="workflow-detail__body">
        <section class="workflow-detail__header">
          <van-cell-group inset>
            <van-cell>
              <template #title>
                <div class="workflow-detail__title">{{ process.processDefinitionName }}</div>
                <div class="workflow-detail__subtitle">{{ process.startUsername }}</div>
              </template>
              <template #value>
                <van-tag v-if="process.status === 'todo'" type="success">审核中</van-tag>
                <van-tag v-else-if="process.status === 'delay'" type="danger">已超时</van-tag>
                <van-tag v-else-if="process.status === 'done'" type="success">已结束</van-tag>
              </template>
            </van-cell>
          </van-cell-group>
        </section>

        <van-tabs v-model:active="activeTab" shrink>
          <van-tab title="申请信息" name="info">
            <div class="workflow-detail__section">
              <WfForm v-if="summaryOption" v-model="form" :option="summaryOption" />
              <WfForm v-if="option" v-model="form" :option="option" />
              <workflow-exam-form
                v-if="process.status === 'todo'"
                ref="examFormRef"
                :process="process"
                v-model:comment="comment"
                @user-select="handleUserSelect"
              />
            </div>
          </van-tab>
          <van-tab title="流转信息" name="flow">
            <div class="workflow-detail__section">
              <workflow-flow-timeline :flow="flow" />
            </div>
          </van-tab>
          <van-tab title="流转图" name="bpmn">
            <workflow-bpmn-preview :bpmn-option="bpmnPreview" />
          </van-tab>
        </van-tabs>

        <workflow-actions
          :loading="submitLoading || submitting"
          :button-list="buttonList"
          :process="process"
          :comment="comment"
          @examine="handleExamine"
          @user-select="handleUserSelect"
          @draft="handleDraft"
          @rollback="handleRollback"
          @terminate="terminateProcessAction"
          @withdraw="withdrawTaskAction"
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

import WorkflowActions from './components/WorkflowActions.vue';
import WorkflowBpmnPreview from './components/WorkflowBpmnPreview.vue';
import WorkflowExamForm from './components/WorkflowExamForm.vue';
import WorkflowFlowTimeline from './components/WorkflowFlowTimeline.vue';
import WorkflowUserSelector from './components/WorkflowUserSelector.vue';
import { useWorkflowDraft } from './composables/useWorkflowDraft';
import { useWorkflowForm } from './composables/useWorkflowForm';

interface FormOption {
  column?: any[];
  group?: any[];
  menuBtn?: boolean;
  detail?: boolean;
}

const activeTab = ref('info');
const form = reactive<Record<string, any>>({});
const option = ref<FormOption | null>(null);
const summaryOption = ref<FormOption | null>(null);
const vars = ref<string[]>([]);
const submitLoading = ref(false);
const examFormRef = ref<InstanceType<typeof WorkflowExamForm> | null>(null);
const bpmnPreview = ref<{ processInsId?: string; taskId?: string; token?: string } | null>(null);

const workflow = useWorkflowForm();
const draft = useWorkflowDraft();

const {
  process,
  buttonList,
  flow,
  waiting,
  comment,
  submitting,
  userSelectorVisible,
  userSelector,
  loadTaskDetail,
  resolveUserSelection,
  openUserSelector,
  rollbackTaskAction,
  terminateProcessAction,
  withdrawTaskAction,
  navigateTo,
  completeTaskAction,
} = workflow;

const {
  saveDraftVisible,
  recoverDraftVisible,
  openSaveDraft,
  submitDraftRequest,
  confirmRecoverDraft,
  cancelRecoverDraft,
} = draft;

function resetOptionState() {
  option.value = null;
  summaryOption.value = null;
  vars.value = [];
}

onMounted(() => {
  if (examFormRef.value) {
    workflow.registerExamineForm(examFormRef.value as any);
  }
  const payload = workflow.extractRoutePayload<{ taskId: string; processInsId?: string }>();
  if (payload?.taskId && payload?.processInsId) {
    loadDetail(payload.taskId, payload.processInsId);
  }
});

watch(examFormRef, (val) => {
  if (val) {
    workflow.registerExamineForm(val as any);
  }
});

async function loadDetail(taskId: string, processInsId?: string) {
  resetOptionState();
  const data = await loadTaskDetail(taskId, processInsId);
  const processData = data.process || {};
  const variables = { ...(processData.variables || {}) };
  Object.assign(form, variables);
  if (processData.status === 'todo') {
    await draft.initDraft({ taskId });
  }
  if (processData.taskId) {
    bpmnPreview.value = {
      taskId: processData.taskId,
      processInsId: processData.processInstanceId,
      token: localStorage.getItem('accessToken') || '',
    };
  }
  resolveFormOptions(data.form, processData.status);
}

function parseOption(option: unknown) {
  if (!option) return {};
  if (typeof option === 'string') {
    try {
      return JSON.parse(option);
    } catch (error) {
      try {
        // eslint-disable-next-line no-eval
        return eval('(' + option + ')');
      } catch (err) {
        console.warn('[workflow] parse option failed', err);
        return {};
      }
    }
  }
  return option as Record<string, any>;
}

function resolveFormOptions(formData: any, status: string) {
  if (!formData) return;
  const { allForm, allAppForm, taskForm, formList } = formData;
  if (Array.isArray(formList) && formList.length > 0) {
    const summary = { menuBtn: false, detail: true, labelPosition: 'top', group: [] as any[] };
    formList.forEach((item: any) => {
      const optionConfig = parseOption(item.content || item.appContent);
      const { option: resolved } = handleResolveOption(optionConfig, taskForm, 'done');
      summary.group.push({
        label: item.taskName || item.taskKey,
        column: resolved.column,
        collapse: Boolean(allForm),
      });
    });
    summaryOption.value = summary;
  }

  const formOption = parseOption(allForm || allAppForm);
  if (formOption) {
    const { option: resolved, vars: collectedVars } = handleResolveOption(formOption, taskForm, status);
    resolved.menuBtn = false;
    resolved.labelPosition = 'top';
    if (!resolved.column) resolved.column = [];
    if (process.value?.variables?.serialNumber) {
      resolved.column.unshift({ label: '流水号', prop: 'serialNumber', span: 24, detail: true });
    }
    option.value = resolved;
    vars.value = collectedVars;
  }
}

function handleResolveOption(optionConfig: Record<string, any>, taskForm: any[], status: string) {
  const result = { ...(optionConfig || {}) };
  let collectedVars: string[] = [];
  const stripDefault = (column: any) => {
    if (!column) return;
    delete column.value;
    if (column.type === 'dynamic' && column.children?.column) {
      column.children.column.forEach(stripDefault);
    }
  };

  if (status !== 'todo') {
    result.detail = true;
    (result.column || []).forEach(stripDefault);
    (result.group || []).forEach((group: any) => group.column?.forEach(stripDefault));
  } else {
    const columnFilter = workflow.filterAvueColumn(result.column || [], taskForm);
    result.column = columnFilter.column;
    collectedVars = columnFilter.vars || [];
    const groups: any[] = [];
    (result.group || []).forEach((group: any) => {
      const groupFilter = workflow.filterAvueColumn(group.column || [], taskForm);
      if (groupFilter.column.length > 0) {
        groups.push({ ...group, column: groupFilter.column });
      }
      collectedVars = collectedVars.concat(groupFilter.vars || []);
    });
    result.group = groups;
  }
  return { option: result, vars: collectedVars };
}

async function handleExamine(pass: boolean) {
  submitLoading.value = true;
  try {
    const variables: Record<string, any> = {};
    vars.value.forEach((key) => {
      if (form[key] !== undefined && form[key] !== null && form[key] !== '') {
        variables[key] = form[key];
        if (form[`$${key}`]) {
          variables[`$${key}`] = form[`$${key}`];
        }
      }
    });
    await completeTaskAction({
      pass,
      variables,
      examineForm: examFormRef.value?.examineForm,
    });
    navigateTo({ name: 'workflow-mine', query: { current: '0' } }, '处理成功');
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

async function handleRollback(nodeId: string) {
  await rollbackTaskAction(nodeId);
}

function handleDraft() {
  openSaveDraft({
    taskId: process.value?.taskId,
    variables: form,
  });
}

async function submitDraft() {
  await submitDraftRequest();
  navigateTo({ name: 'workflow-workbench' });
}

function recoverDraft() {
  const data = confirmRecoverDraft();
  if (data) {
    Object.assign(form, data);
  }
}
</script>

<style scoped>
.workflow-detail {
  min-height: 100vh;
  background-color: #f5f6f8;
}

.workflow-detail__body {
  padding-bottom: 120px;
}

.workflow-detail__header {
  margin: 12px 0;
}

.workflow-detail__title {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}

.workflow-detail__subtitle {
  font-size: 14px;
  color: #646566;
  margin-top: 4px;
}

.workflow-detail__section {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
