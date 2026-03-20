import { GamesQueryDto } from './dto/games-query.dto.js';
import { RawgListQueryDto } from './dto/rawg-list-query.dto.js';
import { GamerService } from './gamer.service.js';
export declare class GamerController {
    private readonly gamerService;
    constructor(gamerService: GamerService);
    getGames(query: GamesQueryDto): Promise<import("../rawg/types/rawg.types.js").RawgGamesResponse<import("../rawg/types/rawg.types.js").RawgGame>>;
    getPlatforms(query: RawgListQueryDto): Promise<import("../rawg/types/rawg.types.js").RawgGamesResponse<import("../rawg/types/rawg.types.js").RawgPlatform>>;
    getGenres(query: RawgListQueryDto): Promise<import("../rawg/types/rawg.types.js").RawgGamesResponse<import("../rawg/types/rawg.types.js").RawgGenre>>;
}
