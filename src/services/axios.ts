import axios, {AxiosHeaderValue, HeadersDefaults} from 'axios';
import Config from 'react-native-config';
import {refreshToken} from '@/lib/auth';
import {storage} from '@/lib/storage';

type Headers = {
  'Content-Type': string;
  Authorization: string;
} & {[key: string]: AxiosHeaderValue};

export const publicAxiosClient = axios.create({
  baseURL: Config.API_URL,
});

const axiosClient = axios.create({
  baseURL: Config.API_URL,
});

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
} as Headers & HeadersDefaults;

axiosClient.interceptors.request.use(
  config => {
    const token = storage.getString('access_token');
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    const config = err.config;

    if (config.url !== '/auth/login' && err.response) {
      if (err.response.status === 403 && !config?.sent) {
        config.sent = true;

        const result = await refreshToken();
        if (result?.accessToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${result?.accessToken}`,
          };
        }
        let res = await axios(config);
        return res?.data;
      }
    }
    return Promise.reject(err);
  },
);

export default axiosClient;
