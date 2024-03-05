import axios, { AxiosError } from 'axios';

export { AxiosError };

const instance = axios.create({
  baseURL: `http://${process.env.HOST}:3000`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setToken(token: string) {
  instance.defaults.headers.common['Authorization'] = token;
}

export default instance;
