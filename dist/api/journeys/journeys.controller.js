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
exports.JourneysController = void 0;
const common_1 = require("@nestjs/common");
const add_journey_game_dto_js_1 = require("./dto/add-journey-game.dto.js");
const update_journey_game_dto_js_1 = require("./dto/update-journey-game.dto.js");
const yearFromParam_factory_js_1 = require("./factory/yearFromParam/yearFromParam.factory.js");
const journeys_service_js_1 = require("./journeys.service.js");
let JourneysController = class JourneysController {
    journeysService;
    constructor(journeysService) {
        this.journeysService = journeysService;
    }
    getJourneyData(username, year) {
        const y = (0, yearFromParam_factory_js_1.yearFromParamFactory)(year);
        return this.journeysService.getJourneyData(username, y);
    }
    addJourneyGame(username, year, body) {
        const y = (0, yearFromParam_factory_js_1.yearFromParamFactory)(year);
        return this.journeysService.addJourneyGame(username, y, body);
    }
    updateJourneyGame(username, year, rawgGameId, body) {
        const y = (0, yearFromParam_factory_js_1.yearFromParamFactory)(year);
        return this.journeysService.updateJourneyGame(username, y, rawgGameId, body);
    }
    clearAllJourneyGames(username, year) {
        const y = (0, yearFromParam_factory_js_1.yearFromParamFactory)(year);
        return this.journeysService.clearAllJourneyGames(username, y);
    }
};
exports.JourneysController = JourneysController;
__decorate([
    (0, common_1.Get)(':username/:year'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "getJourneyData", null);
__decorate([
    (0, common_1.Post)(':username/:year/games'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('year')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, add_journey_game_dto_js_1.AddJourneyGameDto]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "addJourneyGame", null);
__decorate([
    (0, common_1.Patch)(':username/:year/games/:rawgGameId'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('year')),
    __param(2, (0, common_1.Param)('rawgGameId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_journey_game_dto_js_1.UpdateJourneyGameDto]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "updateJourneyGame", null);
__decorate([
    (0, common_1.Delete)(':username/:year'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], JourneysController.prototype, "clearAllJourneyGames", null);
exports.JourneysController = JourneysController = __decorate([
    (0, common_1.Controller)('api/journeys'),
    __metadata("design:paramtypes", [journeys_service_js_1.JourneysService])
], JourneysController);
//# sourceMappingURL=journeys.controller.js.map