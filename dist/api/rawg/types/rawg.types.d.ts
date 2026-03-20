export type RawgGamesResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};
export type RawgGame = {
    id: number;
    name: string;
    slug: string;
    released?: string;
    background_image: string | null;
    rating: number;
    rating_top: number;
    metacritic?: number;
    playtime?: number;
    platforms?: Array<{
        platform: {
            name: string;
        };
    }>;
    genres?: Array<{
        name: string;
    }>;
};
export type RawgPlatform = {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    image_background?: string | null;
    games_count?: number;
};
export type RawgGenre = {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string | null;
};
