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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const JourneyGame_1 = require("./JourneyGame");
const UserPlatform_1 = require("./UserPlatform");
let User = class User {
    id;
    username;
    email;
    passwordHash;
    name;
    nickname;
    createdAt;
    avatarUrl;
    bannerUrl;
    bannerPosition;
    favoriteGameName;
    favoriteGameCover;
    favoriteGenreName;
    favoriteGenreCover;
    userPlatforms;
    journeyGames;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'password_hash' }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'created_at', default: () => 'now()' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'avatar_url', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'banner_url', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "bannerUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'banner_position', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "bannerPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'favorite_game_name', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "favoriteGameName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'favorite_game_cover', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "favoriteGameCover", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'favorite_genre_name', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "favoriteGenreName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'favorite_genre_cover', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "favoriteGenreCover", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserPlatform_1.UserPlatform, (up) => up.user),
    __metadata("design:type", Array)
], User.prototype, "userPlatforms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => JourneyGame_1.JourneyGame, (jg) => jg.user),
    __metadata("design:type", Array)
], User.prototype, "journeyGames", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], User);
//# sourceMappingURL=User.js.map