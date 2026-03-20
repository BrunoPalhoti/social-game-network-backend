import { BadRequestException } from '@nestjs/common';
import { JourneyStatus } from '../../../../db/journey-status.enum';

export function normalizeToYYYYMMDD(value: unknown): string | null {
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

export function monthKeyFromJourneyFields(args: {
  status: JourneyStatus;
  startedAt: string | null;
  completedAt: string | null;
  droppedAt: string | null;
  releaseDate: string | null;
}): string {
  const { status, startedAt, completedAt, droppedAt, releaseDate } = args;

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

  if (status === JourneyStatus.COMPLETED || status === JourneyStatus.PLATINUM) {
    const mk = toMonthKeyFromDate(completedAt) ?? toMonthKeyFromDate(startedAt);
    if (!mk)
      throw new BadRequestException(
        'completedAt inválido para gerar monthKey.',
      );
    return mk;
  }

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
