import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 20000
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Blade-Auth'] = `bearer ${token}`;
  }
  config.headers = {
    ...config.headers,
    'Tenant-Id': '000000',
    'Blade-Requested-With': 'BladeHttpRequest'
  };
  return config;
});

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.msg || error.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

export const request = <T = any>(config: AxiosRequestConfig) => instance.request<T>(config);

export default instance;
