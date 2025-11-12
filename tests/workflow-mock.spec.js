import { beforeEach, describe, expect, it } from 'vitest';

import { getFormByProcessDefId, startProcess } from '@/api/workflow';
import { useWorkflowStore } from '@/stores/workflow';

describe('workflow mock service', () => {
  beforeEach(() => {
    process.env.VITE_USE_WORKFLOW_MOCK = 'true';
    const store = useWorkflowStore();
    store.process = null;
    store.buttonList = [];
    store.flow = [];
    store.bpmnOption = {};
  });

  it('runs through start, transfer, rollback and approval lifecycle', async () => {
    const store = useWorkflowStore();

    const formResponse = await getFormByProcessDefId({ processDefId: 'mock-expense-process' });
    expect(formResponse.data.process?.name).toContain('费用报销');

    const startResult = await startProcess({ title: '差旅报销', applicant: '张三', amount: 1000 });
    expect(startResult.taskId).toBeTruthy();

    const taskId = startResult.taskId;

    const detail = await store.fetchTaskDetail(taskId);
    expect(detail.process.status).toBe('todo');
    expect(store.buttonList.length).toBeGreaterThan(0);

    await store.submitTransferTask({ taskId, assignee: '李四', comment: '请协助处理' });
    await store.fetchTaskDetail(taskId);
    expect(store.flow.some((item) => item.historyActivityName === '转办')).toBe(true);

    await store.submitRollbackTask({ taskId, nodeId: 'startNode', comment: '资料补充' });
    await store.fetchTaskDetail(taskId);
    expect(store.process?.processIsFinished).toBe('rollback');

    await store.submitCompleteTask({
      taskId,
      processInstanceId: detail.process.processInstanceId,
      processDefinitionName: detail.process.processDefinitionName,
      processDefinitionId: detail.process.processDefinitionId,
      pass: true,
      comment: '同意',
    });
    await store.fetchTaskDetail(taskId);

    expect(store.process?.status).toBe('done');
    expect(store.buttonList.length).toBe(0);
    expect(store.flow.some((item) => item.historyActivityName === '审批通过')).toBe(true);
  });
});
