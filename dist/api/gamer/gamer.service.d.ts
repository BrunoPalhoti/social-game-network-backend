import { RawgService } from '../rawg/rawg.service.js';
import type { GamesQueryDto } from './dto/games-query.dto.js';
import type { RawgListQueryDto } from './dto/rawg-list-query.dto.js';
import type { RawgGame, RawgGamesResponse, RawgGenre, RawgPlatform } from '../rawg/types/rawg.types.js';
export declare class GamerService {
    private readonly rawgService;
    constructor(rawgService: RawgService);
    games(query: GamesQueryDto): Promise<RawgGamesResponse<RawgGame>>;
    platforms(query: RawgListQueryDto): Promise<RawgGamesResponse<RawgPlatform>>;
    genres(query: RawgListQueryDto): Promise<RawgGamesResponse<RawgGenre>>;
}
