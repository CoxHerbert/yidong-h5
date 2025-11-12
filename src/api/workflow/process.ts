import http from '@/http/api.js';

const prefix = '/blade-workflow/app/process';

type Params = Record<string, any>;

export function list(params: Params) {
  return http.request({
    url: `${prefix}/list`,
    method: 'GET',
    params,
  });
}

export function todoList(params: Params) {
  return http.request({
    url: `${prefix}/todoList`,
    method: 'GET',
    params,
  });
}

export function doneList(params: Params) {
  return http.request({
    url: `${prefix}/doneList`,
    method: 'GET',
    params,
  });
}

export function myDoneList(params: Params) {
  return http.request({
    url: `${prefix}/myDoneList`,
    method: 'GET',
    params,
  });
}

export function sendList(params: Params) {
  return http.request({
    url: `${prefix}/sendList`,
    method: 'GET',
    params,
  });
}

export function claimList(params: Params) {
  return http.request({
    url: `${prefix}/claimList`,
    method: 'GET',
    params,
  });
}
