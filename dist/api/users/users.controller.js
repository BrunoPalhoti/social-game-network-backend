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
exports.UsersController = exports.UsersService = exports.UpdateUserProfileDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../../db/entities/User");
const Platform_1 = require("../../db/entities/Platform");
const UserPlatform_1 = require("../../db/entities/UserPlatform");
class UpdateUserProfileDto {
    favoriteGame;
    favoriteGameCover;
    favoriteGenre;
    favoriteGenreCover;
    platforms;
    avatarUrl;
    bannerUrl;
    bannerPosition;
}
exports.UpdateUserProfileDto = UpdateUserProfileDto;
let UsersService = class UsersService {
    usersRepo;
    platformsRepo;
    userPlatformsRepo;
    constructor(usersRepo, platformsRepo, userPlatformsRepo) {
        this.usersRepo = usersRepo;
        this.platformsRepo = platformsRepo;
        this.userPlatformsRepo = userPlatformsRepo;
    }
    normalizeUsername(username) {
        return username.trim().toLowerCase();
    }
    toBannerPosition(bannerPosition) {
        if (bannerPosition === undefined)
            return null;
        if (typeof bannerPosition === 'number') {
            return Number.isFinite(bannerPosition)
                ? String(Math.round(bannerPosition))
                : null;
        }
        return bannerPosition;
    }
    async getUserOrThrow(username) {
        const norm = this.normalizeUsername(username);
        const user = await this.usersRepo.findOne({
            where: { username: norm },
            relations: ['userPlatforms', 'userPlatforms.platform'],
        });
        if (!user)
            throw new common_1.HttpException('Usuário não encontrado.', 404);
        return user;
    }
    toProfileResponse(user) {
        const platforms = (user.userPlatforms ?? [])
            .map((up) => up.platform)
            .filter((p) => !!p)
            .map((p) => ({ name: p.name, imageUrl: p.imageUrl ?? null }));
        return {
            username: user.username,
            name: user.name,
            nickname: user.nickname,
            platforms: platforms.length > 0 ? platforms : undefined,
            favoriteGame: user.favoriteGameName ?? undefined,
            favoriteGameCover: user.favoriteGameCover ?? undefined,
            favoriteGenre: user.favoriteGenreName ?? undefined,
            favoriteGenreCover: user.favoriteGenreCover ?? undefined,
            avatarUrl: user.avatarUrl ?? null,
            bannerUrl: user.bannerUrl ?? null,
            bannerPosition: user.bannerPosition === null || user.bannerPosition === undefined
                ? 'center'
                :
                    user.bannerPosition === 'top' ||
                        user.bannerPosition === 'center' ||
                        user.bannerPosition === 'bottom'
                        ? user.bannerPosition
                        : Number.isFinite(Number(user.bannerPosition))
                            ? Number(user.bannerPosition)
                            : 'center',
        };
    }
    async getProfile(username) {
        const user = await this.getUserOrThrow(username);
        return this.toProfileResponse(user);
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
            user.bannerPosition = this.toBannerPosition(updates.bannerPosition);
        }
        if (updates.platforms !== undefined) {
            await this.userPlatformsRepo.delete({ userId: user.id });
            const normalized = (updates.platforms ?? [])
                .map((p) => ({ name: p.name.trim(), imageUrl: p.imageUrl ?? null }))
                .filter((p) => !!p.name);
            for (const p of normalized) {
                const platform = await this.platformsRepo.findOne({
                    where: { name: p.name },
                });
                const platformEntity = platform
                    ? platform
                    : await this.platformsRepo.save(this.platformsRepo.create({
                        name: p.name,
                        imageUrl: p.imageUrl,
                    }));
                await this.userPlatformsRepo.save(this.userPlatformsRepo.create({
                    userId: user.id,
                    platformId: platformEntity.id,
                }));
            }
        }
        await this.usersRepo.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Platform_1.Platform)),
    __param(2, (0, typeorm_1.InjectRepository)(UserPlatform_1.UserPlatform)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getProfile(username) {
        return this.usersService.getProfile(username);
    }
    updateProfile(username, body) {
        return this.usersService.updateProfile(username, body);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(':username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)(':username/profile'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserProfileDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map