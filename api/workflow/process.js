import http from '@/http/api.js';

const prefix = '/blade-workflow/app/process';

export function list(params = {}) {
  return http.request({
    url: `${prefix}/list`,
    method: 'GET',
    params,
  });
}

export function todoList(params = {}) {
  return http.request({
    url: `${prefix}/todoList`,
    method: 'GET',
    params,
  });
}

export function doneList(params = {}) {
  return http.request({
    url: `${prefix}/doneList`,
    method: 'GET',
    params,
  });
}

export function myDoneList(params = {}) {
  return http.request({
    url: `${prefix}/myDoneList`,
    method: 'GET',
    params,
  });
}

export function sendList(params = {}) {
  return http.request({
    url: `${prefix}/sendList`,
    method: 'GET',
    params,
  });
}

export function claimList(params = {}) {
  return http.request({
    url: `${prefix}/claimList`,
    method: 'GET',
    params,
  });
}
