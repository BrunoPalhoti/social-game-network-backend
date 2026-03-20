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
exports.JourneysRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../../db/entities/User");
const Platform_1 = require("../../db/entities/Platform");
const Genre_1 = require("../../db/entities/Genre");
const JourneyGame_1 = require("../../db/entities/JourneyGame");
const JourneyGameGenre_1 = require("../../db/entities/JourneyGameGenre");
let JourneysRepository = class JourneysRepository {
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
    findUserByUsername(normalizedUsername) {
        return this.usersRepo.findOne({
            where: { username: normalizedUsername },
        });
    }
    findJourneyGamesForUserYear(userId, year) {
        return this.journeyGameRepo.find({
            where: { userId, monthKey: (0, typeorm_2.Like)(`${year}-%`) },
            relations: ['platform', 'journeyGameGenres', 'journeyGameGenres.genre'],
            order: { monthKey: 'ASC' },
        });
    }
    findJourneyGameByUserAndRawgId(userId, rawgGameId) {
        return this.journeyGameRepo.findOne({
            where: { userId, rawgGameId },
        });
    }
    async insertJourneyGame(entity) {
        return this.journeyGameRepo.save(entity);
    }
    createJourneyGameEntity(partial) {
        return this.journeyGameRepo.create(partial);
    }
    saveJourneyGame(entity) {
        return this.journeyGameRepo.save(entity);
    }
    async deleteJourneyGamesForUserYear(userId, year) {
        await this.journeyGameRepo
            .createQueryBuilder()
            .delete()
            .where('userId = :userId', { userId })
            .andWhere('monthKey LIKE :pattern', { pattern: `${year}-%` })
            .execute();
    }
    async replaceGenresForJourneyGame(journeyGameId, genresInput) {
        if (genresInput === undefined)
            return;
        const normalized = Array.from(new Set((genresInput ?? []).map((g) => (g ?? '').trim()).filter(Boolean)));
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
};
exports.JourneysRepository = JourneysRepository;
exports.JourneysRepository = JourneysRepository = __decorate([
    (0, common_1.Injectable)(),
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
], JourneysRepository);
//# sourceMappingURL=journeys.repository.js.map