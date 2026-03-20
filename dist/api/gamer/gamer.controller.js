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
exports.GamerController = void 0;
const common_1 = require("@nestjs/common");
const games_query_dto_js_1 = require("./dto/games-query.dto.js");
const rawg_list_query_dto_js_1 = require("./dto/rawg-list-query.dto.js");
const gamer_service_js_1 = require("./gamer.service.js");
let GamerController = class GamerController {
    gamerService;
    constructor(gamerService) {
        this.gamerService = gamerService;
    }
    getGames(query) {
        return this.gamerService.games(query);
    }
    getPlatforms(query) {
        return this.gamerService.platforms(query);
    }
    getGenres(query) {
        return this.gamerService.genres(query);
    }
};
exports.GamerController = GamerController;
__decorate([
    (0, common_1.Get)('games'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [games_query_dto_js_1.GamesQueryDto]),
    __metadata("design:returntype", void 0)
], GamerController.prototype, "getGames", null);
__decorate([
    (0, common_1.Get)('platforms'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rawg_list_query_dto_js_1.RawgListQueryDto]),
    __metadata("design:returntype", void 0)
], GamerController.prototype, "getPlatforms", null);
__decorate([
    (0, common_1.Get)('genres'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rawg_list_query_dto_js_1.RawgListQueryDto]),
    __metadata("design:returntype", void 0)
], GamerController.prototype, "getGenres", null);
exports.GamerController = GamerController = __decorate([
    (0, common_1.Controller)('api/gamer'),
    __metadata("design:paramtypes", [gamer_service_js_1.GamerService])
], GamerController);
//# sourceMappingURL=gamer.controller.js.map