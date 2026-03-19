"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("../db/entities/User");
const Platform_1 = require("../db/entities/Platform");
const Genre_1 = require("../db/entities/Genre");
const UserPlatform_1 = require("../db/entities/UserPlatform");
const JourneyGame_1 = require("../db/entities/JourneyGame");
const JourneyGameGenre_1 = require("../db/entities/JourneyGameGenre");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_1 = require("./auth/auth.service");
const users_controller_1 = require("./users/users.controller");
const journeys_controller_1 = require("./journeys/journeys.controller");
const gamer_controller_1 = require("./gamer/gamer.controller");
const auth_repository_1 = require("./auth/auth.repository");
let ApiModule = class ApiModule {
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                User_1.User,
                Platform_1.Platform,
                Genre_1.Genre,
                UserPlatform_1.UserPlatform,
                JourneyGame_1.JourneyGame,
                JourneyGameGenre_1.JourneyGameGenre,
            ]),
        ],
        controllers: [
            auth_controller_1.AuthController,
            users_controller_1.UsersController,
            journeys_controller_1.JourneysController,
            gamer_controller_1.GamerController,
        ],
        providers: [
            auth_service_1.AuthService,
            auth_repository_1.AuthRepository,
            users_controller_1.UsersService,
            journeys_controller_1.JourneysService,
            gamer_controller_1.RawgProxyService,
        ],
    })
], ApiModule);
//# sourceMappingURL=api.module.js.map