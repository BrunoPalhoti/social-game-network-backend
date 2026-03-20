import { UpdateUserProfileDto } from './dto/update-user-profile.dto.js';
import { UsersService } from './users.service.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(username: string): Promise<import("./types/users.types.js").UserProfileResponse>;
    updateProfile(username: string, body: UpdateUserProfileDto): Promise<void>;
}
