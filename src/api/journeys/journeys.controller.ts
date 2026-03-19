import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { User } from '../../db/entities/User';
import { Platform } from '../../db/entities/Platform';
import { Genre } from '../../db/entities/Genre';
import { JourneyGame } from '../../db/entities/JourneyGame';
import { JourneyGameGenre } from '../../db/entities/JourneyGameGenre';
import { JourneyStatus } from '../../db/journey-status.enum';

const MONTH_LABELS: Record<string, string> = {
  '01': 'Janeiro',
  '02': 'Fevereiro',
  '03': 'Março',
  '04': 'Abril',
  '05': 'Maio',
  '06': 'Junho',
  '07': 'Julho',
  '08': 'Agosto',
  '09': 'Setembro',
  '10': 'Outubro',
  '11': 'Novembro',
  '12': 'Dezembro',
};

type JourneyMonth = {
  key: string;
  label: string;
  games: JourneyGameDTO[];
};

type MissionStats = {
  jogosZeradosNoAno: number;
  totalHoursInvested: number;
};

type JogosZeradosNaVida = {
  totalJogos: number;
  totalHoras: number;
  plataformas: string[];
};

type GenreShare = {
  genre: string;
  percent: number;
  hours?: number;
};

type JourneyGameDTO = {
  id: string;
  name: string;
  coverImageUrl: string;
  startedAt?: string;
  completedAt?: string;
  droppedAt?: string;
  hoursPlayed?: number;
  rating?: number;
  status: JourneyStatus;
  notes?: string;
  verdict?: string;
  genres?: string[];
  platform?: string;
  monthKey: string;
  is100Percent?: boolean;
  droppedReason?: string;
  releaseDate?: string;
  hasDemo?: boolean;
};

type JourneyYearData = {
  year: number;
  missionStats: MissionStats;
  jogosZeradosNaVida?: JogosZeradosNaVida;
  months: JourneyMonth[];
  genreHeatMap: GenreShare[];
  games: JourneyGameDTO[];
};

export class AddJourneyGameDto {
  id!: string; // rawgGameId
  name!: string;
  coverImageUrl?: string;
  startedAt!: string;
  completedAt?: string;
  droppedAt?: string;
  hoursPlayed?: number | null;
  rating?: number | null;
  notes?: string;
  verdict?: string;
  status!: JourneyStatus;
  genres?: string[];
  platform?: string;
  droppedReason?: string;
  releaseDate?: string;
  hasDemo?: boolean;
  is100Percent?: boolean;
}

export class UpdateJourneyGameDto {
  name?: string;
  coverImageUrl?: string;
  startedAt?: string;
  completedAt?: string;
  droppedAt?: string;
  hoursPlayed?: number | null;
  rating?: number | null;
  notes?: string;
  verdict?: string;
  status?: JourneyStatus;
  genres?: string[];
  platform?: string;
  droppedReason?: string;
  releaseDate?: string;
  hasDemo?: boolean;
  is100Percent?: boolean;
}

function normalizeToYYYYMMDD(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  return s.length >= 10 ? s.slice(0, 10) : null;
}

function toMonthKeyFromDate(date: string | null): string | null {
  if (!date) return null;
  if (date.length < 10) return null;
  const mk = date.slice(0, 7); // YYYY-MM
  if (!/^[0-9]{4}-[0-9]{2}$/.test(mk)) return null;
  return mk;
}

function monthKeyFromJourneyFields(args: {
  status: JourneyStatus;
  startedAt: string | null;
  completedAt: string | null;
  droppedAt: string | null;
  releaseDate: string | null;
}): string {
  const { status, startedAt, completedAt, droppedAt, releaseDate } = args;

  // PLAYING/DROPPED => startedAt
  if (status === JourneyStatus.PLAYING) {
    const mk = toMonthKeyFromDate(startedAt);
    if (!mk)
      throw new BadRequestException('startedAt inválido para gerar monthKey.');
    return mk;
  }

  if (status === JourneyStatus.DROPPED) {
    const mk = toMonthKeyFromDate(startedAt) ?? toMonthKeyFromDate(droppedAt);
    if (!mk)
      throw new BadRequestException(
        'startedAt/droppedAt inválidos para gerar monthKey.',
      );
    return mk;
  }

  // COMPLETED/PLATINUM => completedAt
  if (status === JourneyStatus.COMPLETED || status === JourneyStatus.PLATINUM) {
    const mk = toMonthKeyFromDate(completedAt) ?? toMonthKeyFromDate(startedAt);
    if (!mk)
      throw new BadRequestException(
        'completedAt inválido para gerar monthKey.',
      );
    return mk;
  }

  // WISHLIST => releaseDate
  if (status === JourneyStatus.WISHLIST) {
    const mk = toMonthKeyFromDate(releaseDate) ?? toMonthKeyFromDate(startedAt);
    if (!mk)
      throw new BadRequestException(
        'releaseDate inválido para gerar monthKey.',
      );
    return mk;
  }

  throw new BadRequestException('Status inválido.');
}

function buildMonthsFromGames(games: JourneyGameDTO[]): JourneyMonth[] {
  const byMonth = new Map<string, JourneyGameDTO[]>();
  for (const g of games) {
    const list = byMonth.get(g.monthKey) ?? [];
    list.push(g);
    byMonth.set(g.monthKey, list);
  }
  const months: JourneyMonth[] = [];
  const keys = Array.from(byMonth.keys()).sort();
  for (const key of keys) {
    const [, monthNum] = key.split('-');
    const label = MONTH_LABELS[monthNum ?? ''] ?? key;
    months.push({ key, label, games: byMonth.get(key) ?? [] });
  }
  return months;
}

function buildGenreHeatMap(games: JourneyGameDTO[]): GenreShare[] {
  const totalByGenre = new Map<string, { count: number; hours: number }>();
  let totalHours = 0;

  for (const g of games) {
    const hours = g.hoursPlayed ?? 0;
    totalHours += hours;
    for (const genre of g.genres ?? []) {
      const cur = totalByGenre.get(genre) ?? { count: 0, hours: 0 };
      cur.count += 1;
      cur.hours += hours;
      totalByGenre.set(genre, cur);
    }
  }

  if (totalHours === 0) totalHours = 1;
  return Array.from(totalByGenre.entries()).map(([genre, { hours }]) => ({
    genre,
    percent: Math.round((hours / totalHours) * 100),
    hours,
  }));
}

function computeMissionStats(
  games: JourneyGameDTO[],
  year: number,
): MissionStats {
  const yearStr = String(year);
  const jogosZeradosNoAno = games.filter(
    (g) =>
      (g.status === JourneyStatus.COMPLETED ||
        g.status === JourneyStatus.PLATINUM) &&
      (g.completedAt?.startsWith(yearStr) ?? g.monthKey.startsWith(yearStr)),
  ).length;

  const gamesDoAno = games.filter(
    (g) =>
      g.completedAt?.startsWith(yearStr) ||
      g.startedAt?.startsWith(yearStr) ||
      g.monthKey.startsWith(yearStr),
  );

  const totalHoursInvested = gamesDoAno.reduce(
    (acc, g) => acc + (g.hoursPlayed ?? 0),
    0,
  );

  return { jogosZeradosNoAno, totalHoursInvested };
}

function buildJogosZeradosNaVidaFromGames(
  games: JourneyGameDTO[],
): JogosZeradosNaVida {
  const completed = games.filter(
    (g) =>
      g.status === JourneyStatus.COMPLETED ||
      g.status === JourneyStatus.PLATINUM,
  );
  const totalHoras = games.reduce((acc, g) => acc + (g.hoursPlayed ?? 0), 0);
  return {
    totalJogos: completed.length,
    totalHoras,
    plataformas: ['PC', 'PlayStation 5', 'Xbox Series X'],
  };
}

function normalizeDateValue(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') {
    const s = value.trim();
    if (!s) return undefined;
    return s.slice(0, 10);
  }
  if (value instanceof Date) {
    const iso = value.toISOString();
    return iso.slice(0, 10);
  }
  return undefined;
}

function toNumberOrUndefined(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export class JourneysService {
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

  private normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }

  private async getUserId(username: string): Promise<string> {
    const user = await this.usersRepo.findOne({
      where: { username: this.normalizeUsername(username) },
    });
    if (!user) throw new HttpException('Usuário não encontrado.', 404);
    return user.id;
  }

  private emptyYearData(year: number): JourneyYearData {
    return {
      year,
      missionStats: { jogosZeradosNoAno: 0, totalHoursInvested: 0 },
      jogosZeradosNaVida: {
        totalJogos: 0,
        totalHoras: 0,
        plataformas: ['PC', 'PlayStation 5', 'Xbox Series X'],
      },
      months: [],
      genreHeatMap: [],
      games: [],
    };
  }

  private toJourneyGameDTO(entity: JourneyGame): JourneyGameDTO {
    const genres = (entity.journeyGameGenres ?? [])
      .map((jgg) => jgg.genre?.name)
      .filter((g): g is string => typeof g === 'string' && g.trim() !== '');

    const platformName = entity.platform?.name ?? undefined;
    return {
      id: entity.rawgGameId,
      name: entity.name,
      coverImageUrl: entity.coverImageUrl ?? '',
      startedAt: normalizeDateValue(entity.startedAt),
      completedAt: normalizeDateValue(entity.completedAt),
      droppedAt: normalizeDateValue(entity.droppedAt),
      hoursPlayed:
        entity.hoursPlayed === null
          ? undefined
          : (entity.hoursPlayed ?? undefined),
      rating: toNumberOrUndefined(entity.rating),
      status: entity.status,
      notes: entity.notes ?? undefined,
      verdict: entity.verdict ?? undefined,
      genres: genres.length > 0 ? genres : undefined,
      platform: platformName,
      monthKey: entity.monthKey,
      is100Percent: entity.is100Percent ?? undefined,
      droppedReason: entity.droppedReason ?? undefined,
      releaseDate: normalizeDateValue(entity.releaseDate),
      hasDemo: entity.hasDemo ?? undefined,
    };
  }

  private buildYearData(
    games: JourneyGameDTO[],
    year: number,
  ): JourneyYearData {
    const months = buildMonthsFromGames(games);
    const missionStats = computeMissionStats(games, year);
    const genreHeatMap = buildGenreHeatMap(games);
    const jogosZeradosNaVida = buildJogosZeradosNaVidaFromGames(games);

    return {
      year,
      missionStats,
      jogosZeradosNaVida,
      months,
      genreHeatMap,
      games,
    };
  }

  async getJourneyData(
    username: string,
    year: number,
  ): Promise<JourneyYearData> {
    const userId = await this.getUserId(username);

    const games = await this.journeyGameRepo.find({
      where: { userId, monthKey: Like(`${year}-%`) },
      relations: ['platform', 'journeyGameGenres', 'journeyGameGenres.genre'],
      order: { monthKey: 'ASC' },
    });

    if (games.length === 0) return this.emptyYearData(year);

    const dtos = games.map((g) => this.toJourneyGameDTO(g));
    return this.buildYearData(dtos, year);
  }

  private async upsertGenresForJourneyGame(
    journeyGameId: number,
    genresInput: string[] | undefined,
  ): Promise<void> {
    const normalized = Array.from(
      new Set((genresInput ?? []).map((g) => (g ?? '').trim()).filter(Boolean)),
    );

    // Se não veio no payload, não mexe.
    if (genresInput === undefined) return;

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

  private async resolvePlatformId(
    platformName?: string,
  ): Promise<number | null> {
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

  private computeAndValidateMonthKey(args: {
    status: JourneyStatus;
    startedAt: string | null;
    completedAt: string | null;
    droppedAt: string | null;
    releaseDate: string | null;
  }): string {
    return monthKeyFromJourneyFields(args);
  }

  async addJourneyGame(
    username: string,
    year: number,
    payload: AddJourneyGameDto,
  ): Promise<JourneyYearData> {
    const userId = await this.getUserId(username);

    const startedAt = normalizeToYYYYMMDD(payload.startedAt);
    const completedAt = normalizeToYYYYMMDD(payload.completedAt);
    const droppedAt = normalizeToYYYYMMDD(payload.droppedAt);
    const releaseDate = normalizeToYYYYMMDD(payload.releaseDate);

    const monthKey = this.computeAndValidateMonthKey({
      status: payload.status,
      startedAt,
      completedAt,
      droppedAt,
      releaseDate,
    });

    const platformId = await this.resolvePlatformId(payload.platform);

    const entity = this.journeyGameRepo.create({
      userId,
      rawgGameId: payload.id,
      name: payload.name,
      coverImageUrl:
        payload.coverImageUrl !== undefined &&
        payload.coverImageUrl.trim() !== ''
          ? payload.coverImageUrl
          : null,
      status: payload.status,
      startedAt: startedAt ?? null,
      completedAt: completedAt ?? null,
      droppedAt: droppedAt ?? null,
      hoursPlayed:
        payload.hoursPlayed === null || payload.hoursPlayed === undefined
          ? null
          : payload.hoursPlayed,
      rating:
        payload.rating === null || payload.rating === undefined
          ? null
          : payload.rating,
      platformId,
      monthKey,
      notes: payload.notes ?? null,
      verdict: payload.verdict ?? null,
      droppedReason: payload.droppedReason ?? null,
      releaseDate: releaseDate ?? null,
      hasDemo: payload.hasDemo ?? null,
      is100Percent: payload.is100Percent ?? null,
    });

    try {
      await this.journeyGameRepo.save(entity);
    } catch {
      throw new HttpException(
        'Falha ao salvar jogo da jornada (possível duplicidade).',
        HttpStatus.CONFLICT,
      );
    }

    await this.upsertGenresForJourneyGame(entity.id, payload.genres);

    return this.getJourneyData(username, year);
  }

  async updateJourneyGame(
    username: string,
    year: number,
    rawgGameId: string,
    updates: UpdateJourneyGameDto,
  ): Promise<JourneyYearData> {
    const userId = await this.getUserId(username);

    const existing = await this.journeyGameRepo.findOne({
      where: { userId, rawgGameId },
    });
    if (!existing) throw new HttpException('Jogo não encontrado.', 404);

    const status = updates.status ?? existing.status;

    const startedAt =
      updates.startedAt !== undefined
        ? normalizeToYYYYMMDD(updates.startedAt)
        : (normalizeDateValue(existing.startedAt) ?? null);

    const completedAt =
      updates.completedAt !== undefined
        ? normalizeToYYYYMMDD(updates.completedAt)
        : (normalizeDateValue(existing.completedAt) ?? null);

    const droppedAt =
      updates.droppedAt !== undefined
        ? normalizeToYYYYMMDD(updates.droppedAt)
        : (normalizeDateValue(existing.droppedAt) ?? null);

    const releaseDate =
      updates.releaseDate !== undefined
        ? normalizeToYYYYMMDD(updates.releaseDate)
        : (normalizeDateValue(existing.releaseDate) ?? null);

    const monthKey = this.computeAndValidateMonthKey({
      status,
      startedAt,
      completedAt,
      droppedAt,
      releaseDate,
    });

    const platformId =
      updates.platform !== undefined
        ? await this.resolvePlatformId(updates.platform)
        : (existing.platformId ?? null);

    // Aplica campos parciais
    existing.status = status;
    existing.monthKey = monthKey;

    if (updates.name !== undefined) existing.name = updates.name;
    if (updates.coverImageUrl !== undefined) {
      existing.coverImageUrl =
        updates.coverImageUrl.trim() === '' ? null : updates.coverImageUrl;
    }
    existing.startedAt = startedAt;
    existing.completedAt = completedAt;
    existing.droppedAt = droppedAt;
    existing.releaseDate = releaseDate;
    existing.platformId = platformId;

    if (updates.hoursPlayed !== undefined) {
      existing.hoursPlayed =
        updates.hoursPlayed === null ? null : updates.hoursPlayed;
    }
    if (updates.rating !== undefined) {
      existing.rating = updates.rating === null ? null : updates.rating;
    }
    if (updates.notes !== undefined) existing.notes = updates.notes ?? null;
    if (updates.verdict !== undefined)
      existing.verdict = updates.verdict ?? null;
    if (updates.droppedReason !== undefined)
      existing.droppedReason = updates.droppedReason ?? null;
    if (updates.hasDemo !== undefined)
      existing.hasDemo = updates.hasDemo ?? null;
    if (updates.is100Percent !== undefined)
      existing.is100Percent = updates.is100Percent ?? null;

    await this.journeyGameRepo.save(existing);

    await this.upsertGenresForJourneyGame(existing.id, updates.genres);

    return this.getJourneyData(username, year);
  }

  async clearAllJourneyGames(
    username: string,
    year: number,
  ): Promise<JourneyYearData> {
    const userId = await this.getUserId(username);
    await this.journeyGameRepo.delete({
      userId,
      monthKey: Like(`${year}-%`),
    } as any);
    return this.emptyYearData(year);
  }
}

@Controller('api/journeys')
export class JourneysController {
  constructor(private readonly journeysService: JourneysService) {}

  @Get(':username/:year')
  getJourneyData(
    @Param('username') username: string,
    @Param('year') year: string,
  ) {
    const y = Number(year);
    if (!Number.isFinite(y)) throw new BadRequestException('year inválido.');
    return this.journeysService.getJourneyData(username, y);
  }

  @Post(':username/:year/games')
  addJourneyGame(
    @Param('username') username: string,
    @Param('year') year: string,
    @Body() body: AddJourneyGameDto,
  ) {
    const y = Number(year);
    if (!Number.isFinite(y)) throw new BadRequestException('year inválido.');
    return this.journeysService.addJourneyGame(username, y, body);
  }

  @Patch(':username/:year/games/:rawgGameId')
  updateJourneyGame(
    @Param('username') username: string,
    @Param('year') year: string,
    @Param('rawgGameId') rawgGameId: string,
    @Body() body: UpdateJourneyGameDto,
  ) {
    const y = Number(year);
    if (!Number.isFinite(y)) throw new BadRequestException('year inválido.');
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
    const y = Number(year);
    if (!Number.isFinite(y)) throw new BadRequestException('year inválido.');
    return this.journeysService.clearAllJourneyGames(username, y);
  }
}
