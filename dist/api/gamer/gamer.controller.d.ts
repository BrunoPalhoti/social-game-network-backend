type RawgGamesResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};
type RawgGame = {
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
type RawgPlatform = {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    image_background?: string | null;
    games_count?: number;
};
type RawgGenre = {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string | null;
};
export declare class RawgProxyService {
    private readonly baseUrl;
    private getApiKey;
    private fetchRawg;
    games(params: {
        page?: number;
        page_size?: number;
        search?: string;
        ordering?: string;
    }): Promise<RawgGamesResponse<RawgGame>>;
    platforms(params: {
        page?: number;
        page_size?: number;
        ordering?: string;
    }): Promise<RawgGamesResponse<RawgPlatform>>;
    genres(params: {
        page?: number;
        page_size?: number;
        ordering?: string;
    }): Promise<RawgGamesResponse<RawgGenre>>;
}
export declare class GamerController {
    private readonly rawg;
    constructor(rawg: RawgProxyService);
    getGames(page?: string, pageSize?: string, search?: string, ordering?: string): Promise<RawgGamesResponse<RawgGame>>;
    getPlatforms(page?: string, pageSize?: string, ordering?: string): Promise<RawgGamesResponse<RawgPlatform>>;
    getGenres(page?: string, pageSize?: string, ordering?: string): Promise<RawgGamesResponse<RawgGenre>>;
}
export {};
