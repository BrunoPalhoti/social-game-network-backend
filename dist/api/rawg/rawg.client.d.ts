import type { RawgGame, RawgGamesResponse, RawgGenre, RawgPlatform } from './types/rawg.types.js';
export declare class RawgClient {
    private readonly baseUrl;
    private getApiKey;
    private request;
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
