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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const normalizeUsername_factory_js_1 = require("../auth/factory/normalizeUsername/normalizeUsername.factory.js");
const bannerPositionToDb_factory_js_1 = require("./factory/bannerPositionToDb/bannerPositionToDb.factory.js");
const normalizePlatformSelections_factory_js_1 = require("./factory/normalizePlatformSelections/normalizePlatformSelections.factory.js");
const userProfileResponseFromEntity_factory_js_1 = require("./factory/userProfileResponseFromEntity/userProfileResponseFromEntity.factory.js");
const users_repository_js_1 = require("./users.repository.js");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async getUserOrThrow(username) {
        const user = await this.usersRepository.findUserWithPlatforms((0, normalizeUsername_factory_js_1.normalizeUsername)(username));
        if (!user)
            throw new common_1.HttpException('Usuário não encontrado.', 404);
        return user;
    }
    async getProfile(username) {
        const user = await this.getUserOrThrow(username);
        return (0, userProfileResponseFromEntity_factory_js_1.userProfileResponseFromEntity)(user);
    }
    async updateProfile(username, updates) {
        const user = await this.getUserOrThrow(username);
        if (updates.favoriteGame !== undefined)
            user.favoriteGameName = updates.favoriteGame ?? null;
        if (updates.favoriteGameCover !== undefined)
            user.favoriteGameCover = updates.favoriteGameCover ?? null;
        if (updates.favoriteGenre !== undefined)
            user.favoriteGenreName = updates.favoriteGenre ?? null;
        if (updates.favoriteGenreCover !== undefined)
            user.favoriteGenreCover = updates.favoriteGenreCover ?? null;
        if (updates.avatarUrl !== undefined)
            user.avatarUrl = updates.avatarUrl ?? null;
        if (updates.bannerUrl !== undefined)
            user.bannerUrl = updates.bannerUrl ?? null;
        if (updates.bannerPosition !== undefined) {
            user.bannerPosition = (0, bannerPositionToDb_factory_js_1.bannerPositionToDb)(updates.bannerPosition);
        }
        if (updates.platforms !== undefined) {
            const normalized = (0, normalizePlatformSelections_factory_js_1.normalizePlatformSelections)(updates.platforms);
            await this.usersRepository.replaceUserPlatforms(user.id, normalized);
        }
        await this.usersRepository.saveUser(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_js_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map