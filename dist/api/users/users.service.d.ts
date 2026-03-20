import type { UpdateUserProfileDto } from './dto/update-user-profile.dto.js';
import { UsersRepository } from './users.repository.js';
import type { UserProfileResponse } from './types/users.types.js';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    private getUserOrThrow;
    getProfile(username: string): Promise<UserProfileResponse>;
    updateProfile(username: string, updates: UpdateUserProfileDto): Promise<void>;
}
