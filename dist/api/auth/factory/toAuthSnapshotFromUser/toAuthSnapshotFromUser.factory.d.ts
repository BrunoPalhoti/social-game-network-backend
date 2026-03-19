import type { User } from '../../../../db/entities/User';
import type { AuthUserSnapshot } from '../../types/auth.types.js';
export declare function toAuthSnapshotFromUser(user: User): AuthUserSnapshot;
