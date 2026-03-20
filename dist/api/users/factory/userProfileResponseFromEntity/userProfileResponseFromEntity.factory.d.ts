import type { User } from '../../../../db/entities/User';
import type { UserProfileResponse } from '../../types/users.types.js';
export declare function userProfileResponseFromEntity(user: User): UserProfileResponse;
