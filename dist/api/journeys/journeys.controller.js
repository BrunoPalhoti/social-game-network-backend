"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneysController = exports.JourneysService = exports.UpdateJourneyGameDto = exports.AddJourneyGameDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../../db/entities/User");
const Platform_1 = require("../../db/entities/Platform");
const Genre_1 = require("../../db/entities/Genre");
const JourneyGame_1 = require("../../db/entities/JourneyGame");
const JourneyGameGenre_1 = require("../../db/entities/JourneyGameGenre");
const journey_status_enum_1 = require("../../db/journey-status.enum");
const MONTH_LABELS = {
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
class AddJourneyGameDto {
    id;
    name;
    coverImageUrl;
    startedAt;
    completedAt;
    droppedAt;
    hoursPlayed;
    rating;
    notes;
    verdict;
    status;
    genres;
    platform;
    droppedReason;
    releaseDate;
    hasDemo;
    is100Percent;
}
exports.AddJourneyGameDto = AddJourneyGameDto;
class UpdateJourneyGameDto {
    name;
    coverImageUrl;
    startedAt;
    completedAt;
    droppedAt;
    hoursPlayed;
    rating;
    notes;
    verdict;
    status;
    genres;
    platform;
    droppedReason;
    releaseDate;
    hasDemo;
    is100Percent;
}
exports.UpdateJourneyGameDto = UpdateJourneyGameDto;
function normalizeToYYYYMMDD(value) {
    if (typeof value !== 'string')
        return null;
    const s = value.trim();
    if (!s)
        return null;
    return s.length >= 10 ? s.slice(0, 10) : null;
}
function toMonthKeyFromDate(date) {
    if (!date)
        return null;
    if (date.length < 10)
        return null;
    const mk = date.slice(0, 7);
    if (!/^[0-9]{4}-[0-9]{2}$/.test(mk))
        return null;
    return mk;
}
function monthKeyFromJourneyFields(args) {
    const { status, startedAt, completedAt, droppedAt, releaseDate } = args;
    if (status === journey_status_enum_1.JourneyStatus.PLAYING) {
        const mk = toMonthKeyFromDate(startedAt);
        if (!mk)
            throw new common_1.BadRequestException('startedAt inválido para gerar monthKey.');
        return mk;
    }
    if (status === journey_status_enum_1.JourneyStatus.DROPPED) {
        const mk = toMonthKeyFromDate(startedAt) ?? toMonthKeyFromDate(droppedAt);
        if (!mk)
            throw new common_1.BadRequestException('startedAt/droppedAt inválidos para gerar monthKey.');
        return mk;
    }
    if (status === journey_status_enum_1.JourneyStatus.COMPLETED || status === journey_status_enum_1.JourneyStatus.PLATINUM) {
        const mk = toMonthKeyFromDate(completedAt) ?? toMonthKeyFromDate(startedAt);
        if (!mk)
            throw new common_1.BadRequestException('completedAt inválido para gerar monthKey.');
        return mk;
    }
    if (status === journey_status_enum_1.JourneyStatus.WISHLIST) {
        const mk = toMonthKeyFromDate(releaseDate) ?? toMonthKeyFromDate(startedAt);
        if (!mk)
            throw new common_1.BadRequestException('releaseDate inválido para gerar monthKey.');
        return mk;
    }
    throw new common_1.BadRequestException('Status inválido.');
}
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
        const label = MONTH_LABELS[monthNum ?? ''] ?? key;
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
function normalizeDateValue(value) {
    if (!value)
        return undefined;
    if (typeof value === 'string') {
        const s = value.trim();
        if (!s)
            return undefined;
        return s.slice(0, 10);
    }
    if (value instanceof Date) {
        const iso = value.toISOString();
        return iso.slice(0, 10);
    }
    return undefined;
}
function toNumberOrUndefined(value) {
    if (value === null || value === undefined)
        return undefined;
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : undefined;
}
let JourneysService = class JourneysService {
    usersRepo;
    platformsRepo;
    genresRepo;
    journeyGameRepo;
    journeyGameGenreRepo;
    constructor(usersRepo, platformsRepo, genresRepo, journeyGameRepo, journeyGameGenreRepo) {
        this.usersRepo = usersRepo;
        this.platformsRepo = platformsRepo;
        this.genresRepo = genresRepo;
        this.journeyGameRepo = journeyGameRepo;
        this.journeyGameGenreRepo = journeyGameGenreRepo;
    }
    normalizeUsername(username) {
        return username.trim().toLowerCase();
    }
    async getUserId(username) {
        const user = await this.usersRepo.findOne({
            where: { username: this.normalizeUsername(username) },
        });
        if (!user)
            throw new common_1.HttpException('Usuário não encontrado.', 404);
        return user.id;
    }
    emptyYearData(year) {
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
    toJourneyGameDTO(entity) {
        const genres = (entity.journeyGameGenres ?? [])
            .map((jgg) => jgg.genre?.name)
            .filter((g) => typeof g === 'string' && g.trim() !== '');
        const platformName = entity.platform?.name ?? undefined;
        return {
            id: entity.rawgGameId,
            name: entity.name,
            coverImageUrl: entity.coverImageUrl ?? '',
            startedAt: normalizeDateValue(entity.startedAt),
            completedAt: normalizeDateValue(entity.completedAt),
            droppedAt: normalizeDateValue(entity.droppedAt),
            hoursPlayed: entity.hoursPlayed === null
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
    buildYearData(games, year) {
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
    async getJourneyData(username, year) {
        const userId = await this.getUserId(username);
        const games = await this.journeyGameRepo.find({
            where: { userId, monthKey: (0, typeorm_2.Like)(`${year}-%`) },
            relations: ['platform', 'journeyGameGenres', 'journeyGameGenres.genre'],
            order: { monthKey: 'ASC' },
        });
        if (games.length === 0)
            return this.emptyYearData(year);
        const dtos = games.map((g) => this.toJourneyGameDTO(g));
        return this.buildYearData(dtos, year);
    }
    async upsertGenresForJourneyGame(journeyGameId, genresInput) {
        const normalized = Array.from(new Set((genresInput ?? []).map((g) => (g ?? '').trim()).filter(Boolean)));
        if (genresInput === undefined)
            return;
        await this.journeyGameGenreRepo.delete({ journeyGameId });
        if (normalized.length === 0)
            return;
        const existing = await this.genresRepo.find({
            where: { name: (0, typeorm_2.In)(normalized) },
        });
        const existingByName = new Map(existing.map((g) => [g.name, g]));
        const missing = normalized
            .filter((name) => !existingByName.has(name))
            .map((name) => this.genresRepo.create({ name }));
        const created = missing.length > 0 ? await this.genresRepo.save(missing) : [];
        const all = [...existing, ...created];
        const byName = new Map(all.map((g) => [g.name, g]));
        const joins = normalized.map((name) => this.journeyGameGenreRepo.create({
            journeyGameId,
            genreId: byName.get(name).id,
        }));
        await this.journeyGameGenreRepo.save(joins);
    }
    async resolvePlatformId(platformName) {
        if (!platformName)
            return null;
        const normalized = platformName.trim();
        if (!normalized)
            return null;
        const existing = await this.platformsRepo.findOne({
            where: { name: normalized },
        });
        if (existing)
            return existing.id;
        const created = await this.platformsRepo.save(this.platformsRepo.create({ name: normalized, imageUrl: null }));
        return created.id;
    }
    computeAndValidateMonthKey(args) {
        return monthKeyFromJourneyFields(args);
    }
    async addJourneyGame(username, year, payload) {
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
            coverImageUrl: payload.coverImageUrl !== undefined &&
                payload.coverImageUrl.trim() !== ''
                ? payload.coverImageUrl
                : null,
            status: payload.status,
            startedAt: startedAt ?? null,
            completedAt: completedAt ?? null,
            droppedAt: droppedAt ?? null,
            hoursPlayed: payload.hoursPlayed === null || payload.hoursPlayed === undefined
                ? null
                : payload.hoursPlayed,
            rating: payload.rating === null || payload.rating === undefined
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
        }
        catch {
            throw new common_1.HttpException('Falha ao salvar jogo da jornada (possível duplicidade).', common_1.HttpStatus.CONFLICT);
        }
        await this.upsertGenresForJourneyGame(entity.id, payload.genres);
        return this.getJourneyData(username, year);
    }
    async updateJourneyGame(username, year, rawgGameId, updates) {
        const userId = await this.getUserId(username);
        const existing = await this.journeyGameRepo.findOne({
            where: { userId, rawgGameId },
        });
        if (!existing)
            throw new common_1.HttpException('Jogo não encontrado.', 404);
        const status = updates.status ?? existing.status;
        const startedAt = updates.startedAt !== undefined
            ? normalizeToYYYYMMDD(updates.startedAt)
            : (normalizeDateValue(existing.startedAt) ?? null);
        const completedAt = updates.completedAt !== undefined
            ? normalizeToYYYYMMDD(updates.completedAt)
            : (normalizeDateValue(existing.completedAt) ?? null);
        const droppedAt = updates.droppedAt !== undefined
            ? normalizeToYYYYMMDD(updates.droppedAt)
            : (normalizeDateValue(existing.droppedAt) ?? null);
        const releaseDate = updates.releaseDate !== undefined
            ? normalizeToYYYYMMDD(updates.releaseDate)
            : (normalizeDateValue(existing.releaseDate) ?? null);
        const monthKey = this.computeAndValidateMonthKey({
            status,
            startedAt,
            completedAt,
            droppedAt,
            releaseDate,
        });
        const platformId = updates.platform !== undefined
            ? await this.resolvePlatformId(updates.platform)
            : (existing.platformId ?? null);
        existing.status = status;
        existing.monthKey = monthKey;
        if (updates.name !== undefined)
            existing.name = updates.name;
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
        if (updates.notes !== undefined)
            existing.notes = updates.notes ?? null;
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
    async clearAllJourneyGames(username, year) {
        const userId = await this.getUserId(username);
        await this.journeyGameRepo.delete({
            userId,
            monthKey: (0, typeorm_2.Like)(`${year}-%`),
        });
        return this.emptyYearData(year);
    }
};
exports.JourneysService = JourneysService;
exports.JourneysService = JourneysService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Platform_1.Platform)),
    __param(2, (0, typeorm_1.InjectRepository)(Genre_1.Genre)),
    __param(3, (0, typeorm_1.InjectRepository)(JourneyGame_1.JourneyGame)),
    __param(4, (0, typeorm_1.InjectRepository)(JourneyGameGenre_1.JourneyGameGenre)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], JourneysService);
let JourneysController = class JourneysController {
    journeysService;
    constructor(journeysService) {
        this.journeysService = journeysService;
    }
    getJourneyData(username, year) {
        const y = Number(year);
        if (!Number.isFinite(y))
            throw new common_1.BadRequestException('year inválido.');
        return this.journeysService.getJourneyData(username, y);
    }
    addJourneyGame(username, year, body) {
        const y = Number(year);
        if (!Number.isFinite(y))
            throw new common_1.BadRequestException('year inválido.');
        return this.journeysService.addJourneyGame(username, y, body);
    }
    updateJourneyGame(username, year, rawgGameId, body) {
        const y = Number(year);
        if (!Number.isFinite(y))
            throw new common_1.BadRequestException('year inválido.');
        return this.journeysService.updateJourneyGame(username, y, rawgGameId, body);
    }
    clearAllJourneyGames(username, year) {
        const y = Number(year);
        if (!Number.isFinite(y))
            throw new common_1.BadRequestException('year inválido.');
        return this.journeysService.clearAllJourneyGames(username, y);
    }
};
exports.JourneysController = JourneysController;
__decorate([
    (0, common_1.Get)(':username/:year'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "getJourneyData", null);
__decorate([
    (0, common_1.Post)(':username/:year/games'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('year')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, AddJourneyGameDto]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "addJourneyGame", null);
__decorate([
    (0, common_1.Patch)(':username/:year/games/:rawgGameId'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('year')),
    __param(2, (0, common_1.Param)('rawgGameId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, UpdateJourneyGameDto]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "updateJourneyGame", null);
__decorate([
    (0, common_1.Delete)(':username/:year'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "clearAllJourneyGames", null);
exports.JourneysController = JourneysController = __decorate([
    (0, common_1.Controller)('api/journeys'),
    __metadata("design:paramtypes", [JourneysService])
], JourneysController);
//# sourceMappingURL=journeys.controller.js.map