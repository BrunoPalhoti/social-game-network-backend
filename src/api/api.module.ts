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
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { JourneysController } from './journeys/journeys.controller';
import { JourneysService } from './journeys/journeys.service';
import { JourneysRepository } from './journeys/journeys.repository';
import { GamerController } from './gamer/gamer.controller';
import { GamerService } from './gamer/gamer.service';
import { RawgModule } from './rawg/rawg.module';
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
    RawgModule,
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
    UsersRepository,
    JourneysService,
    JourneysRepository,
    GamerService,
  ],
})
export class ApiModule {}
