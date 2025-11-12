import type { ProcessFormResponse, TaskDetailResponse } from './task';

type Params = Record<string, any>;

type CommentType =
  | 'comment'
  | 'transferComment'
  | 'delegateComment'
  | 'rollbackComment'
  | 'terminateComment'
  | 'addMultiInstanceComment'
  | 'withdrawComment';

interface FlowComment {
  type: CommentType;
  fullMessage: string;
  action: 'AddComment';
  time: string;
}

interface FlowRecord {
  historyActivityType: string;
  historyActivityName: string;
  assigneeName: string;
  createTime: string;
  endTime?: string;
  historyActivityDurationTime?: string;
  comments: FlowComment[];
  attachments?: Array<{ name: string; url: string }>;
}

interface SummaryFormItem {
  taskName: string;
  taskKey: string;
  content: string;
  appContent?: string;
}

interface ProcessInstance {
  id: string;
  processDefinitionId: string;
  processDefinitionName: string;
  formKey: string;
  startUsername: string;
  startTime: string;
  status: 'todo' | 'done' | 'delay';
  processIsFinished?: string;
  processInstanceId: string;
  taskId: string;
  taskName: string;
  copyUser?: string | string[];
  copyUserName?: string | string[];
  variables: Record<string, any>;
  flow: FlowRecord[];
  summary: SummaryFormItem[];
  buttonList: Array<{ buttonKey: string; name: string }>;
  isOwner: boolean;
  isReturnable: boolean;
  isMultiInstance: boolean;
  xml?: string;
}

interface StartFormPermission {
  id: string;
  readable: boolean;
  writable: boolean;
}

const definitionId = 'mock-expense-process';
const processName = '费用报销流程（模拟）';
const formKey = 'mock_expense_form';

const buttonCatalog: Array<{ buttonKey: string; name: string }> = [
  { buttonKey: 'wf_pass', name: '通过' },
  { buttonKey: 'wf_reject', name: '驳回' },
  { buttonKey: 'wf_transfer', name: '转办' },
  { buttonKey: 'wf_delegate', name: '委托' },
  { buttonKey: 'wf_rollback', name: '回退' },
  { buttonKey: 'wf_terminate', name: '终止' },
  { buttonKey: 'wf_add_instance', name: '加签' },
];

let processSequence = 1;
let taskSequence = 1;

const instances = new Map<string, ProcessInstance>();

const baseFormOption = {
  menuBtn: false,
  submitBtn: false,
  column: [
    {
      prop: 'title',
      label: '报销主题',
      type: 'input',
      rules: [{ required: true, message: '请输入报销主题' }],
    },
    {
      prop: 'applicant',
      label: '申请人',
      type: 'input',
      disabled: true,
    },
    {
      prop: 'department',
      label: '所属部门',
      type: 'select',
      dicData: [
        { label: '研发中心', value: 'rd' },
        { label: '市场部', value: 'marketing' },
        { label: '财务部', value: 'finance' },
      ],
      rules: [{ required: true, message: '请选择所属部门' }],
    },
    {
      prop: 'amount',
      label: '报销金额',
      type: 'number',
      rules: [{ required: true, message: '请输入报销金额' }],
    },
    {
      prop: 'urgent',
      label: '是否紧急',
      type: 'switch',
    },
    {
      prop: 'items',
      label: '费用明细',
      type: 'dynamic',
      children: {
        column: [
          {
            prop: 'item',
            label: '事项',
            type: 'input',
            rules: [{ required: true, message: '请输入事项' }],
          },
          {
            prop: 'cost',
            label: '金额',
            type: 'number',
            rules: [{ required: true, message: '请输入金额' }],
          },
          {
            prop: 'remark',
            label: '备注',
            type: 'textarea',
          },
        ],
        addBtnText: '新增明细',
        delBtnText: '移除明细',
      },
    },
  ],
  group: [
    {
      label: '补充信息',
      column: [
        {
          prop: 'attachments',
          label: '附件',
          type: 'upload',
          listType: 'picture-card',
        },
        {
          prop: 'description',
          label: '申请说明',
          type: 'textarea',
        },
      ],
    },
  ],
};

const startFormPermissions: StartFormPermission[] = [
  { id: 'title', readable: true, writable: true },
  { id: 'applicant', readable: true, writable: false },
  { id: 'department', readable: true, writable: true },
  { id: 'amount', readable: true, writable: true },
  { id: 'urgent', readable: true, writable: true },
  { id: 'items', readable: true, writable: true },
  { id: 'item', readable: true, writable: true },
  { id: 'cost', readable: true, writable: true },
  { id: 'remark', readable: true, writable: true },
  { id: 'attachments', readable: true, writable: true },
  { id: 'description', readable: true, writable: true },
];

function cloneOption() {
  return JSON.parse(JSON.stringify(baseFormOption));
}

function formatDate(date = new Date()) {
  const pad = (num: number) => `${num}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
}

function resolveTaskForm(instance: ProcessInstance) {
  if (instance.status !== 'todo') {
    return startFormPermissions.map((item) => ({ ...item, writable: false }));
  }
  return startFormPermissions.map((item) => ({ ...item }));
}

function ensureInstance(taskId?: string) {
  if (!taskId) return null;
  for (const instance of instances.values()) {
    if (instance.taskId === taskId) {
      return instance;
    }
  }
  return null;
}

function createInitialVariables(payload: Record<string, any>) {
  return {
    title: payload.title || '差旅报销',
    applicant: payload.applicant || '演示用户',
    department: payload.department || 'rd',
    amount: Number(payload.amount || 1200),
    urgent: Boolean(payload.urgent || false),
    items:
      Array.isArray(payload.items) && payload.items.length
        ? payload.items
        : [
            { item: '机票', cost: 860, remark: '上海-北京往返' },
            { item: '住宿', cost: 360, remark: '两晚酒店' },
          ],
    attachments: payload.attachments || [],
    description: payload.description || '请审批该报销申请。',
    serialNumber: payload.serialNumber || `MOCK-${new Date().getFullYear()}-${String(processSequence).padStart(4, '0')}`,
  };
}

function createInstance(payload: Record<string, any>): ProcessInstance {
  const processInstanceId = `pi-${processSequence++}`;
  const taskId = `task-${taskSequence++}`;
  const now = formatDate();
  const variables = createInitialVariables(payload);
  const flow: FlowRecord[] = [
    {
      historyActivityType: 'startEvent',
      historyActivityName: '发起申请',
      assigneeName: variables.applicant,
      createTime: now,
      comments: [],
    },
  ];
  const summary: SummaryFormItem[] = [
    {
      taskName: '发起申请',
      taskKey: 'start',
      content: JSON.stringify(cloneOption()),
    },
  ];

  return {
    id: definitionId,
    processDefinitionId: definitionId,
    processDefinitionName: processName,
    formKey,
    startUsername: variables.applicant,
    startTime: now,
    status: 'todo',
    processIsFinished: 'processing',
    processInstanceId,
    taskId,
    taskName: '报销审批',
    copyUser: payload.copyUser,
    copyUserName: payload.$copyUser,
    variables,
    flow,
    summary,
    buttonList: [...buttonCatalog],
    isOwner: true,
    isReturnable: true,
    isMultiInstance: true,
    xml: '<definitions id="MockProcess"></definitions>',
  };
}

function appendFlow(instance: ProcessInstance, record: FlowRecord) {
  instance.flow.push(record);
}

function createComment(comment: string | undefined, type: CommentType): FlowComment[] {
  if (!comment) return [];
  return [
    {
      type,
      fullMessage: comment,
      action: 'AddComment',
      time: formatDate(),
    },
  ];
}

export function getFormByProcessDefId(): Promise<{ data: ProcessFormResponse }> {
  const payload: ProcessFormResponse = {
    process: {
      id: definitionId,
      name: processName,
      formKey,
      hideComment: false,
      hideCopy: false,
      hideExamine: false,
      hideAttachment: false,
    },
    startForm: startFormPermissions,
    form: JSON.stringify(cloneOption()),
    appForm: JSON.stringify(cloneOption()),
  } as ProcessFormResponse;
  return Promise.resolve({ data: payload });
}

export function detail(params: Params): Promise<{ data: TaskDetailResponse }> {
  const instance = ensureInstance(params.taskId);
  if (!instance) {
    const fallback = createInstance({});
    instances.set(fallback.processInstanceId, fallback);
    return detail({ taskId: fallback.taskId });
  }

  const response: TaskDetailResponse = {
    process: {
      processDefinitionId: instance.processDefinitionId,
      processDefinitionName: instance.processDefinitionName,
      processInstanceId: instance.processInstanceId,
      taskId: instance.taskId,
      taskName: instance.taskName,
      startUsername: instance.startUsername,
      startTime: instance.startTime,
      status: instance.status,
      processIsFinished: instance.processIsFinished,
      copyUser: instance.copyUser,
      copyUserName: instance.copyUserName,
      isOwner: instance.isOwner,
      isReturnable: instance.isReturnable,
      isMultiInstance: instance.isMultiInstance,
      xml: instance.xml,
      variables: instance.variables,
    },
    form: {
      allForm: JSON.stringify(cloneOption()),
      allAppForm: JSON.stringify(cloneOption()),
      taskForm: resolveTaskForm(instance),
      formList: instance.summary,
    },
    flow: [...instance.flow],
    button: instance.status === 'todo' ? [...instance.buttonList] : [],
    bpmnOption: { xml: instance.xml },
  };

  return Promise.resolve({ data: response });
}

export function startProcess(data: Record<string, any>): Promise<{ success: boolean; taskId: string }> {
  const instance = createInstance(data);
  instances.set(instance.processInstanceId, instance);
  return Promise.resolve({ success: true, taskId: instance.taskId });
}

export function completeTask(data: Record<string, any>): Promise<{ success: boolean }> {
  const instance = ensureInstance(data.taskId);
  if (!instance) {
    return Promise.reject(new Error('任务不存在'));
  }
  Object.assign(instance.variables, data.variables || {});
  if (Array.isArray(data.copyUser)) {
    instance.copyUser = data.copyUser;
  }
  if (data.$copyUser) {
    instance.copyUserName = data.$copyUser;
  }
  const pass = data.pass !== false;
  const now = new Date();
  appendFlow(instance, {
    historyActivityType: 'userTask',
    historyActivityName: pass ? '审批通过' : '退回到申请人',
    assigneeName: pass ? '财务经理' : instance.startUsername,
    createTime: formatDate(now),
    endTime: formatDate(now),
    comments: createComment(data.comment, pass ? 'comment' : 'rollbackComment'),
  });
  instance.processIsFinished = pass ? 'finish' : 'reject';
  if (pass) {
    instance.status = 'done';
    instance.buttonList = [];
  } else {
    instance.status = 'todo';
    instance.buttonList = [...buttonCatalog];
  }
  instance.summary.push({
    taskName: pass ? '审批通过' : '退回修改',
    taskKey: pass ? 'approve' : 'reject',
    content: JSON.stringify(cloneOption()),
  });
  return Promise.resolve({ success: true });
}

export function transferTask(data: Record<string, any>): Promise<{ success: boolean }> {
  const instance = ensureInstance(data.taskId);
  if (!instance) {
    return Promise.reject(new Error('任务不存在'));
  }
  const assigneeName = Array.isArray(data.assignee) ? data.assignee.join(',') : data.assignee;
  appendFlow(instance, {
    historyActivityType: 'userTask',
    historyActivityName: '转办',
    assigneeName: assigneeName || '未指定',
    createTime: formatDate(),
    comments: createComment(data.comment, 'transferComment'),
  });
  instance.variables.assignee = assigneeName;
  return Promise.resolve({ success: true });
}

export function delegateTask(data: Record<string, any>): Promise<{ success: boolean }> {
  const instance = ensureInstance(data.taskId);
  if (!instance) {
    return Promise.reject(new Error('任务不存在'));
  }
  const assigneeName = Array.isArray(data.assignee) ? data.assignee.join(',') : data.assignee;
  appendFlow(instance, {
    historyActivityType: 'userTask',
    historyActivityName: '委托',
    assigneeName: assigneeName || '未指定',
    createTime: formatDate(),
    comments: createComment(data.comment, 'delegateComment'),
  });
  instance.variables.delegate = assigneeName;
  return Promise.resolve({ success: true });
}

export function claimTask(): Promise<{ success: boolean }> {
  return Promise.resolve({ success: true });
}

export function getBackNodes(): Promise<{ data: Array<{ nodeId: string; nodeName: string }> }> {
  return Promise.resolve({
    data: [
      { nodeId: 'startNode', nodeName: '发起人节点' },
      { nodeId: 'financeAudit', nodeName: '财务审批' },
    ],
  });
}

export function rollbackTask(data: Record<string, any>): Promise<{ success: boolean }> {
  const instance = ensureInstance(data.taskId);
  if (!instance) {
    return Promise.reject(new Error('任务不存在'));
  }
  instance.status = 'todo';
  instance.processIsFinished = 'rollback';
  instance.buttonList = [...buttonCatalog];
  appendFlow(instance, {
    historyActivityType: 'userTask',
    historyActivityName: '回退',
    assigneeName: instance.startUsername,
    createTime: formatDate(),
    comments: createComment(data.comment, 'rollbackComment'),
  });
  return Promise.resolve({ success: true });
}

export function terminateProcess(data: Record<string, any>): Promise<{ success: boolean }> {
  const instance = ensureInstance(data.taskId);
  if (!instance) {
    return Promise.reject(new Error('任务不存在'));
  }
  instance.status = 'done';
  instance.processIsFinished = 'terminate';
  appendFlow(instance, {
    historyActivityType: 'endEvent',
    historyActivityName: '流程终止',
    assigneeName: instance.startUsername,
    createTime: formatDate(),
    comments: createComment(data.comment, 'terminateComment'),
  });
  return Promise.resolve({ success: true });
}

export function addMultiInstance(data: Record<string, any>): Promise<{ success: boolean }> {
  const instance = ensureInstance(data.taskId);
  if (!instance) {
    return Promise.reject(new Error('任务不存在'));
  }
  const assigneeName = Array.isArray(data.assignee) ? data.assignee.join(',') : data.assignee;
  appendFlow(instance, {
    historyActivityType: 'userTask',
    historyActivityName: '加签',
    assigneeName: assigneeName || '未指定',
    createTime: formatDate(),
    comments: createComment(data.comment, 'addMultiInstanceComment'),
  });
  return Promise.resolve({ success: true });
}

export function withdrawTask(data: Record<string, any>): Promise<{ success: boolean }> {
  const instance = ensureInstance(data.taskId);
  if (!instance) {
    return Promise.reject(new Error('任务不存在'));
  }
  instance.status = 'done';
  instance.processIsFinished = 'withdraw';
  appendFlow(instance, {
    historyActivityType: 'userTask',
    historyActivityName: '撤销流程',
    assigneeName: instance.startUsername,
    createTime: formatDate(),
    comments: createComment('流程已撤销', 'withdrawComment'),
  });
  return Promise.resolve({ success: true });
}
