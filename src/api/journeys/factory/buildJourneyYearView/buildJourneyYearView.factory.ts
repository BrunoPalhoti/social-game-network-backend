import { JourneyStatus } from '../../../../db/journey-status.enum';
import type {
  GenreShare,
  JourneyGameDTO,
  JourneyMonth,
  JourneyYearData,
  JogosZeradosNaVida,
  MissionStats,
} from '../../types/journeys.types.js';
import { MONTH_LABELS } from '../../types/journeys.types.js';

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

export function buildJourneyYearDataFromDtos(
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
