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
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../../db/entities/User");
const Platform_1 = require("../../db/entities/Platform");
const UserPlatform_1 = require("../../db/entities/UserPlatform");
let UsersRepository = class UsersRepository {
    usersRepo;
    platformsRepo;
    userPlatformsRepo;
    constructor(usersRepo, platformsRepo, userPlatformsRepo) {
        this.usersRepo = usersRepo;
        this.platformsRepo = platformsRepo;
        this.userPlatformsRepo = userPlatformsRepo;
    }
    findUserWithPlatforms(normalizedUsername) {
        return this.usersRepo.findOne({
            where: { username: normalizedUsername },
            relations: ['userPlatforms', 'userPlatforms.platform'],
        });
    }
    saveUser(user) {
        return this.usersRepo.save(user);
    }
    async replaceUserPlatforms(userId, platforms) {
        await this.userPlatformsRepo.delete({ userId });
        for (const p of platforms) {
            const existing = await this.platformsRepo.findOne({
                where: { name: p.name },
            });
            const platformEntity = existing
                ? existing
                : await this.platformsRepo.save(this.platformsRepo.create({
                    name: p.name,
                    imageUrl: p.imageUrl,
                }));
            await this.userPlatformsRepo.save(this.userPlatformsRepo.create({
                userId,
                platformId: platformEntity.id,
            }));
        }
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Platform_1.Platform)),
    __param(2, (0, typeorm_1.InjectRepository)(UserPlatform_1.UserPlatform)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map