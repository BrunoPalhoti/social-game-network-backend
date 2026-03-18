import { JourneyGame } from "./JourneyGame";
import { UserPlatform } from "./UserPlatform";
export declare class User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    name: string;
    nickname: string;
    createdAt: Date;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    bannerPosition?: string | null;
    favoriteGameName?: string | null;
    favoriteGameCover?: string | null;
    favoriteGenreName?: string | null;
    favoriteGenreCover?: string | null;
    userPlatforms?: UserPlatform[];
    journeyGames?: JourneyGame[];
}
