import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./db/entities/User";
import { Platform } from "./db/entities/Platform";
import { Genre } from "./db/entities/Genre";
import { UserPlatform } from "./db/entities/UserPlatform";
import { JourneyGame } from "./db/entities/JourneyGame";
import { JourneyGameGenre } from "./db/entities/JourneyGameGenre";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      autoLoadEntities: false,
      synchronize: false,
      // Mantenha explicitamente as entities para evitar problemas com autoLoadEntities.
      entities: [User, Platform, Genre, UserPlatform, JourneyGame, JourneyGameGenre],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
