import { Repository } from 'typeorm';
import { User } from '../../db/entities/User';
import { Platform } from '../../db/entities/Platform';
import { UserPlatform } from '../../db/entities/UserPlatform';
export declare class UsersRepository {
    private readonly usersRepo;
    private readonly platformsRepo;
    private readonly userPlatformsRepo;
    constructor(usersRepo: Repository<User>, platformsRepo: Repository<Platform>, userPlatformsRepo: Repository<UserPlatform>);
    findUserWithPlatforms(normalizedUsername: string): Promise<User | null>;
    saveUser(user: User): Promise<User>;
    replaceUserPlatforms(userId: string, platforms: {
        name: string;
        imageUrl: string | null;
    }[]): Promise<void>;
}
