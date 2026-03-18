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
exports.JourneyGameGenre = void 0;
const typeorm_1 = require("typeorm");
const Genre_1 = require("./Genre");
const JourneyGame_1 = require("./JourneyGame");
let JourneyGameGenre = class JourneyGameGenre {
    journeyGameId;
    genreId;
    journeyGame;
    genre;
};
exports.JourneyGameGenre = JourneyGameGenre;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "bigint", name: "journey_game_id" }),
    __metadata("design:type", Number)
], JourneyGameGenre.prototype, "journeyGameId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "bigint", name: "genre_id" }),
    __metadata("design:type", Number)
], JourneyGameGenre.prototype, "genreId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => JourneyGame_1.JourneyGame, (jg) => jg.journeyGameGenres, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "journey_game_id" }),
    __metadata("design:type", JourneyGame_1.JourneyGame)
], JourneyGameGenre.prototype, "journeyGame", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Genre_1.Genre, (g) => g.journeyGameGenres, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "genre_id" }),
    __metadata("design:type", Genre_1.Genre)
], JourneyGameGenre.prototype, "genre", void 0);
exports.JourneyGameGenre = JourneyGameGenre = __decorate([
    (0, typeorm_1.Entity)({ name: "journey_game_genres" })
], JourneyGameGenre);
//# sourceMappingURL=JourneyGameGenre.js.map