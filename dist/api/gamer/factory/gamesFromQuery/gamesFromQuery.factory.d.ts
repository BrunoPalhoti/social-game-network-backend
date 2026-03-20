import type { GamesQueryDto } from '../../dto/games-query.dto.js';
export declare function gamesFromQueryFactory(q: GamesQueryDto): {
    search: string | undefined;
    ordering: string | undefined;
    page: number | undefined;
    page_size: number | undefined;
};
