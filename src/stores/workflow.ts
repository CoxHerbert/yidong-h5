import { defineStore } from 'pinia';
import {
  addMultiInstance,
  completeTask,
  delegateTask,
  detail,
  getBackNodes,
  getFormByProcessDefId,
  rollbackTask,
  startProcess,
  terminateProcess,
  transferTask,
  withdrawTask,
} from '@/api/workflow/task';
import type { ProcessFormResponse, TaskDetailResponse } from '@/api/workflow/task';

interface WorkflowState {
  process: Record<string, any> | null;
  buttonList: any[];
  flow: any[];
  bpmnOption: Record<string, any>;
}

export const useWorkflowStore = defineStore('workflow', {
  state: (): WorkflowState => ({
    process: null,
    buttonList: [],
    flow: [],
    bpmnOption: {},
  }),
  actions: {
    async fetchStartForm(processDefId: string): Promise<ProcessFormResponse> {
      const response = await getFormByProcessDefId({ processDefId });
      const data = (response as any).data ?? response;
      const payload = data as unknown as ProcessFormResponse;
      if (payload.process) {
        this.process = payload.process;
      }
      return payload;
    },
    async submitStartForm(form: Record<string, any>) {
      await startProcess(form);
    },
    async fetchTaskDetail(taskId: string, processInsId?: string): Promise<TaskDetailResponse> {
      const response = await detail({ taskId, processInsId });
      const data = (response as any).data ?? response;
      const payload = data as unknown as TaskDetailResponse;
      this.process = payload.process;
      this.flow = Array.isArray(payload.flow) ? [...payload.flow].reverse() : [];
      this.buttonList = Array.isArray(payload.button) ? payload.button : [];
      this.bpmnOption = {
        xml: payload.process?.xml,
        flow: payload.flow,
      };
      return payload;
    },
    async submitCompleteTask(data: Record<string, any>) {
      await completeTask(data);
    },
    async submitTransferTask(data: Record<string, any>) {
      await transferTask(data);
    },
    async submitDelegateTask(data: Record<string, any>) {
      await delegateTask(data);
    },
    async fetchBackNodes(params: Record<string, any>) {
      const response = await getBackNodes(params);
      return (response as any).data ?? response;
    },
    async submitRollbackTask(data: Record<string, any>) {
      await rollbackTask(data);
    },
    async submitTerminateProcess(data: Record<string, any>) {
      await terminateProcess(data);
    },
    async submitAddMultiInstance(data: Record<string, any>) {
      await addMultiInstance(data);
    },
    async submitWithdrawTask(data: Record<string, any>) {
      await withdrawTask(data);
    },
  },
});
