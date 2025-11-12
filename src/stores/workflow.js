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
} from '@/api/workflow';

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    process: null,
    buttonList: [],
    flow: [],
    bpmnOption: {},
  }),
  actions: {
    async fetchStartForm(processDefId) {
      const response = await getFormByProcessDefId({ processDefId });
      const data = response?.data ?? response;
      if (data && data.process) {
        this.process = data.process;
      }
      return data;
    },
    async submitStartForm(form) {
      await startProcess(form);
    },
    async fetchTaskDetail(taskId, processInsId) {
      const response = await detail({ taskId, processInsId });
      const data = response?.data ?? response;
      this.process = data?.process ?? null;
      this.flow = Array.isArray(data?.flow) ? [...data.flow].reverse() : [];
      this.buttonList = Array.isArray(data?.button) ? data.button : [];
      this.bpmnOption = {
        xml: data?.process?.xml,
        flow: data?.flow,
      };
      return data;
    },
    async submitCompleteTask(payload) {
      await completeTask(payload);
    },
    async submitTransferTask(payload) {
      await transferTask(payload);
    },
    async submitDelegateTask(payload) {
      await delegateTask(payload);
    },
    async fetchBackNodes(params) {
      const response = await getBackNodes(params);
      return response?.data ?? response;
    },
    async submitRollbackTask(payload) {
      await rollbackTask(payload);
    },
    async submitTerminateProcess(payload) {
      await terminateProcess(payload);
    },
    async submitAddMultiInstance(payload) {
      await addMultiInstance(payload);
    },
    async submitWithdrawTask(payload) {
      await withdrawTask(payload);
    },
  },
});
