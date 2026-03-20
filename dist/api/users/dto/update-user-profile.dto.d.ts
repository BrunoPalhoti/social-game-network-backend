import type { PlatformSelection } from '../types/users.types.js';
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
