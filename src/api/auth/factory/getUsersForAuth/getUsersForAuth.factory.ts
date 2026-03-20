import type { User } from '../../../../db/entities/User';
import type { AuthUserSnapshot } from '../../types/auth.types.js';
import { toAuthSnapshotFromUser } from '../toAuthSnapshotFromUser/toAuthSnapshotFromUser.factory.js';
import { normalizeUsername } from '../normalizeUsername/normalizeUsername.factory.js';

export function getUsersForAuthFactory(
  users: User[],
): Record<string, AuthUserSnapshot> {
  const result: Record<string, AuthUserSnapshot> = {};

  for (const user of users) {
    result[normalizeUsername(user.username)] = toAuthSnapshotFromUser(user);
  }

  return result;
}
