import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddJourneyGameDto } from './dto/add-journey-game.dto.js';
import { UpdateJourneyGameDto } from './dto/update-journey-game.dto.js';
import { yearFromParamFactory } from './factory/yearFromParam/yearFromParam.factory.js';
import { JourneysService } from './journeys.service.js';

@Controller('api/journeys')
export class JourneysController {
  constructor(private readonly journeysService: JourneysService) {}

  @Get(':username/:year')
  getJourneyData(
    @Param('username') username: string,
    @Param('year') year: string,
  ) {
    const y = yearFromParamFactory(year);
    return this.journeysService.getJourneyData(username, y);
  }

  @Post(':username/:year/games')
  addJourneyGame(
    @Param('username') username: string,
    @Param('year') year: string,
    @Body() body: AddJourneyGameDto,
  ) {
    const y = yearFromParamFactory(year);
    return this.journeysService.addJourneyGame(username, y, body);
  }

  @Patch(':username/:year/games/:rawgGameId')
  updateJourneyGame(
    @Param('username') username: string,
    @Param('year') year: string,
    @Param('rawgGameId') rawgGameId: string,
    @Body() body: UpdateJourneyGameDto,
  ) {
    const y = yearFromParamFactory(year);
    return this.journeysService.updateJourneyGame(
      username,
      y,
      rawgGameId,
      body,
    );
  }

  @Delete(':username/:year')
  clearAllJourneyGames(
    @Param('username') username: string,
    @Param('year') year: string,
  ) {
    const y = yearFromParamFactory(year);
    return this.journeysService.clearAllJourneyGames(username, y);
  }
}
