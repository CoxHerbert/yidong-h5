import http from '@/http/api.js';

const prefix = '/blade-workflow/app/draft';

type Params = Record<string, any>;

type Data = Record<string, any>;

export function getDetail(params: Params) {
  return http.request({
    url: `${prefix}/detail`,
    method: 'GET',
    params,
  });
}

export function submit(data: Data) {
  return http.request({
    url: `${prefix}/submit`,
    method: 'POST',
    data,
  });
}
