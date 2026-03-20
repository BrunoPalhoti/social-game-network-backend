import { Controller, Get, Query } from '@nestjs/common';
import { GamesQueryDto } from './dto/games-query.dto.js';
import { RawgListQueryDto } from './dto/rawg-list-query.dto.js';
import { GamerService } from './gamer.service.js';

@Controller('api/gamer')
export class GamerController {
  constructor(private readonly gamerService: GamerService) {}

  @Get('games')
  getGames(@Query() query: GamesQueryDto) {
    return this.gamerService.games(query);
  }

  @Get('platforms')
  getPlatforms(@Query() query: RawgListQueryDto) {
    return this.gamerService.platforms(query);
  }

  @Get('genres')
  getGenres(@Query() query: RawgListQueryDto) {
    return this.gamerService.genres(query);
  }
}
