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
exports.JourneyGame = void 0;
const typeorm_1 = require("typeorm");
const journey_status_enum_1 = require("../journey-status.enum");
const User_1 = require("./User");
const JourneyGameGenre_1 = require("./JourneyGameGenre");
const Platform_1 = require("./Platform");
let JourneyGame = class JourneyGame {
    id;
    userId;
    user;
    rawgGameId;
    name;
    coverImageUrl;
    status;
    startedAt;
    completedAt;
    droppedAt;
    hoursPlayed;
    rating;
    platformId;
    platform;
    monthKey;
    notes;
    verdict;
    is100Percent;
    droppedReason;
    releaseDate;
    hasDemo;
    journeyGameGenres;
    genres;
};
exports.JourneyGame = JourneyGame;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], JourneyGame.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", name: "user_id" }),
    __metadata("design:type", String)
], JourneyGame.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (u) => u.journeyGames, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], JourneyGame.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", name: "rawg_game_id" }),
    __metadata("design:type", String)
], JourneyGame.prototype, "rawgGameId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], JourneyGame.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", name: "cover_image_url", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "coverImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: journey_status_enum_1.JourneyStatus,
        enumName: "journey_status",
        name: "status",
    }),
    __metadata("design:type", String)
], JourneyGame.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", name: "started_at", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", name: "completed_at", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", name: "dropped_at", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "droppedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", name: "hours_played", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "hoursPlayed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 4, scale: 2, name: "rating", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", name: "platform_id", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "platformId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Platform_1.Platform, { nullable: true, onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "platform_id" }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "char", length: 7, name: "month_key" }),
    __metadata("design:type", String)
], JourneyGame.prototype, "monthKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "verdict", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", name: "is_100_percent", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "is100Percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", name: "dropped_reason", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "droppedReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", name: "release_date", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "releaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", name: "has_demo", nullable: true }),
    __metadata("design:type", Object)
], JourneyGame.prototype, "hasDemo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => JourneyGameGenre_1.JourneyGameGenre, (jgg) => jgg.journeyGame),
    __metadata("design:type", Array)
], JourneyGame.prototype, "journeyGameGenres", void 0);
exports.JourneyGame = JourneyGame = __decorate([
    (0, typeorm_1.Entity)({ name: "journey_games" }),
    (0, typeorm_1.Index)(["userId", "monthKey"]),
    (0, typeorm_1.Index)(["userId", "status"]),
    (0, typeorm_1.Unique)(["userId", "monthKey", "rawgGameId"])
], JourneyGame);
//# sourceMappingURL=JourneyGame.js.map