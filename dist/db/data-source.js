"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Platform_1 = require("./entities/Platform");
const Genre_1 = require("./entities/Genre");
const UserPlatform_1 = require("./entities/UserPlatform");
const JourneyGame_1 = require("./entities/JourneyGame");
const JourneyGameGenre_1 = require("./entities/JourneyGameGenre");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    entities: [User_1.User, Platform_1.Platform, Genre_1.Genre, UserPlatform_1.UserPlatform, JourneyGame_1.JourneyGame, JourneyGameGenre_1.JourneyGameGenre],
    migrations: process.env.NODE_ENV === "production" ? ["dist/migrations/*.js"] : ["src/migrations/*.ts"],
});
//# sourceMappingURL=data-source.js.map