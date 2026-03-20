import { Injectable } from '@nestjs/common';
import { RawgService } from '../rawg/rawg.service.js';
import type { GamesQueryDto } from './dto/games-query.dto.js';
import type { RawgListQueryDto } from './dto/rawg-list-query.dto.js';
import { gamesFromQueryFactory } from './factory/gamesFromQuery/gamesFromQuery.factory.js';
import { paginationFromQueryFactory } from './factory/paginationFromQuery/paginationFromQuery.factory.js';
import type {
  RawgGame,
  RawgGamesResponse,
  RawgGenre,
  RawgPlatform,
} from '../rawg/types/rawg.types.js';

@Injectable()
export class GamerService {
  constructor(private readonly rawgService: RawgService) {}

  games(query: GamesQueryDto): Promise<RawgGamesResponse<RawgGame>> {
    const params = gamesFromQueryFactory(query);
    return this.rawgService.games(params);
  }

  platforms(query: RawgListQueryDto): Promise<RawgGamesResponse<RawgPlatform>> {
    const params = paginationFromQueryFactory(query);
    return this.rawgService.platforms(params);
  }

  genres(query: RawgListQueryDto): Promise<RawgGamesResponse<RawgGenre>> {
    const params = paginationFromQueryFactory(query);
    return this.rawgService.genres(params);
  }
}
