import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';

import { useWorkflowStore } from '@/stores/workflow';
import type { ProcessFormResponse, TaskDetailResponse } from '@/api/workflow';

interface ExamineFormExpose {
  examineForm: {
    comment?: string;
    copyUser?: string | string[];
    $copyUser?: string | string[];
    assignee?: string | string[];
    $assignee?: string | string[];
    attachment?: unknown;
  };
}

interface UserSelectionPayload {
  id: string | string[];
  name?: string | string[];
}

const events = ['change', 'blur', 'click', 'focus'];

function encodePayload(payload: unknown): string {
  const json = JSON.stringify(payload ?? {});
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    const binary = new TextEncoder().encode(json);
    let str = '';
    binary.forEach((code) => {
      str += String.fromCharCode(code);
    });
    return window.btoa(str);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(json, 'utf-8').toString('base64');
  }
  return json;
}

function decodePayload<T = Record<string, any>>(value?: string | null): T | null {
  if (!value) return null;
  try {
    let json = '';
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      const binary = window.atob(value);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      json = new TextDecoder().decode(bytes);
    } else if (typeof Buffer !== 'undefined') {
      json = Buffer.from(value, 'base64').toString('utf-8');
    } else {
      json = value;
    }
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('[workflow] decode payload failed', error);
    return null;
  }
}

function dateFormat(date: Date, format = 'yyyy-MM-dd hh:mm:ss') {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const map: Record<string, number> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  let fmt = format;
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substring(4 - RegExp.$1.length));
  }
  Object.keys(map).forEach((pattern) => {
    if (new RegExp(`(${pattern})`).test(fmt)) {
      const value = map[pattern];
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? `${value}` : `00${value}`.slice(`${value}`.length));
    }
  });
  return fmt;
}

function resolveDefaultValue(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  if (!value.includes('${') || !value.includes('}')) {
    return value;
  }
  try {
    let template = value;
    if (template.includes('this.dateFormat')) {
      template = template.replaceAll('Y', 'y').replaceAll('H', 'h').replace('DD', 'dd');
    }
    // eslint-disable-next-line no-eval
    return eval('`' + template + '`');
  } catch (error) {
    console.warn('[workflow] failed to evaluate default value', value, error);
    return value;
  }
}

export function useWorkflowForm() {
  const router = useRouter();
  const route = useRoute();
  const store = useWorkflowStore();

  const waiting = ref(true);
  const comment = ref('');
  const submitting = ref(false);
  const examineFormRef = ref<ExamineFormExpose>();

  const userSelectorVisible = ref(false);
  const userSelector = reactive({
    type: '',
    checkType: 'radio' as 'radio' | 'checkbox',
    defaultChecked: null as string | string[] | null,
  });

  const process = computed(() => store.process);
  const buttonList = computed(() => store.buttonList);
  const flow = computed(() => store.flow);
  const bpmnOption = computed(() => store.bpmnOption);

  function dynamicRoute(row: Record<string, any>, type: 'detail' | 'start', options: { async?: boolean } = {}) {
    const { id, taskId, processInstanceId, processId, formKey, appFormUrl } = row;
    const param = encodePayload({
      processId: id,
      taskId,
      processInsId: processInstanceId || processId,
    });

    if (options.async) {
      return Promise.resolve({ row, type, param });
    }

    if (formKey && typeof formKey === 'string' && formKey.startsWith('wf_ex_')) {
      if (appFormUrl) {
        router.push({ path: appFormUrl, query: { p: param, type } });
      } else {
        router.push({
          name: type === 'start' ? 'workflow-external-start' : 'workflow-external-detail',
          params: { formKey: formKey.substring(6) },
          query: { p: param },
        });
      }
    } else {
      router.push({
        name: type === 'start' ? 'workflow-form-start' : 'workflow-form-detail',
        query: { p: param },
      });
    }
    return Promise.resolve();
  }

  function filterAvueColumn(
    column: any[] = [],
    taskForm: any[] = [],
    props: { label: string; prop: string } = { label: 'label', prop: 'prop' }
  ) {
    if (!Array.isArray(column) || column.length === 0) {
      return { column, vars: [] as string[] };
    }

    const values: any[] = [];
    const vars: string[] = [];
    const context = {
      dateFormat,
      getDefaultValues: resolveDefaultValue,
    };

    column.forEach((col) => {
      const permission = taskForm?.find?.((item: any) => item.id === col?.[props.prop]);
      if (!permission || !permission.readable) return;

      events.forEach((event) => {
        if (col?.[event]) {
          try {
            // eslint-disable-next-line no-eval
            col[event] = eval((`${col[event]}`).replace(/this/g, 'context'));
          } catch (error) {
            console.warn('[workflow] failed to bind event', event, error);
          }
        }
      });

      if (col?.event && typeof col.event === 'object') {
        Object.keys(col.event).forEach((key) => {
          try {
            // eslint-disable-next-line no-eval
            col.event[key] = eval((`${col.event[key]}`).replace(/this/g, 'context'));
          } catch (error) {
            console.warn('[workflow] failed to bind event handler', key, error);
          }
        });
      }

      if (permission.writable) {
        vars.push(col?.[props.prop]);
        if (col?.value !== undefined) {
          col.value = context.getDefaultValues(col.value);
        }
      } else {
        if (col.type === 'dynamic' && col.children) {
          col.children.addBtn = false;
          col.children.delBtn = false;
        } else {
          col.readonly = true;
          col.disabled = true;
        }
        delete col.rules;
        delete col.value;
      }

      if (col.type === 'dynamic' && col.children?.column) {
        const childrenResult = filterAvueColumn(col.children.column, taskForm, props);
        col.children.column = childrenResult.column;
      }

      if (Array.isArray(col.rules) && col.pattern) {
        col.rules.forEach((rule: any) => {
          if (rule.pattern) {
            rule.pattern = new RegExp(col.pattern);
          }
        });
      }

      values.push(col);
    });

    return { column: values, vars };
  }

  async function loadStartForm(processDefId: string) {
    waiting.value = true;
    try {
      const data = await store.fetchStartForm(processDefId);
      if (data?.process?.name) {
        document.title = `发起流程 - ${data.process.name}`;
      }
      return data;
    } finally {
      waiting.value = false;
    }
  }

  async function submitStartForm(form: Record<string, any>, extras?: { copyUser?: any; assignee?: any }) {
    const payload = { ...form };
    if (extras) {
      Object.assign(payload, extras);
    }
    await store.submitStartForm(payload);
  }

  async function loadTaskDetail(taskId: string, processInsId?: string) {
    waiting.value = true;
    try {
      const data = await store.fetchTaskDetail(taskId, processInsId);
      return data;
    } finally {
      waiting.value = false;
    }
  }

  async function completeTaskAction(options: {
    pass: boolean;
    variables?: Record<string, any>;
    text?: string;
    processOverride?: Record<string, any>;
    examineForm?: ExamineFormExpose['examineForm'];
  }) {
    const { pass, variables = {}, text, processOverride, examineForm } = options;
    const processData = processOverride ?? process.value;
    if (!processData) {
      throw new Error('process data is required');
    }
    let resolvedComment = text ?? comment.value ?? '';
    let copyUser = examineForm?.copyUser;
    let assignee = examineForm?.assignee;
    const attachment = examineForm?.attachment;

    if (!resolvedComment && examineForm?.comment) {
      resolvedComment = examineForm.comment;
    }

    if (!pass && !resolvedComment) {
      showToast('请填写批复意见');
      throw new Error('missing comment');
    }

    const payload = {
      taskId: processData.taskId,
      processInstanceId: processData.processInstanceId,
      processDefinitionName: processData.processDefinitionName,
      processDefinitionId: processData.processDefinitionId,
      pass,
      comment: resolvedComment,
      copyUser,
      assignee,
      variables,
      attachment,
    };

    submitting.value = true;
    try {
      await store.submitCompleteTask(payload);
    } finally {
      submitting.value = false;
    }
  }

  async function rollbackTaskAction(nodeId: string) {
    if (!process.value) return;
    submitting.value = true;
    try {
      await store.submitRollbackTask({ comment: comment.value, nodeId, taskId: process.value.taskId });
      navigateTo({ name: 'workflow-mine', query: { current: '0' } }, '回退成功');
    } finally {
      submitting.value = false;
    }
  }

  async function terminateProcessAction() {
    if (!process.value) return;
    submitting.value = true;
    try {
      await store.submitTerminateProcess({ taskId: process.value.taskId, comment: comment.value });
      navigateTo({ name: 'workflow-mine', query: { current: '0' } }, '操作成功');
    } finally {
      submitting.value = false;
    }
  }

  async function withdrawTaskAction(withdrawType: string) {
    if (!process.value) return;
    submitting.value = true;
    try {
      await store.submitWithdrawTask({ taskId: process.value.taskId, withdrawType });
      navigateTo({ name: 'workflow-mine', query: { current: '0' } }, '操作成功');
    } finally {
      submitting.value = false;
    }
  }

  async function addMultiInstanceAction() {
    if (!process.value) return;
    submitting.value = true;
    try {
      const examineForm = examineFormRef.value?.examineForm;
      await store.submitAddMultiInstance({
        taskId: process.value.taskId,
        processInstanceId: process.value.processInstanceId,
        processDefinitionName: process.value.processDefinitionName,
        processDefinitionId: process.value.processDefinitionId,
        comment: examineForm?.comment ?? comment.value,
      });
      showToast('加签成功');
    } finally {
      submitting.value = false;
    }
  }

  function openUserSelector(options: { type: string; checkType?: 'radio' | 'checkbox' }) {
    const { type, checkType = 'radio' } = options;
    const examineForm = examineFormRef.value?.examineForm;
    if (!comment.value && ['transfer', 'delegate'].includes(type)) {
      showToast('请填写批复意见');
      return;
    }
    if (type === 'assignee') {
      userSelector.defaultChecked = (examineForm?.assignee as any) ?? null;
    } else if (type === 'copy') {
      userSelector.defaultChecked = (examineForm?.copyUser as any) ?? null;
    } else {
      userSelector.defaultChecked = null;
    }
    userSelector.type = type;
    userSelector.checkType = checkType;
    userSelectorVisible.value = true;
  }

  async function resolveUserSelection({ id, name }: UserSelectionPayload) {
    const type = userSelector.type;
    const examineForm = examineFormRef.value?.examineForm;
    const processData = process.value;
    if (!type || !processData) {
      userSelectorVisible.value = false;
      return;
    }
    if (['transfer', 'delegate', 'addInstance'].includes(type)) {
      submitting.value = true;
    }
    try {
      if (type === 'transfer') {
        await store.submitTransferTask({
          taskId: processData.taskId,
          processInstanceId: processData.processInstanceId,
          processDefinitionName: processData.processDefinitionName,
          processDefinitionId: processData.processDefinitionId,
          assignee: id,
          comment: examineForm?.comment ?? comment.value,
          copyUser: examineForm?.copyUser,
        });
        navigateTo({ name: 'workflow-mine', query: { current: '0' } }, '转办成功');
      } else if (type === 'delegate') {
        await store.submitDelegateTask({
          taskId: processData.taskId,
          processInstanceId: processData.processInstanceId,
          processDefinitionName: processData.processDefinitionName,
          processDefinitionId: processData.processDefinitionId,
          assignee: id,
          comment: examineForm?.comment ?? comment.value,
          copyUser: examineForm?.copyUser,
        });
        navigateTo({ name: 'workflow-mine', query: { current: '0' } }, '委托成功');
      } else if (type === 'addInstance') {
        await store.submitAddMultiInstance({
          taskId: processData.taskId,
          processInstanceId: processData.processInstanceId,
          processDefinitionName: processData.processDefinitionName,
          processDefinitionId: processData.processDefinitionId,
          assignee: id,
          comment: examineForm?.comment ?? comment.value,
          copyUser: examineForm?.copyUser,
        });
        showToast('加签成功');
      } else if (type === 'copy' && examineForm) {
        examineForm.copyUser = id;
        examineForm.$copyUser = name;
      } else if (type === 'assignee' && examineForm) {
        examineForm.assignee = id;
        examineForm.$assignee = name;
      }
    } finally {
      submitting.value = false;
      userSelectorVisible.value = false;
    }
  }

  function navigateTo(location: Parameters<typeof router.replace>[0], message?: string) {
    if (message) {
      showToast(message);
      setTimeout(() => {
        router.replace(location);
      }, 800);
    } else {
      router.replace(location);
    }
  }

  function registerExamineForm(expose: ExamineFormExpose) {
    examineFormRef.value = expose;
  }

  function extractRoutePayload<T = Record<string, any>>(): T | null {
    const payload = route.query.p || route.params.p;
    if (typeof payload === 'string') {
      return decodePayload<T>(payload);
    }
    return null;
  }

  return {
    process,
    buttonList,
    flow,
    bpmnOption,
    waiting,
    submitting,
    comment,
    userSelectorVisible,
    userSelector,
    dynamicRoute,
    filterAvueColumn,
    loadStartForm,
    submitStartForm,
    loadTaskDetail,
    completeTaskAction,
    rollbackTaskAction,
    terminateProcessAction,
    withdrawTaskAction,
    addMultiInstanceAction,
    openUserSelector,
    resolveUserSelection,
    navigateTo,
    registerExamineForm,
    extractRoutePayload,
    encodePayload,
  };
}

export type UseWorkflowFormReturn = ReturnType<typeof useWorkflowForm>;

export type { ProcessFormResponse, TaskDetailResponse };
