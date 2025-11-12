import { request } from '@/utils/http';

const prefix = '/blade-workflow/app/process';

export interface PageParams {
  current?: number;
  size?: number;
  processDefinitionName?: string;
}

export interface ProcessResponse<T = any> {
  data: T;
}

export const fetchProcessList = (params?: Record<string, any>) =>
  request<ProcessResponse>({
    url: `${prefix}/list`,
    method: 'GET',
    params
  });

export const fetchTodoList = (params?: PageParams) =>
  request<ProcessResponse>({
    url: `${prefix}/todoList`,
    method: 'GET',
    params
  });

export const fetchSendList = (params?: PageParams) =>
  request<ProcessResponse>({
    url: `${prefix}/sendList`,
    method: 'GET',
    params
  });

export const fetchMyDoneList = (params?: PageParams) =>
  request<ProcessResponse>({
    url: `${prefix}/myDoneList`,
    method: 'GET',
    params
  });

export const fetchDoneList = (params?: PageParams) =>
  request<ProcessResponse>({
    url: `${prefix}/doneList`,
    method: 'GET',
    params
  });

export const fetchClaimList = (params?: PageParams) =>
  request<ProcessResponse>({
    url: `${prefix}/claimList`,
    method: 'GET',
    params
  });
