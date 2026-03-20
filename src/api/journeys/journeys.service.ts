import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { normalizeUsername } from '../auth/factory/normalizeUsername/normalizeUsername.factory.js';
import type { AddJourneyGameDto } from './dto/add-journey-game.dto.js';
import type { UpdateJourneyGameDto } from './dto/update-journey-game.dto.js';
import { buildJourneyYearDataFromDtos } from './factory/buildJourneyYearView/buildJourneyYearView.factory.js';
import {
  journeyGameDtoFromEntity,
  normalizeDateValue,
} from './factory/journeyGameDtoFromEntity/journeyGameDtoFromEntity.factory.js';
import {
  monthKeyFromJourneyFields,
  normalizeToYYYYMMDD,
} from './factory/monthKey/monthKey.factory.js';
import { JourneysRepository } from './journeys.repository.js';
import type { JourneyYearData } from './types/journeys.types.js';

@Injectable()
export class JourneysService {
  constructor(private readonly journeysRepository: JourneysRepository) {}

  private async getUserId(username: string): Promise<string> {
    const user = await this.journeysRepository.findUserByUsername(
      normalizeUsername(username),
    );
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

  async getJourneyData(
    username: string,
    year: number,
  ): Promise<JourneyYearData> {
    const userId = await this.getUserId(username);

    const games = await this.journeysRepository.findJourneyGamesForUserYear(
      userId,
      year,
    );

    if (games.length === 0) return this.emptyYearData(year);

    const dtos = games.map((g) => journeyGameDtoFromEntity(g));
    return buildJourneyYearDataFromDtos(dtos, year);
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

    const monthKey = monthKeyFromJourneyFields({
      status: payload.status,
      startedAt,
      completedAt,
      droppedAt,
      releaseDate,
    });

    const platformId = await this.journeysRepository.resolvePlatformId(
      payload.platform,
    );

    const entity = this.journeysRepository.createJourneyGameEntity({
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
      await this.journeysRepository.insertJourneyGame(entity);
    } catch {
      throw new HttpException(
        'Falha ao salvar jogo da jornada (possível duplicidade).',
        HttpStatus.CONFLICT,
      );
    }

    await this.journeysRepository.replaceGenresForJourneyGame(
      entity.id,
      payload.genres,
    );

    return this.getJourneyData(username, year);
  }

  async updateJourneyGame(
    username: string,
    year: number,
    rawgGameId: string,
    updates: UpdateJourneyGameDto,
  ): Promise<JourneyYearData> {
    const userId = await this.getUserId(username);

    const existing =
      await this.journeysRepository.findJourneyGameByUserAndRawgId(
        userId,
        rawgGameId,
      );
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

    const monthKey = monthKeyFromJourneyFields({
      status,
      startedAt,
      completedAt,
      droppedAt,
      releaseDate,
    });

    const platformId =
      updates.platform !== undefined
        ? await this.journeysRepository.resolvePlatformId(updates.platform)
        : (existing.platformId ?? null);

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

    await this.journeysRepository.saveJourneyGame(existing);

    await this.journeysRepository.replaceGenresForJourneyGame(
      existing.id,
      updates.genres,
    );

    return this.getJourneyData(username, year);
  }

  async clearAllJourneyGames(
    username: string,
    year: number,
  ): Promise<JourneyYearData> {
    const userId = await this.getUserId(username);
    await this.journeysRepository.deleteJourneyGamesForUserYear(userId, year);
    return this.emptyYearData(year);
  }
}
