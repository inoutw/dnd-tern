import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { message } from 'antd';

const httpInit = axios.create({
  timeout: 15000
});

export type HttpConfig = AxiosRequestConfig;

httpInit.interceptors.request.use((config) => {
  // resolve ie cache problem
  // 所有请求都添加时间戳 便于后端进行重放
  config.params = config.params ? config.params : {};
  config.params.__t = new Date().getTime();
  config.withCredentials = false;
  return config;
});

httpInit.interceptors.response.use(
  (response) => {
    if (response.data?.code === 401) {
      message.error('认证过期');
      localStorage.clear();
      (window as any).isReloading = true;
      window.location.reload();
      return response;
    }
    if (response.data?.code !== 200 && response.config.responseType !== 'blob') {
      // 返回blob类型时，没有code字段
      response.data?.msg && message.error(response.data.msg);
      return Promise.reject(response.data.msg);
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    if (error?.message && error.message.includes('timeout')) {
      message.error('连接服务器超时');
      return Promise.reject('连接服务器超时');
    }
    return Promise.reject(error);
  }
);

export function httpPost<T>(url: string, data?: any, config?: HttpConfig): AxiosPromise<T> {
  return httpInit.post(url, data, config);
}
export function httpGet<T>(url: string, config?: HttpConfig): AxiosPromise<T> {
  return httpInit.get(url, config);
}
export function httpDelete<T>(url: string, data?: any): AxiosPromise<T> {
  return httpInit.delete(url, { data });
}
export function httpPut<T>(url: string, data?: any, config?: HttpConfig): AxiosPromise<T> {
  return httpInit.put(url, data, config);
}
export function httpPatch<T>(url: string, data?: any, config?: HttpConfig): AxiosPromise<T> {
  return httpInit.patch(url, data, config);
}
export default httpInit;
