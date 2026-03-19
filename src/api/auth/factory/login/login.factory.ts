import type { LoginDto } from '../../dto/login.dto.js';
import { normalizeUsername } from '../normalizeUsername/normalizeUsername.factory.js';

export function loginFactory(payload: LoginDto) {
  const username = normalizeUsername(payload.username);
  const password = payload.password ?? '';
  return { username, password };
}
