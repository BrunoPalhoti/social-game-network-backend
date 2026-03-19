import type { RegisterDto } from '../../dto/register.dto.js';
import { normalizeUsername } from '../normalizeUsername/normalizeUsername.factory.js';

export function registerFactory(payload: RegisterDto) {
  const username = normalizeUsername(payload.username);
  const email = payload.email.trim().toLowerCase();
  const password = payload.password ?? '';

  return { username, email, password };
}

