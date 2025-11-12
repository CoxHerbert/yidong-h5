import * as realTaskApi from './task';
import * as mockTaskApi from './mock';

const runtimeEnv =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_USE_WORKFLOW_MOCK) ??
  (typeof process !== 'undefined' ? process.env.VITE_USE_WORKFLOW_MOCK : undefined);

const enableMock = runtimeEnv === undefined ? true : runtimeEnv !== 'false';

const taskApi = enableMock ? mockTaskApi : realTaskApi;

export const getFormByProcessDefId = taskApi.getFormByProcessDefId;
export const detail = taskApi.detail;
export const startProcess = taskApi.startProcess;
export const completeTask = taskApi.completeTask;
export const transferTask = taskApi.transferTask;
export const delegateTask = taskApi.delegateTask;
export const claimTask = taskApi.claimTask;
export const getBackNodes = taskApi.getBackNodes;
export const rollbackTask = taskApi.rollbackTask;
export const terminateProcess = taskApi.terminateProcess;
export const addMultiInstance = taskApi.addMultiInstance;
export const withdrawTask = taskApi.withdrawTask;

export type { ProcessFormResponse, TaskDetailResponse } from './task';
