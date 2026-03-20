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
exports.AuthRepository = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../../db/entities/User");
let AuthRepository = class AuthRepository {
    usersRepo;
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }
    async countUsersByUsernameOrEmail(username, email) {
        return this.usersRepo.count({
            where: [{ username }, { email }],
        });
    }
    async createUser(input) {
        const user = this.usersRepo.create({
            id: (0, crypto_1.randomUUID)(),
            username: input.username,
            email: input.email,
            passwordHash: input.passwordHash,
            name: input.name,
            nickname: input.nickname,
            createdAt: new Date(),
        });
        return this.usersRepo.save(user);
    }
    async findUserById(id) {
        return this.usersRepo.findOne({
            where: { id },
        });
    }
    async findUserWithPlatformsByUsername(username) {
        return this.usersRepo.findOne({
            where: { username },
            relations: ['userPlatforms', 'userPlatforms.platform'],
        });
    }
    async findAllUsersWithPlatformsOrdered() {
        return this.usersRepo.find({
            relations: ['userPlatforms', 'userPlatforms.platform'],
            order: { createdAt: 'ASC' },
        });
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map