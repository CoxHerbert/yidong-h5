import http from '@/http/api.js';

const prefix = '/blade-workflow/app/draft';

export function getDetail(params = {}) {
  return http.request({
    url: `${prefix}/detail`,
    method: 'GET',
    params,
  });
}

export function submit(data = {}) {
  return http.request({
    url: `${prefix}/submit`,
    method: 'POST',
    data,
  });
}
