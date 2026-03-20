import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { User } from '../../db/entities/User';
import { Platform } from '../../db/entities/Platform';
import { Genre } from '../../db/entities/Genre';
import { JourneyGame } from '../../db/entities/JourneyGame';
import { JourneyGameGenre } from '../../db/entities/JourneyGameGenre';

@Injectable()
export class JourneysRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Platform)
    private readonly platformsRepo: Repository<Platform>,
    @InjectRepository(Genre) private readonly genresRepo: Repository<Genre>,
    @InjectRepository(JourneyGame)
    private readonly journeyGameRepo: Repository<JourneyGame>,
    @InjectRepository(JourneyGameGenre)
    private readonly journeyGameGenreRepo: Repository<JourneyGameGenre>,
  ) {}

  findUserByUsername(normalizedUsername: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { username: normalizedUsername },
    });
  }

  findJourneyGamesForUserYear(
    userId: string,
    year: number,
  ): Promise<JourneyGame[]> {
    return this.journeyGameRepo.find({
      where: { userId, monthKey: Like(`${year}-%`) },
      relations: ['platform', 'journeyGameGenres', 'journeyGameGenres.genre'],
      order: { monthKey: 'ASC' },
    });
  }

  findJourneyGameByUserAndRawgId(
    userId: string,
    rawgGameId: string,
  ): Promise<JourneyGame | null> {
    return this.journeyGameRepo.findOne({
      where: { userId, rawgGameId },
    });
  }

  async insertJourneyGame(entity: JourneyGame): Promise<JourneyGame> {
    return this.journeyGameRepo.save(entity);
  }

  createJourneyGameEntity(partial: Parameters<Repository<JourneyGame>['create']>[0]): JourneyGame {
    return this.journeyGameRepo.create(partial);
  }

  saveJourneyGame(entity: JourneyGame): Promise<JourneyGame> {
    return this.journeyGameRepo.save(entity);
  }

  async deleteJourneyGamesForUserYear(
    userId: string,
    year: number,
  ): Promise<void> {
    await this.journeyGameRepo
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId })
      .andWhere('monthKey LIKE :pattern', { pattern: `${year}-%` })
      .execute();
  }

  async replaceGenresForJourneyGame(
    journeyGameId: number,
    genresInput: string[] | undefined,
  ): Promise<void> {
    if (genresInput === undefined) return;

    const normalized = Array.from(
      new Set((genresInput ?? []).map((g) => (g ?? '').trim()).filter(Boolean)),
    );

    await this.journeyGameGenreRepo.delete({ journeyGameId });

    if (normalized.length === 0) return;

    const existing = await this.genresRepo.find({
      where: { name: In(normalized) },
    });
    const existingByName = new Map(existing.map((g) => [g.name, g] as const));

    const missing = normalized
      .filter((name) => !existingByName.has(name))
      .map((name) => this.genresRepo.create({ name }));
    const created =
      missing.length > 0 ? await this.genresRepo.save(missing) : [];

    const all = [...existing, ...created];
    const byName = new Map(all.map((g) => [g.name, g] as const));

    const joins = normalized.map((name) =>
      this.journeyGameGenreRepo.create({
        journeyGameId,
        genreId: byName.get(name)!.id,
      }),
    );
    await this.journeyGameGenreRepo.save(joins);
  }

  async resolvePlatformId(platformName?: string): Promise<number | null> {
    if (!platformName) return null;
    const normalized = platformName.trim();
    if (!normalized) return null;

    const existing = await this.platformsRepo.findOne({
      where: { name: normalized },
    });
    if (existing) return existing.id;
    const created = await this.platformsRepo.save(
      this.platformsRepo.create({ name: normalized, imageUrl: null }),
    );
    return created.id;
  }
}
