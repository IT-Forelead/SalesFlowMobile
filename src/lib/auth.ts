import {AuthTokens, LoginData} from '@/models/auth';
import axiosClient, {publicAxiosClient} from '@/services/axios';
import {storage} from '@/lib/storage';

export function check() {
  const authed_on_str = storage.getString('authed_on');
  if (authed_on_str) {
    const authed_on = new Date(Date.parse(authed_on_str));
    const now = new Date();
    const elapsed_ms = now.getTime() - authed_on.getTime();
    const expires_in_ms = 1000 * 60 * 60 * 60 * 4; // 4 hours
    return elapsed_ms < expires_in_ms;
  }
  return false;
}

export async function login(data: LoginData) {
  const res = await publicAxiosClient.post<AuthTokens>('/auth/login', data);
  storage.set('access_token', res.data.accessToken);
  storage.set('refresh_token', res.data.refreshToken);
  storage.set('authed_on', new Date().toISOString());
}

export async function refreshToken() {
  try {
    const res = await publicAxiosClient.get<AuthTokens>('/auth/refresh', {
      headers: {
        Authorization: `Bearer ${storage.getString('refresh_token') ?? ''}`,
      },
    });
    const session = res?.data;
    if (!session?.accessToken) {
      storage.delete('access_token');
      storage.delete('refresh_token');
      storage.delete('authed_on');
    }

    storage.set('access_token', res.data.accessToken);
    storage.set('refresh_token', res.data.refreshToken);
    storage.set('authed_on', new Date().toISOString());

    return session;
  } catch (error: any) {
    if (error?.response?.status === 403) {
      storage.delete('access_token');
      storage.delete('refresh_token');
      storage.delete('authed_on');
      // TODO: redirect the user to the login
    }
  }
}

export async function logout() {
  await axiosClient.get('/auth/logout');
  storage.delete('access_token');
  storage.delete('refresh_token');
  storage.delete('authed_on');
}
