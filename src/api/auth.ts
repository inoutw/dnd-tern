import { httpGet } from 'utils/http';

const api = {
  login(params: any) {
    return httpGet('/login').then((res) => res.data);
  }
};

export default api;
