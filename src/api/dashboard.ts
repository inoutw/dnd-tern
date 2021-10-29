import { httpGet } from 'utils/http';

const api = {
  getTest() {
    return httpGet('/dashboard/get').then((res) => res.data);
  }
};

export default api;
