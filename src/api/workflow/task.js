import http from '@/http/api.js';

const prefix = '/blade-workflow/app/task';

export function getFormByProcessDefId(params = {}) {
  return http.request({
    url: `${prefix}/getFormByProcessDefId`,
    method: 'GET',
    params,
  });
}

export function detail(params = {}) {
  return http.request({
    url: `${prefix}/detail`,
    method: 'GET',
    params,
  });
}

export function startProcess(data = {}) {
  return http.request({
    url: `${prefix}/startProcess`,
    method: 'POST',
    data,
  });
}

export function completeTask(data = {}) {
  return http.request({
    url: `${prefix}/completeTask`,
    method: 'POST',
    data,
  });
}

export function transferTask(data = {}) {
  return http.request({
    url: `${prefix}/transferTask`,
    method: 'POST',
    data,
  });
}

export function delegateTask(data = {}) {
  return http.request({
    url: `${prefix}/delegateTask`,
    method: 'POST',
    data,
  });
}

export function claimTask(data = {}) {
  return http.request({
    url: `${prefix}/claimTask`,
    method: 'POST',
    data,
  });
}

export function getBackNodes(params = {}) {
  return http.request({
    url: `${prefix}/getBackNodes`,
    method: 'GET',
    params,
  });
}

export function rollbackTask(data = {}) {
  return http.request({
    url: `${prefix}/rollbackTask`,
    method: 'POST',
    data,
  });
}

export function terminateProcess(data = {}) {
  return http.request({
    url: `${prefix}/terminateProcess`,
    method: 'POST',
    data,
  });
}

export function addMultiInstance(data = {}) {
  return http.request({
    url: `${prefix}/addMultiInstance`,
    method: 'POST',
    data,
  });
}

export function withdrawTask(data = {}) {
  return http.request({
    url: `${prefix}/withdrawTask`,
    method: 'POST',
    data,
  });
}
