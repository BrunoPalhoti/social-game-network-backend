import { Repository } from 'typeorm';
import { User } from '../../db/entities/User';
import { Platform } from '../../db/entities/Platform';
import { UserPlatform } from '../../db/entities/UserPlatform';
type PlatformSelection = {
    name: string;
    imageUrl: string | null;
};
type UserProfileResponse = {
    username: string;
    name: string;
    nickname: string;
    platforms?: PlatformSelection[];
    favoriteGame?: string;
    favoriteGameCover?: string;
    favoriteGenre?: string;
    favoriteGenreCover?: string;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    bannerPosition?: 'top' | 'center' | 'bottom' | number;
};
export declare class UpdateUserProfileDto {
    favoriteGame?: string;
    favoriteGameCover?: string;
    favoriteGenre?: string;
    favoriteGenreCover?: string;
    platforms?: PlatformSelection[];
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    bannerPosition?: 'top' | 'center' | 'bottom' | number;
}
export declare class UsersService {
    private readonly usersRepo;
    private readonly platformsRepo;
    private readonly userPlatformsRepo;
    constructor(usersRepo: Repository<User>, platformsRepo: Repository<Platform>, userPlatformsRepo: Repository<UserPlatform>);
    private normalizeUsername;
    private toBannerPosition;
    private getUserOrThrow;
    private toProfileResponse;
    getProfile(username: string): Promise<UserProfileResponse>;
    updateProfile(username: string, updates: UpdateUserProfileDto): Promise<void>;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(username: string): Promise<UserProfileResponse>;
    updateProfile(username: string, body: UpdateUserProfileDto): Promise<void>;
}
export {};
