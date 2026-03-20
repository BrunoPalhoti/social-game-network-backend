"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildJourneyYearDataFromDtos = buildJourneyYearDataFromDtos;
const journey_status_enum_1 = require("../../../../db/journey-status.enum");
const journeys_types_js_1 = require("../../types/journeys.types.js");
function buildMonthsFromGames(games) {
    const byMonth = new Map();
    for (const g of games) {
        const list = byMonth.get(g.monthKey) ?? [];
        list.push(g);
        byMonth.set(g.monthKey, list);
    }
    const months = [];
    const keys = Array.from(byMonth.keys()).sort();
    for (const key of keys) {
        const [, monthNum] = key.split('-');
        const label = journeys_types_js_1.MONTH_LABELS[monthNum ?? ''] ?? key;
        months.push({ key, label, games: byMonth.get(key) ?? [] });
    }
    return months;
}
function buildGenreHeatMap(games) {
    const totalByGenre = new Map();
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
    if (totalHours === 0)
        totalHours = 1;
    return Array.from(totalByGenre.entries()).map(([genre, { hours }]) => ({
        genre,
        percent: Math.round((hours / totalHours) * 100),
        hours,
    }));
}
function computeMissionStats(games, year) {
    const yearStr = String(year);
    const jogosZeradosNoAno = games.filter((g) => (g.status === journey_status_enum_1.JourneyStatus.COMPLETED ||
        g.status === journey_status_enum_1.JourneyStatus.PLATINUM) &&
        (g.completedAt?.startsWith(yearStr) ?? g.monthKey.startsWith(yearStr))).length;
    const gamesDoAno = games.filter((g) => g.completedAt?.startsWith(yearStr) ||
        g.startedAt?.startsWith(yearStr) ||
        g.monthKey.startsWith(yearStr));
    const totalHoursInvested = gamesDoAno.reduce((acc, g) => acc + (g.hoursPlayed ?? 0), 0);
    return { jogosZeradosNoAno, totalHoursInvested };
}
function buildJogosZeradosNaVidaFromGames(games) {
    const completed = games.filter((g) => g.status === journey_status_enum_1.JourneyStatus.COMPLETED ||
        g.status === journey_status_enum_1.JourneyStatus.PLATINUM);
    const totalHoras = games.reduce((acc, g) => acc + (g.hoursPlayed ?? 0), 0);
    return {
        totalJogos: completed.length,
        totalHoras,
        plataformas: ['PC', 'PlayStation 5', 'Xbox Series X'],
    };
}
function buildJourneyYearDataFromDtos(games, year) {
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
//# sourceMappingURL=buildJourneyYearView.factory.js.map