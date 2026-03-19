import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../db/entities/User';
import { Platform } from '../db/entities/Platform';
import { Genre } from '../db/entities/Genre';
import { UserPlatform } from '../db/entities/UserPlatform';
import { JourneyGame } from '../db/entities/JourneyGame';
import { JourneyGameGenre } from '../db/entities/JourneyGameGenre';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersController, UsersService } from './users/users.controller';
import {
  JourneysController,
  JourneysService,
} from './journeys/journeys.controller';
import { GamerController, RawgProxyService } from './gamer/gamer.controller';
import { AuthRepository } from './auth/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Platform,
      Genre,
      UserPlatform,
      JourneyGame,
      JourneyGameGenre,
    ]),
  ],
  controllers: [
    AuthController,
    UsersController,
    JourneysController,
    GamerController,
  ],
  providers: [
    AuthService,
    AuthRepository,
    UsersService,
    JourneysService,
    RawgProxyService,
  ],
})
export class ApiModule {}
