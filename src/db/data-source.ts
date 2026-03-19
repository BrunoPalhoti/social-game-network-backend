import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Platform } from './entities/Platform';
import { Genre } from './entities/Genre';
import { UserPlatform } from './entities/UserPlatform';
import { JourneyGame } from './entities/JourneyGame';
import { JourneyGameGenre } from './entities/JourneyGameGenre';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // Evite sincronizar automaticamente: schema deve vir de migrations.
  synchronize: false,
  logging: false,
  entities: [
    User,
    Platform,
    Genre,
    UserPlatform,
    JourneyGame,
    JourneyGameGenre,
  ],
  // No container de dev, também pode existir `dist/`.
  // Se carregarmos `src` e `dist` ao mesmo tempo, o TypeORM pode enxergar a mesma migration duas vezes.
  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/migrations/*.js']
      : ['src/migrations/*.ts'],
});
