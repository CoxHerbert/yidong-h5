import http from '@/http/api.js';

const prefix = '/blade-workflow/app/task';

export interface ProcessFormResponse {
  process: Record<string, any>;
  startForm?: Record<string, any>;
  form?: Record<string, any>;
  appForm?: Record<string, any>;
}

export interface TaskDetailResponse {
  process: Record<string, any>;
  form: Record<string, any>;
  flow: any[];
  button: any[];
  bpmnOption?: Record<string, any>;
}

export function getFormByProcessDefId(params: Record<string, any>) {
  return http.request<{ data: ProcessFormResponse }>({
    url: `${prefix}/getFormByProcessDefId`,
    method: 'GET',
    params,
  });
}

export function detail(params: Record<string, any>) {
  return http.request<{ data: TaskDetailResponse }>({
    url: `${prefix}/detail`,
    method: 'GET',
    params,
  });
}

export function startProcess(data: Record<string, any>) {
  return http.request({
    url: `${prefix}/startProcess`,
    method: 'POST',
    data,
  });
}

export function completeTask(data: Record<string, any>) {
  return http.request({
    url: `${prefix}/completeTask`,
    method: 'POST',
    data,
  });
}

export function transferTask(data: Record<string, any>) {
  return http.request({
    url: `${prefix}/transferTask`,
    method: 'POST',
    data,
  });
}

export function delegateTask(data: Record<string, any>) {
  return http.request({
    url: `${prefix}/delegateTask`,
    method: 'POST',
    data,
  });
}

export function claimTask(data: Record<string, any>) {
  return http.request({
    url: `${prefix}/claimTask`,
    method: 'POST',
    data,
  });
}

export function getBackNodes(params: Record<string, any>) {
  return http.request({
    url: `${prefix}/getBackNodes`,
    method: 'GET',
    params,
  });
}

export function rollbackTask(data: Record<string, any>) {
  return http.request({
    url: `${prefix}/rollbackTask`,
    method: 'POST',
    data,
  });
}

export function terminateProcess(data: Record<string, any>) {
  return http.request({
    url: `${prefix}/terminateProcess`,
    method: 'POST',
    data,
  });
}

export function addMultiInstance(data: Record<string, any>) {
  return http.request({
    url: `${prefix}/addMultiInstance`,
    method: 'POST',
    data,
  });
}

export function withdrawTask(data: Record<string, any>) {
  return http.request({
    url: `${prefix}/withdrawTask`,
    method: 'POST',
    data,
  });
}
