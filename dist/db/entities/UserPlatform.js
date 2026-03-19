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
exports.UserPlatform = void 0;
const typeorm_1 = require("typeorm");
const Platform_1 = require("./Platform");
const User_1 = require("./User");
let UserPlatform = class UserPlatform {
    userId;
    platformId;
    user;
    platform;
};
exports.UserPlatform = UserPlatform;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], UserPlatform.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'bigint', name: 'platform_id' }),
    __metadata("design:type", Number)
], UserPlatform.prototype, "platformId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (u) => u.userPlatforms, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], UserPlatform.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Platform_1.Platform, (p) => p.userPlatforms, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'platform_id' }),
    __metadata("design:type", Platform_1.Platform)
], UserPlatform.prototype, "platform", void 0);
exports.UserPlatform = UserPlatform = __decorate([
    (0, typeorm_1.Entity)({ name: 'user_platforms' })
], UserPlatform);
//# sourceMappingURL=UserPlatform.js.map