import type { JourneyGame } from '../../../../db/entities/JourneyGame';
import type { JourneyGameDTO } from '../../types/journeys.types.js';

export function normalizeDateValue(value: unknown): string | undefined {
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

export function journeyGameDtoFromEntity(entity: JourneyGame): JourneyGameDTO {
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
