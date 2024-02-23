import {decode} from 'base-64';
import {jwtDecode} from 'jwt-decode';
import {JwtData} from '../models/auth';
import {storage} from './storage';

export function getUser() {
  global.atob = decode;
  const access_token = storage.getString('access_token');
  if (access_token) {
    const data = jwtDecode<JwtData>(access_token);
    return data;
  }
  return undefined;
}
