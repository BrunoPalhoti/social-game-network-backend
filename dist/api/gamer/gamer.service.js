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
exports.GamerService = void 0;
const common_1 = require("@nestjs/common");
const rawg_service_js_1 = require("../rawg/rawg.service.js");
const gamesFromQuery_factory_js_1 = require("./factory/gamesFromQuery/gamesFromQuery.factory.js");
const paginationFromQuery_factory_js_1 = require("./factory/paginationFromQuery/paginationFromQuery.factory.js");
let GamerService = class GamerService {
    rawgService;
    constructor(rawgService) {
        this.rawgService = rawgService;
    }
    games(query) {
        const params = (0, gamesFromQuery_factory_js_1.gamesFromQueryFactory)(query);
        return this.rawgService.games(params);
    }
    platforms(query) {
        const params = (0, paginationFromQuery_factory_js_1.paginationFromQueryFactory)(query);
        return this.rawgService.platforms(params);
    }
    genres(query) {
        const params = (0, paginationFromQuery_factory_js_1.paginationFromQueryFactory)(query);
        return this.rawgService.genres(params);
    }
};
exports.GamerService = GamerService;
exports.GamerService = GamerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rawg_service_js_1.RawgService])
], GamerService);
//# sourceMappingURL=gamer.service.js.map