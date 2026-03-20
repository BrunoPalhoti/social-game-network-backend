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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneysService = void 0;
const common_1 = require("@nestjs/common");
const normalizeUsername_factory_js_1 = require("../auth/factory/normalizeUsername/normalizeUsername.factory.js");
const buildJourneyYearView_factory_js_1 = require("./factory/buildJourneyYearView/buildJourneyYearView.factory.js");
const journeyGameDtoFromEntity_factory_js_1 = require("./factory/journeyGameDtoFromEntity/journeyGameDtoFromEntity.factory.js");
const monthKey_factory_js_1 = require("./factory/monthKey/monthKey.factory.js");
const journeys_repository_js_1 = require("./journeys.repository.js");
let JourneysService = class JourneysService {
    journeysRepository;
    constructor(journeysRepository) {
        this.journeysRepository = journeysRepository;
    }
    async getUserId(username) {
        const user = await this.journeysRepository.findUserByUsername((0, normalizeUsername_factory_js_1.normalizeUsername)(username));
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
    async getJourneyData(username, year) {
        const userId = await this.getUserId(username);
        const games = await this.journeysRepository.findJourneyGamesForUserYear(userId, year);
        if (games.length === 0)
            return this.emptyYearData(year);
        const dtos = games.map((g) => (0, journeyGameDtoFromEntity_factory_js_1.journeyGameDtoFromEntity)(g));
        return (0, buildJourneyYearView_factory_js_1.buildJourneyYearDataFromDtos)(dtos, year);
    }
    async addJourneyGame(username, year, payload) {
        const userId = await this.getUserId(username);
        const startedAt = (0, monthKey_factory_js_1.normalizeToYYYYMMDD)(payload.startedAt);
        const completedAt = (0, monthKey_factory_js_1.normalizeToYYYYMMDD)(payload.completedAt);
        const droppedAt = (0, monthKey_factory_js_1.normalizeToYYYYMMDD)(payload.droppedAt);
        const releaseDate = (0, monthKey_factory_js_1.normalizeToYYYYMMDD)(payload.releaseDate);
        const monthKey = (0, monthKey_factory_js_1.monthKeyFromJourneyFields)({
            status: payload.status,
            startedAt,
            completedAt,
            droppedAt,
            releaseDate,
        });
        const platformId = await this.journeysRepository.resolvePlatformId(payload.platform);
        const entity = this.journeysRepository.createJourneyGameEntity({
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
            await this.journeysRepository.insertJourneyGame(entity);
        }
        catch {
            throw new common_1.HttpException('Falha ao salvar jogo da jornada (possível duplicidade).', common_1.HttpStatus.CONFLICT);
        }
        await this.journeysRepository.replaceGenresForJourneyGame(entity.id, payload.genres);
        return this.getJourneyData(username, year);
    }
    async updateJourneyGame(username, year, rawgGameId, updates) {
        const userId = await this.getUserId(username);
        const existing = await this.journeysRepository.findJourneyGameByUserAndRawgId(userId, rawgGameId);
        if (!existing)
            throw new common_1.HttpException('Jogo não encontrado.', 404);
        const status = updates.status ?? existing.status;
        const startedAt = updates.startedAt !== undefined
            ? (0, monthKey_factory_js_1.normalizeToYYYYMMDD)(updates.startedAt)
            : ((0, journeyGameDtoFromEntity_factory_js_1.normalizeDateValue)(existing.startedAt) ?? null);
        const completedAt = updates.completedAt !== undefined
            ? (0, monthKey_factory_js_1.normalizeToYYYYMMDD)(updates.completedAt)
            : ((0, journeyGameDtoFromEntity_factory_js_1.normalizeDateValue)(existing.completedAt) ?? null);
        const droppedAt = updates.droppedAt !== undefined
            ? (0, monthKey_factory_js_1.normalizeToYYYYMMDD)(updates.droppedAt)
            : ((0, journeyGameDtoFromEntity_factory_js_1.normalizeDateValue)(existing.droppedAt) ?? null);
        const releaseDate = updates.releaseDate !== undefined
            ? (0, monthKey_factory_js_1.normalizeToYYYYMMDD)(updates.releaseDate)
            : ((0, journeyGameDtoFromEntity_factory_js_1.normalizeDateValue)(existing.releaseDate) ?? null);
        const monthKey = (0, monthKey_factory_js_1.monthKeyFromJourneyFields)({
            status,
            startedAt,
            completedAt,
            droppedAt,
            releaseDate,
        });
        const platformId = updates.platform !== undefined
            ? await this.journeysRepository.resolvePlatformId(updates.platform)
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
        await this.journeysRepository.saveJourneyGame(existing);
        await this.journeysRepository.replaceGenresForJourneyGame(existing.id, updates.genres);
        return this.getJourneyData(username, year);
    }
    async clearAllJourneyGames(username, year) {
        const userId = await this.getUserId(username);
        await this.journeysRepository.deleteJourneyGamesForUserYear(userId, year);
        return this.emptyYearData(year);
    }
};
exports.JourneysService = JourneysService;
exports.JourneysService = JourneysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [journeys_repository_js_1.JourneysRepository])
], JourneysService);
//# sourceMappingURL=journeys.service.js.map